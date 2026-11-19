import { useEffect, useMemo, useState, type DragEvent, type FormEvent } from 'react';
import {
  createGroup, editGroup, moveTreeNode, saveAdminStructure,
  type AdminStructure, type AdminTreeNode, type GroupEditorTarget,
} from '../data/groupAdmin';

type GroupLanguage = 'vi' | 'en';

export function GroupFormDialog({ topicId, revision, target, language, onClose, onSaved, onReload }: {
  topicId: number;
  revision: string;
  target: GroupEditorTarget;
  language: GroupLanguage;
  onClose: () => void;
  onSaved: () => void;
  onReload: () => void;
}) {
  const isVi = language === 'vi';
  const group = target.kind === 'edit' ? target.group : null;
  const [name, setName] = useState(group?.name ?? '');
  const [slug, setSlug] = useState(group?.slug ?? '');
  const [active, setActive] = useState(group?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !saving) onClose(); };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [saving, onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const payload = { name: name.trim(), slug: slug.trim(), active };
      if (group) await editGroup(group.id, payload, revision);
      else await createGroup(topicId, payload, revision);
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally { setSaving(false); }
  }

  const title = group
    ? (isVi ? 'Chỉnh sửa Group' : 'Edit Group')
    : (isVi ? 'Thêm Group cấp 1' : 'Add root Group');

  return (
    <div className="catalog-editor-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-label={title} className="catalog-editor group-form-dialog">
        <div className="catalog-editor__heading">
          <div><span className="catalog-editor__eyebrow">ADMIN · GROUP</span><h2>{title}</h2></div>
          <button type="button" className="catalog-editor__close" disabled={saving} onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className="catalog-editor__context">
          {isVi ? 'Topic hiện tại được cố định. Không thể chuyển Group sang Topic khác.'
            : 'The current Topic is fixed. Moving Groups between Topics is disabled.'}
        </p>
        <form className="catalog-editor__form" onSubmit={(event) => void submit(event)}>
          <label><span>GROUP NAME <em>*</em></span>
            <input autoFocus required maxLength={200} value={name} placeholder="Spring cloud"
              onChange={(event) => setName(event.target.value)} />
          </label>
          <label><span>SLUG <em>*</em></span>
            <input required maxLength={150} pattern="[a-z0-9]+(-[a-z0-9]+)*"
              spellCheck={false} value={slug} placeholder="spring-cloud"
              onChange={(event) => setSlug(event.target.value.toLowerCase())} />
            <small>{isVi ? 'Slug không được trùng với Group/Module khác trong Topic.'
              : 'Slug must be unique among Groups and Modules in this Topic.'}</small>
          </label>
          <label className="group-form-dialog__checkbox">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
            <span>{isVi ? 'Đang hoạt động (Active)' : 'Active'}</span>
          </label>
          {!group && <p className="catalog-editor__hint">
            {isVi ? 'Group mới luôn ở cấp gốc, SORT_ORDER tự động là MAX + 1.'
              : 'New Groups are always created at the root, SORT_ORDER = MAX + 1.'}
          </p>}
          {error && <p role="alert" className="catalog-editor__error">{error}
            {error.includes('tải lại') && <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost"
              onClick={onReload}>{isVi ? 'Tải lại cấu trúc' : 'Reload structure'}</button>}
          </p>}
          <div className="catalog-editor__actions">
            <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost" disabled={saving} onClick={onClose}>
              {isVi ? 'Hủy' : 'Cancel'}
            </button>
            <button type="submit" className="catalog-admin-btn" disabled={saving}>
              {saving ? (isVi ? 'Đang lưu...' : 'Saving...') : (isVi ? 'Lưu Group' : 'Save Group')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

type Ref = Pick<AdminTreeNode, 'id' | 'kind'>;
type DropPosition = 'before' | 'after' | 'inside';

function sameNode(a: Ref, b: Ref) { return a.id === b.id && a.kind === b.kind; }

/** Changes are local until Save; the backend validates and commits the complete tree atomically. */
export function GroupStructureDialog({ topicId, initial, language, onClose, onSaved, onReload }: {
  topicId: number;
  initial: AdminStructure;
  language: GroupLanguage;
  onClose: () => void;
  onSaved: () => void;
  onReload: () => void;
}) {
  const isVi = language === 'vi';
  const [draft, setDraft] = useState(() => structuredClone(initial.nodes));
  const [dragged, setDragged] = useState<Ref | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial.nodes), [draft, initial.nodes]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function close() {
    if (saving) return;
    if (dirty && !window.confirm(isVi ? 'Hủy các thay đổi chưa lưu?' : 'Discard unsaved changes?')) return;
    onClose();
  }

  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  });

  function move(from: Ref, target: Ref | null, position: DropPosition) {
    const next = moveTreeNode(draft, from, target, position);
    if (next) { setDraft(next); setError(''); }
  }

  function locate(nodes: AdminTreeNode[], ref: Ref,
    parent: AdminTreeNode | null = null): { siblings: AdminTreeNode[]; index: number; parent: AdminTreeNode | null } | null {
    for (let i = 0; i < nodes.length; i += 1) {
      if (sameNode(nodes[i], ref)) return { siblings: nodes, index: i, parent };
      const nested = locate(nodes[i].children, ref, nodes[i]);
      if (nested) return nested;
    }
    return null;
  }

  function byKeyboard(ref: Ref, direction: 'up' | 'down' | 'in' | 'out') {
    const found = locate(draft, ref);
    if (!found) return;
    if (direction === 'up' && found.index > 0) move(ref, found.siblings[found.index - 1], 'before');
    if (direction === 'down' && found.index + 1 < found.siblings.length)
      move(ref, found.siblings[found.index + 1], 'after');
    if (direction === 'in' && found.index > 0) {
      const preceding = found.siblings[found.index - 1];
      if (preceding.kind === 'GROUP') move(ref, preceding, 'inside');
    }
    if (direction === 'out' && found.parent) move(ref, found.parent, 'after');
  }

  const allowDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; };

  function drop(event: DragEvent<HTMLDivElement>, target: Ref | null, position: DropPosition) {
    event.preventDefault(); event.stopPropagation();
    if (dragged) move(dragged, target, position);
    setDragged(null);
  }

  function dropZone(target: Ref | null, position: DropPosition, label: string) {
    return <div className={`group-tree-editor__drop${dragged ? ' is-dragging' : ''}`}
      onDragOver={allowDrop} onDrop={(event) => drop(event, target, position)}
      aria-label={label} title={label} />;
  }

  function renderNodes(nodes: AdminTreeNode[], depth = 0): React.ReactNode {
    return nodes.map((node) => {
      const ref: Ref = { id: node.id, kind: node.kind };
      return (
        <div className="group-tree-editor__node" key={`${node.kind}-${node.id}`}>
          {dropZone(ref, 'before', `Drop before ${node.name}`)}
          <div className="group-tree-editor__row" draggable={!saving}
            onDragStart={(event) => {
              event.stopPropagation();
              setDragged(ref);
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', `${node.kind}:${node.id}`);
            }}
            onDragEnd={() => setDragged(null)}>
            <span className="group-tree-editor__grip" aria-label="Drag to move">⠿</span>
            <span className="group-node-badge">{node.kind === 'GROUP' ? 'G' : 'M'}</span>
            <span className="group-tree-editor__name">{node.name}</span>
            {!node.active && <span className="group-tree-editor__inactive">INACTIVE</span>}
            <div className="group-tree-editor__row-actions" aria-label={`Move ${node.name}`}>
              <button type="button" disabled={saving} title="Move up" aria-label={`Move ${node.name} up`}
                onClick={() => byKeyboard(ref, 'up')}>↑</button>
              <button type="button" disabled={saving} title="Move down" aria-label={`Move ${node.name} down`}
                onClick={() => byKeyboard(ref, 'down')}>↓</button>
              <button type="button" disabled={saving} title="Indent into preceding Group"
                aria-label={`Indent ${node.name}`} onClick={() => byKeyboard(ref, 'in')}>→</button>
              <button type="button" disabled={saving} title="Move to parent level"
                aria-label={`Outdent ${node.name}`} onClick={() => byKeyboard(ref, 'out')}>←</button>
            </div>
          </div>
          {node.kind === 'GROUP' && (
            <div className="group-tree-editor__children">
              {renderNodes(node.children, depth + 1)}
              <div className={`group-tree-editor__into${dragged ? ' is-dragging' : ''}`}
                onDragOver={allowDrop} onDrop={(event) => drop(event, ref, 'inside')}>
                {isVi ? 'Thả vào Group' : 'Drop inside Group'}
              </div>
            </div>
          )}
          {dropZone(ref, 'after', `Drop after ${node.name}`)}
        </div>
      );
    });
  }

  async function save() {
    if (!dirty || saving) return;
    setSaving(true);
    setError('');
    try {
      await saveAdminStructure(topicId, initial.revision, draft);
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally { setSaving(false); }
  }

  return (
    <div className="catalog-editor-overlay">
      <section className="catalog-editor group-tree-editor" role="dialog" aria-modal="true"
        aria-label={isVi ? 'Sắp xếp cấu trúc học tập' : 'Modify learning structure'}>
        <div className="catalog-editor__heading">
          <div>
            <span className="catalog-editor__eyebrow">ADMIN · TREE EDITOR</span>
            <h2>{isVi ? 'Modify Group & Module' : 'Modify Group & Module'}</h2>
          </div>
          <button type="button" className="catalog-editor__close" disabled={saving} onClick={close} aria-label="Close">×</button>
        </div>
        <p className="catalog-editor__context">
          {isVi ? 'Kéo thả G/M; thả vào Group để đổi cấp. Có thể dùng ↑ ↓ → ←. Chỉ lưu khi nhấn Save Changes.'
            : 'Drag and drop Group/Module nodes, or use arrow controls. Save Changes commits everything at once.'}
        </p>
        <div className="group-tree-editor__tree">
          {renderNodes(draft)}
          <div className={`group-tree-editor__into group-tree-editor__root${dragged ? ' is-dragging' : ''}`}
            onDragOver={allowDrop} onDrop={(event) => drop(event, null, 'inside')}>
            {isVi ? 'Thả vào cấp gốc của Topic' : 'Drop at the Topic root'}
          </div>
        </div>
        {error && <div className="catalog-editor__error" role="alert">
          {error} <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost" onClick={onReload}>
            {isVi ? 'Tải lại cấu trúc' : 'Reload structure'}
          </button>
        </div>}
        <div className="group-tree-editor__footer">
          <span>{dirty ? (isVi ? 'Có thay đổi chưa lưu' : 'Unsaved changes')
            : (isVi ? 'Chưa có thay đổi' : 'No changes')}</span>
          <div className="catalog-editor__actions">
            <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost" disabled={!dirty || saving}
              onClick={() => { setDraft(structuredClone(initial.nodes)); setError(''); }}>
              Reset Changes
            </button>
            <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost" disabled={saving} onClick={close}>
              Cancel
            </button>
            <button type="button" className="catalog-admin-btn" disabled={!dirty || saving} onClick={() => void save()}>
              {saving ? (isVi ? 'Đang lưu...' : 'Saving...') : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
