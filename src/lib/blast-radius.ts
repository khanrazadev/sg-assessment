import {
  DetectorType,
  TransformedGraph,
  GraphNode,
  GraphEdge,
  SendgridRaw,
  PostmanRaw,
  OpenAIRaw,
} from "@/types/blast-radius";

export const HORIZONTAL_SPACING = 350;
export const VERTICAL_SPACING = 160;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const createNode = (
  id: string,
  label: string,
  x: number,
  y: number,
  props: Partial<GraphNode["data"]> & { parentId?: string } = {}
): GraphNode => {
  const { parentId, ...data } = props;
  return {
    id,
    type: "custom",
    position: { x, y },
    data: {
      label,
      id,         // self-reference so FlowNode can call onToggle(id)
      parentId,   // stored in data for canvas filtering
      ...data,
    },
  };
};

const createEdge = (source: string, target: string, animated = false): GraphEdge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  type: "smoothstep",
  animated,
  style: { stroke: "#CBD5E1", strokeWidth: 2 },
});

// ---------------------------------------------------------------------------
// SendGrid  —  4 levels:
//   L1: root   (API Key / auth)
//   L2: sg     (SendGrid service)
//   L3: scope-* (Mail Send, Alerts, …)
//   L4: perm-*  (mail.send, …)
// ---------------------------------------------------------------------------

export function transformSendgrid(data: SendgridRaw): TransformedGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // L1 — Auth key root
  nodes.push(
    createNode("root", data.key_type, 0, 0, {
      type: "auth",
      level: 1,
      hasChildren: true,
      score: data.key_type === "Full Access Key" ? "Critical" : "Medium",
      isRisk: data.key_type === "Full Access Key",
      sublabel: data["2fa_required"] ? "2FA enabled" : "2FA disabled",
    })
  );

  // L2 — Service node
  nodes.push(
    createNode("sg", "SendGrid", HORIZONTAL_SPACING, 0, {
      type: "service",
      level: 2,
      parentId: "root",
      hasChildren: true,
      sublabel: `${data.total_scopes} scopes · ${data.total_raw_scopes} raw`,
    })
  );
  edges.push(createEdge("root", "sg"));

  // Deduplicate scopes from data
  const scopesMap = new Map<string, Set<string>>();
  data.scopes.forEach((s) => {
    if (!scopesMap.has(s.scope)) scopesMap.set(s.scope, new Set());
    s.permissions.forEach((p) => scopesMap.get(s.scope)!.add(p));
  });

  const uniqueScopes = Array.from(scopesMap.entries()).slice(0, 6);
  const totalScopes = uniqueScopes.length;

  uniqueScopes.forEach(([scopeName, permSet], i) => {
    // L3 — Scope / category
    const scopeId = `scope-${i}`;
    const yPos = (i - Math.floor(totalScopes / 2)) * VERTICAL_SPACING;

    nodes.push(
      createNode(scopeId, scopeName, HORIZONTAL_SPACING * 2, yPos, {
        type: "scope",
        level: 3,
        parentId: "sg",
        hasChildren: true,
      })
    );
    edges.push(createEdge("sg", scopeId));

    // L4 — Permissions (max 5 per scope to keep graph readable)
    const permissions = Array.from(permSet).slice(0, 5);
    const hasWrite = permissions.some(
      (p) =>
        p.includes("create") ||
        p.includes("update") ||
        p.includes("delete") ||
        p.toLowerCase().includes("write")
    );

    permissions.forEach((perm, j) => {
      const permId = `perm-${i}-${j}`;
      const permY = yPos + (j - Math.floor(permissions.length / 2)) * 80;

      nodes.push(
        createNode(permId, perm, HORIZONTAL_SPACING * 3, permY, {
          type: "permission",
          level: 4,
          parentId: scopeId,
          hasChildren: false,
          isRisk: hasWrite,
          score: hasWrite ? "High" : "Low",
        })
      );
      edges.push(createEdge(scopeId, permId));
    });
  });

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// OpenAI  —  4 levels:
//   L1: root   (API Key / auth)
//   L2: openai (OpenAI service)
//   L3: scope-* (endpoint groups)
//   L4: perm-*  (individual endpoint + permission)
// ---------------------------------------------------------------------------

