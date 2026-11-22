import { BACKEND_API_BASE_URL } from './backendHealth';
import { getAuthCsrf } from './auth';
import type { ModuleCatalogNode } from '../types/learning';

export interface AdminTreeNode {
  kind: 'GROUP' | 'MODULE';
  /** Database GROUP ID or Module placement ID. */
  id: number;
  name: string;
  slug: string;
  active: boolean;
  children: AdminTreeNode[];
}

export interface AdminStructure {
  topicId: number;
  revision: string;
  nodes: AdminTreeNode[];
}

export interface GroupInput {
  name: string;
  slug: string;
  active: boolean;
}

export interface ModuleInput {
  name: string;
  slug: string;
}

export interface EditedModule {
  moduleId: number;
  placementId: number;
  topicId: number;
  name: string;
  slug: string;
}

export type GroupEditorTarget = { kind: 'create' } | { kind: 'edit'; group: AdminTreeNode };

const adminUrl = `${new URL(BACKEND_API_BASE_URL).origin}/api/admin`;

function invalid(message: string): never { throw new Error(message); }

function validateNode(value: unknown, depth = 0): value is AdminTreeNode {
  if (!value || typeof value !== 'object' || depth > 64) return false;
  const node = value as Record<string, unknown>;
  return (node.kind === 'GROUP' || node.kind === 'MODULE')
    && Number.isSafeInteger(node.id) && Number(node.id) > 0
    && typeof node.name === 'string' && typeof node.slug === 'string'
    && typeof node.active === 'boolean' && Array.isArray(node.children)
    && (node.kind === 'GROUP' || node.children.length === 0)
    && node.children.every((child) => validateNode(child, depth + 1));
}

export async function fetchAdminStructure(topicId: number, signal?: AbortSignal): Promise<AdminStructure> {
  const response = await fetch(`${adminUrl}/topics/${topicId}/structure`, {
    signal, cache: 'no-store', credentials: 'include', headers: { Accept: 'application/json' },
  });
  if (!response.ok) invalid(`Không tải được cấu trúc quản trị (HTTP ${response.status}).`);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object') invalid('Cấu trúc trả về không hợp lệ.');
  const structure = data as Record<string, unknown>;
  if (structure.topicId !== topicId || typeof structure.revision !== 'string'
    || !structure.revision || !Array.isArray(structure.nodes)
    || !structure.nodes.every((node) => validateNode(node))) {
    invalid('Cấu trúc trả về không hợp lệ.');
  }
  return structure as unknown as AdminStructure;
}

async function mutate<T>(url: string, method: 'POST' | 'PUT', payload: object): Promise<T> {
  const csrf = await getAuthCsrf();
  const response = await fetch(`${adminUrl}${url}`, {
    method, cache: 'no-store', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', [csrf.headerName]: csrf.token },
    body: JSON.stringify(payload),
  });
  if (response.status === 409) invalid('Cấu trúc đã thay đổi hoặc slug bị trùng. Hãy tải lại trước khi lưu.');
  if (response.status === 401 || response.status === 403) invalid('Phiên đăng nhập hoặc quyền ADMIN không hợp lệ.');
  if (response.status === 400) invalid('Dữ liệu không hợp lệ. Kiểm tra lại tên, slug và cấu trúc cây.');
  if (!response.ok) invalid(`Không lưu được dữ liệu (HTTP ${response.status}).`);
  return response.json() as Promise<T>;
}

export function createGroup(topicId: number, input: GroupInput, revision: string) {
  return mutate(`/topics/${topicId}/groups`, 'POST', { ...input, revision });
}

export function editGroup(groupId: number, input: GroupInput, revision: string) {
  return mutate(`/groups/${groupId}`, 'PUT', { ...input, revision });
}

/** Admin tree MODULE.id is a placement ID, not MODULE.ID. */
export function editModule(placementId: number, input: ModuleInput, revision: string) {
  return mutate<EditedModule>(`/module-placements/${placementId}/module`, 'PUT', { ...input, revision });
}

export function saveAdminStructure(topicId: number, revision: string, nodes: AdminTreeNode[]) {
  const serialize = (items: AdminTreeNode[]): object[] => items.map((node) => ({
    kind: node.kind, id: node.id, children: node.kind === 'GROUP' ? serialize(node.children) : [],
  }));
  return mutate<AdminStructure>(`/topics/${topicId}/structure`, 'PUT', { revision, nodes: serialize(nodes) });
}

export function projectAdminNodes(nodes: AdminTreeNode[]): ModuleCatalogNode[] {
  return nodes.map((node) => ({
    id: node.kind === 'GROUP' ? `GROUP_${node.id}` : `PLACEMENT_${node.id}`,
    nodeKey: node.kind === 'GROUP' ? `GROUP_${node.id}` : `PLACEMENT_${node.id}`,
    kind: node.kind, name: node.name, slug: node.slug, active: node.active,
    ...(node.kind === 'MODULE' ? { routeId: node.slug } : {}),
    children: projectAdminNodes(node.children),
  }));
}

type NodeRef = { kind: AdminTreeNode['kind']; id: number };

function same(node: AdminTreeNode, ref: NodeRef) { return node.id === ref.id && node.kind === ref.kind; }

/** Pure move operation. Returns null on invalid destinations (self, descendants, duplicate ids). */
export function moveTreeNode(
  source: AdminTreeNode[], from: NodeRef,
  target: NodeRef | null, position: 'before' | 'after' | 'inside',
): AdminTreeNode[] | null {
  if (!target && position !== 'inside') return null;
  const original = structuredClone(source);
  let extracted: AdminTreeNode | null = null;
  function remove(nodes: AdminTreeNode[]): boolean {
    const index = nodes.findIndex((node) => same(node, from));
    if (index >= 0) { extracted = nodes.splice(index, 1)[0]; return true; }
    for (const node of nodes) if (node.kind === 'GROUP' && remove(node.children)) return true;
    return false;
  }
  if (!remove(original) || !extracted) return null;
  const selected: AdminTreeNode = extracted;
  if (!target) { original.push(selected); return original; }
  const destination: NodeRef = target;
  function insert(nodes: AdminTreeNode[]): boolean {
    const index = nodes.findIndex((node) => same(node, destination));
    if (index >= 0) {
      if (position === 'inside') {
        if (nodes[index].kind !== 'GROUP') return false;
        nodes[index].children.push(selected);
      } else nodes.splice(index + (position === 'after' ? 1 : 0), 0, selected);
      return true;
    }
    for (const node of nodes) if (node.kind === 'GROUP' && insert(node.children)) return true;
    return false;
  }
  return insert(original) ? original : null;
}
