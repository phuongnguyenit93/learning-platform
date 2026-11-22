import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  createCategory, createTopic, updateCategory, updateTopic,
  type LearningCategory, type LearningTopic,
} from '../data/learningCatalog';

export type CatalogEditorTarget =
  | { kind: 'category'; category?: LearningCategory }
  | { kind: 'topic'; category: LearningCategory; topic?: LearningTopic };

type FormValues = {
  code: string;
  name: string;
  slug: string;
  description: string;
  status: LearningTopic['status'];
};

export function CatalogEditor({ target, language, onClose, onSaved }: {
  target: CatalogEditorTarget;
  language: 'vi' | 'en';
  onClose: () => void;
  onSaved: () => void;
}) {
  const existing = target.kind === 'topic' ? target.topic : target.category;
  const [form, setForm] = useState<FormValues>({
    code: existing?.code ?? '',
    name: existing?.name ?? '',
    slug: target.kind === 'topic' ? target.topic?.slug ?? '' : '',
    description: target.kind === 'topic' ? target.topic?.description ?? '' : '',
    status: target.kind === 'topic' ? target.topic?.status ?? 'COMING_SOON' : 'COMING_SOON',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const isVi = language === 'vi';
  const editing = Boolean(existing);
  const title = target.kind === 'category'
    ? (editing ? (isVi ? 'Sửa Category' : 'Edit Category') : (isVi ? 'Tạo Category' : 'Create Category'))
    : (editing ? (isVi ? 'Sửa Topic' : 'Edit Topic') : (isVi ? 'Tạo Topic' : 'Create Topic'));

  useEffect(() => {
    firstField.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [onClose, saving]);

  const set = <K extends keyof FormValues>(field: K, value: FormValues[K]) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      if (target.kind === 'category') {
        const body = { code: form.code.trim(), name: form.name.trim() };
        if (target.category) await updateCategory(target.category.id, body);
        else await createCategory(body);
      } else {
        const body = {
          code: form.code.trim(), slug: form.slug.trim(),
          name: form.name.trim(), description: form.description.trim(),
          ...(target.topic ? { status: form.status } : {}),
        };
        if (target.topic) await updateTopic(target.topic.id, body);
        else await createTopic(target.category.id, body);
      }
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : (isVi ? 'Lưu thất bại.' : 'Save failed.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="catalog-editor-overlay" onMouseDown={(event) => {
      if (event.currentTarget === event.target && !saving) onClose();
    }}>
      <section className="catalog-editor" role="dialog" aria-modal="true" aria-label={title}>
        <div className="catalog-editor__heading">
          <div>
            <span className="catalog-editor__eyebrow">ADMIN · CATALOG</span>
            <h2>{title}</h2>
          </div>
          <button type="button" className="catalog-editor__close" aria-label={isVi ? 'Đóng' : 'Close'}
            disabled={saving} onClick={onClose}>×</button>
        </div>
        {target.kind === 'topic' && <p className="catalog-editor__context">Category: <strong>{target.category.name}</strong></p>}
        <form onSubmit={(event) => void submit(event)} className="catalog-editor__form">
          <label>
            <span>CODE <em>*</em></span>
            <input ref={firstField} value={form.code} maxLength={50} required
              pattern="[A-Za-z][A-Za-z0-9_]*" autoComplete="off" spellCheck={false}
              placeholder={target.kind === 'category' ? 'BACKEND' : 'JAVA'}
              onChange={(event) => set('code', event.target.value.toUpperCase())} />
            <small>{isVi ? 'Chữ cái, số, dấu gạch dưới; không có khoảng trắng.' : 'Letters, numbers and underscores; no spaces.'}</small>
          </label>
          {target.kind === 'topic' && (
            <label>
              <span>SLUG <em>*</em></span>
              <input value={form.slug} maxLength={100} required
                pattern="[a-z0-9]+(-[a-z0-9]+)*" autoComplete="off" spellCheck={false}
                placeholder="java-core" onChange={(event) => set('slug', event.target.value.toLowerCase())} />
              <small>{isVi ? 'Chữ thường, số và dấu gạch ngang.' : 'Lowercase letters, numbers and hyphens.'}</small>
            </label>
          )}
          <label>
            <span>NAME <em>*</em></span>
            <input value={form.name} maxLength={150} required
              placeholder={target.kind === 'category' ? 'Backend' : 'Java'}
              onChange={(event) => set('name', event.target.value)} />
          </label>
          {target.kind === 'topic' && (
            <label>
              <span>DESCRIPTION</span>
              <textarea rows={3} maxLength={500} value={form.description}
                placeholder={isVi ? 'Mô tả ngắn về chủ đề...' : 'Short topic description...'}
                onChange={(event) => set('description', event.target.value)} />
              <small>{isVi ? 'ICON_SVG chỉ chỉnh trực tiếp trong database.' : 'ICON_SVG is managed directly in the database.'}</small>
            </label>
          )}
          {target.kind === 'topic' && target.topic && (
            <label>
              <span>{isVi ? 'TRẠNG THÁI' : 'STATUS'} <em>*</em></span>
              <select value={form.status} disabled={saving}
                onChange={(event) => set('status', event.target.value as LearningTopic['status'])}>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="COMING_SOON">COMING_SOON</option>
                <option value="HIDDEN">HIDDEN</option>
              </select>
              <small>{isVi
                ? 'AVAILABLE: có thể mở học. COMING_SOON: hiển thị sắp cập nhật. HIDDEN: ẩn với người học.'
                : 'AVAILABLE: open for learning. COMING_SOON: show as coming soon. HIDDEN: hide from learners.'}</small>
            </label>
          )}
          {!editing && <p className="catalog-editor__hint">
            {isVi ? 'Sort order sẽ tự động bằng giá trị lớn nhất + 1.' : 'Sort order will be set to the current maximum + 1.'}
            {target.kind === 'topic' && (isVi ? ' Topic mới có trạng thái COMING_SOON.' : ' New topics start as COMING_SOON.')}
          </p>}
          {error && <p className="catalog-editor__error" role="alert">{error}</p>}
          <div className="catalog-editor__actions">
            <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost" disabled={saving} onClick={onClose}>
              {isVi ? 'Hủy' : 'Cancel'}
            </button>
            <button className="catalog-admin-btn" type="submit" disabled={saving}>
              {saving ? (isVi ? 'Đang lưu...' : 'Saving...') : editing
                ? (isVi ? 'Lưu thay đổi' : 'Save changes')
                : (isVi ? 'Tạo mới' : 'Create')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
