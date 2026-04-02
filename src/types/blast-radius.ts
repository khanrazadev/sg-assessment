import { Node, Edge } from 'reactflow';

export type DetectorType = 'sendgrid' | 'postman' | 'openai';

// --- Raw JSON Types --- 

// Sendgrid
export interface SendgridRaw {
  "2fa_required": boolean;
  "key_type": string;
  "raw_scopes": string[];
  "scopes": {
    "access": string;
    "permissions": string[];
    "scope": string;
    "sub_scope": string;
  }[];
  "total_raw_scopes": number;
  "total_scopes": number;
  "valid_key": boolean;
}

// Postman
export interface PostmanRaw {
  "reference": string;
  "roles": { "permissions": string; "scope": string }[];
  "team_info": { "domain": string; "name": string };
  "total_roles": number;
  "total_workspaces": number;
  "user_info": { "email": string; "full_name": string; "roles": string[]; "team_domain": string; "team_name": string; "username": string };
  "valid_key": boolean;
  "workspaces": { "id": string; "link": string; "name": string; "type": string; "visibility": string }[];
}

// OpenAI
export interface OpenAIRaw {
  "is_admin": boolean;
  "is_restricted": boolean;
  "key_type": string;
  "organizations": { "default": boolean; "description": string; "id": string; "personal": boolean; "role": string; "title": string; "user": string }[];
  "permissions": string;
  "scopes": { "endpoints": string[]; "permission": string; "scope": string }[];
  "total_organizations": number;
  "total_scopes": number;
  "user_info": null | any;
  "user_info_available": boolean;
  "valid_token": boolean;
}

export type BlastRadiusInput = SendgridRaw | PostmanRaw | OpenAIRaw;

// --- Graph Visualization Types ---

export interface CustomNodeData {
  label: string;
  sublabel?: string;
  type?: 'service' | 'auth' | 'org' | 'scope' | 'permission' | 'user' | 'workspace' | 'role';
  isRisk?: boolean; // Highlight node if it represents a risk (e.g., full access)
  icon?: string;
  details?: string[];
  score?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export type GraphNode = Node<CustomNodeData>;
export type GraphEdge = Edge;

export interface TransformedGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
