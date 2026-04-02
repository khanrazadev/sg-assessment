import { DetectorType, TransformedGraph, GraphNode, GraphEdge, SendgridRaw, PostmanRaw, OpenAIRaw } from "@/types/blast-radius";

export const HORIZONTAL_SPACING = 350;
export const VERTICAL_SPACING = 150;

// Generic helper to create a node
const createNode = (id: string, label: string, x: number, y: number, props: any = {}): GraphNode => ({
  id,
  type: 'custom',
  position: { x, y },
  data: { label, ...props },
});

// Generic helper to create an edge
const createEdge = (source: string, target: string, animated = false): GraphEdge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  type: 'smoothstep',
  animated,
  style: { stroke: '#CBD5E1', strokeWidth: 2 },
});

export function transformSendgrid(data: SendgridRaw): TransformedGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  let currentY = 0;

  // Root Node (Service)
  nodes.push(createNode('root', 'Sendgrid', 0, 0, { type: 'service', isRisk: false }));

  // Key Node
  const keyType = data.key_type;
  const isFullAccess = keyType === 'Full Access Key';
  nodes.push(createNode('key', keyType, HORIZONTAL_SPACING, 0, { type: 'auth', isRisk: isFullAccess, score: isFullAccess ? 'Critical' : 'Low' }));
  edges.push(createEdge('root', 'key'));

  // Scopes Column
  const scopesMap = new Map<string, { permissions: string[], subScopes: string[] }>();
  
  data.scopes.forEach(s => {
    if (!scopesMap.has(s.scope)) {
      scopesMap.set(s.scope, { permissions: new Set(), subScopes: new Set() } as any);
    }
    const mapEntry = scopesMap.get(s.scope)!;
    s.permissions.forEach(p => (mapEntry.permissions as any as Set<string>).add(p));
    if (s.sub_scope) {
       (mapEntry.subScopes as any as Set<string>).add(s.sub_scope);
    }
  });

  const uniqueScopes = Array.from(scopesMap.keys()).slice(0, 5); // Limit for visualization sanity
  
  uniqueScopes.forEach((scopeName, i) => {
     const scopeId = `scope-${i}`;
     const yPos = (i - Math.floor(uniqueScopes.length / 2)) * VERTICAL_SPACING;
     
     nodes.push(createNode(scopeId, scopeName, HORIZONTAL_SPACING * 2, yPos, { type: 'scope' }));
     edges.push(createEdge('key', scopeId));
     
     // The raw output doesn't give deep tree beyond this cleanly for visualization unless we parse sub_scopes. Let's just create a Permission node.
     const permId = `perm-${i}`;
     const permissionsList = Array.from((scopesMap.get(scopeName)!.permissions as any as Set<string>)).slice(0, 3); // Max 3 perms to show
     
     const hasWrite = permissionsList.some(p => p.includes('create') || p.includes('update') || p.includes('delete') || p.includes('Write'));
     
     nodes.push(createNode(permId, hasWrite ? 'Read & Write' : 'Read', HORIZONTAL_SPACING * 3, yPos, { 
        type: 'permission', 
        details: permissionsList,
        isRisk: hasWrite,
        score: hasWrite ? 'High' : 'Low'
     }));
     edges.push(createEdge(scopeId, permId));
  });

  return { nodes, edges };
}

export function transformOpenAI(data: OpenAIRaw): TransformedGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  nodes.push(createNode('root', 'OpenAI', 0, 0, { type: 'service' }));
  
  nodes.push(createNode('key', data.key_type, HORIZONTAL_SPACING, 0, { type: 'auth', sublabel: data.is_restricted ? 'Restricted' : 'Full Access' }));
  edges.push(createEdge('root', 'key'));

  if (data.organizations && data.organizations.length > 0) {
     const org = data.organizations[0];
     nodes.push(createNode('org', org.title || 'Organization', HORIZONTAL_SPACING * 2, 0, { type: 'org', sublabel: `Role: ${org.role}` }));
     edges.push(createEdge('key', 'org'));

     data.scopes.slice(0, 4).forEach((scope, i) => {
        const yPos = (i - 1.5) * VERTICAL_SPACING;
        const scopeId = `scope-${i}`;
        const permId = `perm-${i}`;

        nodes.push(createNode(scopeId, scope.scope, HORIZONTAL_SPACING * 3, yPos, { type: 'scope', details: scope.endpoints.slice(0, 2) }));
        edges.push(createEdge('org', scopeId));

        nodes.push(createNode(permId, scope.permission, HORIZONTAL_SPACING * 4, yPos, { 
           type: 'permission',
           isRisk: scope.permission.includes('Write'),
           score: scope.permission.includes('Write') ? 'High' : 'Low'
        }));
        edges.push(createEdge(scopeId, permId));
     });
  }

  return { nodes, edges };
}

export function transformPostman(data: PostmanRaw): TransformedGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  nodes.push(createNode('root', 'Postman', 0, 0, { type: 'service' }));
  
  const user = data.user_info;
  nodes.push(createNode('user', user.username || user.full_name, HORIZONTAL_SPACING, 0, { type: 'user', sublabel: user.email }));
  edges.push(createEdge('root', 'user'));

  if (data.roles && data.roles.length > 0) {
      const role = data.roles[0];
      nodes.push(createNode('role', role.scope, HORIZONTAL_SPACING * 2, 0, { type: 'role', details: [role.permissions] }));
      edges.push(createEdge('user', 'role'));

      data.workspaces.slice(0, 3).forEach((ws, i) => {
         const yPos = (i - 1) * VERTICAL_SPACING;
         const wsId = `ws-${ws.id}`;
         
         nodes.push(createNode(wsId, ws.name, HORIZONTAL_SPACING * 3, yPos, { 
            type: 'workspace', 
            sublabel: `Type: ${ws.type}`,
            isRisk: ws.visibility === 'public', // example risk
            score: ws.visibility === 'public' ? 'Critical' : 'Medium'
         }));
         edges.push(createEdge('role', wsId));
      });
  }

  return { nodes, edges };
}

export function getBlastRadiusGraph(type: DetectorType, rawData: any): TransformedGraph {
   if (type === 'sendgrid') return transformSendgrid(rawData as SendgridRaw);
   if (type === 'openai') return transformOpenAI(rawData as OpenAIRaw);
   if (type === 'postman') return transformPostman(rawData as PostmanRaw);
   
   return { nodes: [], edges: [] };
}