export function transformOpenAI(data: OpenAIRaw): TransformedGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // L1 — Auth key root
  nodes.push(
    createNode("root", data.key_type, 0, 0, {
      type: "auth",
      level: 1,
      hasChildren: true,
      sublabel: data.is_restricted ? "Restricted Key" : "Full Access",
      score: data.is_restricted ? "Medium" : "Critical",
      isRisk: !data.is_restricted,
    })
  );

  // L2 — Service node
  const org = data.organizations?.[0];
  nodes.push(
    createNode("openai", "OpenAI", HORIZONTAL_SPACING, 0, {
      type: "service",
      level: 2,
      parentId: "root",
      hasChildren: true,
      sublabel: org ? `Org: ${org.title} · Role: ${org.role}` : undefined,
    })
  );
  edges.push(createEdge("root", "openai"));

  const scopes = data.scopes.slice(0, 5);
  const totalScopes = scopes.length;

  scopes.forEach((scope, i) => {
    // L3 — Scope group
    const scopeId = `scope-${i}`;
    const yPos = (i - Math.floor(totalScopes / 2)) * VERTICAL_SPACING;

    nodes.push(
      createNode(scopeId, scope.scope, HORIZONTAL_SPACING * 2, yPos, {
        type: "scope",
        level: 3,
        parentId: "openai",
        hasChildren: true,
        sublabel: scope.permission,
      })
    );
    edges.push(createEdge("openai", scopeId));

    // L4 — Individual endpoints as permissions
    scope.endpoints.slice(0, 4).forEach((endpoint, j) => {
      const permId = `perm-${i}-${j}`;
      const permY = yPos + (j - Math.floor(scope.endpoints.length / 2)) * 70;
      const hasWrite =
        scope.permission.includes("Write") || scope.permission.includes("Read & Write");

      nodes.push(
        createNode(permId, endpoint, HORIZONTAL_SPACING * 3, permY, {
          type: "permission",
          level: 4,
          parentId: scopeId,
          hasChildren: false,
          sublabel: scope.permission,
          isRisk: hasWrite,
          score: hasWrite ? "High" : "Low",
        })
      );
      edges.push(createEdge(scopeId, permId));
    });
  });

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Postman  —  4 levels:
//   L1: root       (API Key / auth)
//   L2: postman    (Postman service)
//   L3: role-*     (Team roles)
//   L4: ws-*       (Workspaces)
// ---------------------------------------------------------------------------

export function transformPostman(data: PostmanRaw): TransformedGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const user = data.user_info;

  // L1 — Auth root (user identity / API key)
  nodes.push(
    createNode("root", user.full_name || user.username, 0, 0, {
      type: "auth",
      level: 1,
      hasChildren: true,
      sublabel: user.email,
      score: "Medium",
    })
  );

  // L2 — Service node
  nodes.push(
    createNode("postman", "Postman", HORIZONTAL_SPACING, 0, {
      type: "service",
      level: 2,
      parentId: "root",
      hasChildren: true,
      sublabel: data.team_info?.name || "Personal",
    })
  );
  edges.push(createEdge("root", "postman"));

  const roles = data.roles.slice(0, 4);
  const totalRoles = roles.length;

  roles.forEach((role, i) => {
    // L3 — Role / category
    const roleId = `role-${i}`;
    const yPos = (i - Math.floor(totalRoles / 2)) * VERTICAL_SPACING;
    const isAdmin = role.scope === "admin" || role.permissions.toLowerCase().includes("all");

    nodes.push(
      createNode(roleId, role.scope, HORIZONTAL_SPACING * 2, yPos, {
        type: "role",
        level: 3,
        parentId: "postman",
        hasChildren: data.workspaces.length > 0,
        sublabel: role.permissions.slice(0, 60) + (role.permissions.length > 60 ? "…" : ""),
        isRisk: isAdmin,
        score: isAdmin ? "Critical" : "Medium",
      })
    );
    edges.push(createEdge("postman", roleId));

    // L4 — Workspaces
    data.workspaces.slice(0, 4).forEach((ws, j) => {
      const wsId = `ws-${i}-${j}`;
      const wsY = yPos + (j - Math.floor(data.workspaces.length / 2)) * 80;
      const isPublic = ws.visibility === "public";

      nodes.push(
        createNode(wsId, ws.name, HORIZONTAL_SPACING * 3, wsY, {
          type: "workspace",
          level: 4,
          parentId: roleId,
          hasChildren: false,
          sublabel: `${ws.type} · ${ws.visibility}`,
          isRisk: isPublic,
          score: isPublic ? "Critical" : "Low",
        })
      );
      edges.push(createEdge(roleId, wsId));
    });
  });

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function getBlastRadiusGraph(type: DetectorType, rawData: unknown): TransformedGraph {
  if (type === "sendgrid") return transformSendgrid(rawData as SendgridRaw);
  if (type === "openai") return transformOpenAI(rawData as OpenAIRaw);
  if (type === "postman") return transformPostman(rawData as PostmanRaw);
  return { nodes: [], edges: [] };
}

// ---------------------------------------------------------------------------
// Utility: collect all descendant IDs of a given node (for collapse-all)
// ---------------------------------------------------------------------------

export function collectDescendants(
  nodeId: string,
  allNodes: GraphNode[]
): Set<string> {
  const result = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    allNodes.forEach((n) => {
      if (n.data.parentId === current && !result.has(n.id)) {
        result.add(n.id);
        queue.push(n.id);
      }
    });
  }

  return result;
}
