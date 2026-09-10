import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { eventsApi, getId, publicPreview } from '../../api/resources.js';
import {
  EVENT_STATUSES, MAX_FEATURED_EVENTS, checkSlugUnique, slugify,
  useDirtyGuard, validateEvent,
} from '../../admin/editorial.js';
import { ErrorState, Field, FormSummary, LoadingSkeleton, focusSummary, inputProps, Toggle, TypedConfirm } from '../../components/admin/shared.jsx';

const EMPTY = {
  title: '', slug: '', short_description: '', description: '', coverMediaId: '', coverAlt: '',
  location: '', locationEmbedUrl: '', registrationEnabled: false, registrationUrl: '',
  startAt: '', endAt: '', status: 'draft', is_featured: false, display_order: 0, is_active: true,
};

function toForm(item = {}) {
  return {
    title: item.title ?? '', slug: item.slug ?? '',
    short_description: item.short_description ?? item.shortDescription ?? '',
    description: item.description ?? '',
    coverMediaId: item.coverMediaId ?? item.cover_media_id ?? item.cover_url ?? '',
    coverAlt: item.coverAlt ?? item.cover_alt ?? '',
    location: item.location ?? '', locationEmbedUrl: item.locationEmbedUrl ?? item.location_embed_url ?? '',
    registrationEnabled: !!(item.registrationEnabled ?? item.registration_enabled),
    registrationUrl: item.registrationUrl ?? item.registration_url ?? '',
    startAt: (item.startAt ?? item.start_at ?? '').toString().slice(0, 16),
    endAt: (item.endAt ?? item.end_at ?? '').toString().slice(0, 16),
    status: String(item.status ?? 'draft').toLowerCase(),
    is_featured: !!item.is_featured,
    display_order: item.display_order ?? 0, is_active: item.is_active ?? true,
    updated_by: item.updated_by ?? item.updatedBy ?? null, updated_at: item.updated_at ?? item.updatedAt ?? null,
  };
}

export default function EventDetail() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const summaryRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [original, setOriginal] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugDup, setSlugDup] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState('');

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(original), [form, original]);
  const blocker = useDirtyGuard(dirty && !saving);
  const isPublished = original.status === 'published';
  const slugChanged = isNew ? false : form.slug !== original.slug;

  useEffect(() => {
    if (isNew) return;
    let alive = true;
    eventsApi.get(id)
      .then((item) => {
        if (!alive) return;
        const next = toForm(item);
        setForm(next);
        setOriginal(next);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, isNew]);

  const set = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'title' && !slugTouched) next.slug = slugify(value);
      if (key === 'registrationEnabled' && !value) next.registrationUrl = '';
      return next;
    });
  };

  useEffect(() => {
    if (!form.slug) {
      setSlugDup(false);
      return;
    }
    let alive = true;
    const t = setTimeout(() => {
      checkSlugUnique(eventsApi, form.slug, isNew ? null : getId(original) ?? id)
        .then((unique) => {
          if (alive) setSlugDup(!unique);
        })
        .catch(() => {});
    }, 400);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [form.slug, id, isNew, original]);

  if (!isNew && loading) return <section aria-label="Event editor"><h1>Event</h1><LoadingSkeleton label="Loading event…" /></section>;
  if (!isNew && error) return <section aria-label="Event editor"><h1>Event</h1><ErrorState error={error} onRetry={() => window.location.reload()} context="load this event" /></section>;

  const publishGate = { ...validateEvent(form), ...(slugDup ? { slug: 'Slug is already in use.' } : {}) };

  const persist = async (next, { publish = false } = {}) => {
    const gate = publish ? { ...validateEvent(next), ...(slugDup ? { slug: 'Slug is already in use.' } : {}) } : {};
    setErrors(gate);
    if (Object.keys(gate).length) {
      focusSummary(summaryRef);
      return false;
    }
    if (publish && slugChanged && isPublished) {
      if (!window.confirm('You changed the slug of a published event. There are no redirects in V1 — the old URL will 404. Continue?')) return false;
    }
    if (publish && next.is_featured) {
      try {
        const all = await eventsApi.list();
        const others = (Array.isArray(all) ? all : []).filter(
          (e) => e.is_featured && String(getId(e) ?? e.slug) !== String(getId(original) ?? id),
        );
        if (others.length >= MAX_FEATURED_EVENTS) {
          setServerError(`Featured cap reached (max ${MAX_FEATURED_EVENTS}). Unfeature another event first.`);
          return false;
        }
      } catch { /* non-blocking */ }
    }
    setSaving(true);
    setServerError(null);
    try {
      const payload = {
        ...next,
        display_order: Number(next.display_order) || 0,
        registrationUrl: next.registrationEnabled ? next.registrationUrl : null,
      };
      let saved;
      if (isNew) saved = await eventsApi.create({ ...payload, status: publish ? 'published' : 'draft' });
      else saved = await eventsApi.update(id, payload);
      const fresh = toForm(saved ?? next);
      setForm(fresh);
      setOriginal(fresh);
      setToast(publish ? 'Published.' : 'Saved as draft.');
      if (isNew && (getId(saved) ?? saved?.slug)) navigate(`/admin/events/${getId(saved) ?? saved.slug}`, { replace: true });
      return true;
    } catch (err) {
      setServerError(err?.body?.message ?? err?.message ?? 'Save failed.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    setSaving(true);
    try {
      await eventsApi.update(id, { is_active: false, status: 'archived' });
      setToast('Archived. Hidden publicly, still editable.');
      setOriginal((o) => ({ ...o, is_active: false, status: 'archived' }));
      setForm((f) => ({ ...f, is_active: false, status: 'archived' }));
    } catch (err) {
      setServerError(err?.body?.message ?? err?.message ?? 'Archive failed.');
    } finally {
      setSaving(false);
      setConfirmArchive(false);
    }
  };

  const hardDelete = async () => {
    setSaving(true);
    try {
      await eventsApi.remove(id);
      navigate('/admin/events');
    } catch (err) {
      setServerError(err?.body?.message ?? err?.message ?? 'Delete failed.');
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  return (
    <section aria-label={isNew ? 'New event' : 'Edit event'}>
      <div className="admin-page-head">
        <div>
          <h1>{isNew ? 'New event' : form.title || 'Event'}</h1>
          <p className="admin-muted">
            {form.updated_at ? `Last edited ${form.updated_at}${form.updated_by ? ` by ${form.updated_by}` : ''} · ` : ''}
            Create = draft · publish gate enforced · <a href={publicPreview.events()}>public preview</a>
          </p>
        </div>
        {!isNew ? <Link className="gdg-btn gdg-btn-secondary" to="/admin/events">Back to list</Link> : null}
      </div>

      {blocker?.state === 'blocked' ? (
        <div className="admin-summary" role="alert">
          <h3>Unsaved changes</h3>
          <p>Leave without saving?</p>
          <div className="gdg-btn-row">
            <button type="button" className="gdg-btn gdg-btn-secondary" onClick={() => blocker.reset()}>Stay</button>
            <button type="button" className="gdg-btn gdg-btn-primary admin-danger" onClick={() => blocker.proceed()}>Discard</button>
          </div>
        </div>
      ) : null}

      <FormSummary errors={errors} summaryRef={summaryRef} />
      {serverError ? <div className="admin-summary" role="alert"><p>{serverError}</p></div> : null}
      {toast ? <p role="status" aria-live="polite" className="admin-muted">{toast}</p> : null}

      <form className="admin-form" onSubmit={(e) => { e.preventDefault(); persist(form); }} noValidate>
        <div className="admin-form-grid">
          <Field label="Title" htmlFor="title" error={errors.title} required>
            <input {...inputProps('title', errors.title)} value={form.title} onChange={(e) => set('title', e.target.value)} onBlur={() => setErrors(validateEvent(form))} />
          </Field>
          <Field label="Slug" hint="Auto from title; override allowed. Lowercase-hyphen-ascii, unique." htmlFor="slug" error={errors.slug ?? (slugDup ? 'Slug is already in use.' : null)} required>
            <input {...inputProps('slug', errors.slug || slugDup)} value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} />
          </Field>
        </div>
        <Field label="Short description" htmlFor="short_description" error={errors.short_description}>
          <input {...inputProps('short_description', errors.short_description)} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
        </Field>
        <Field label="Description (markdown)" htmlFor="description" error={errors.description} required>
          <textarea {...inputProps('description', errors.description)} id="description" rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
        <div className="admin-form-grid">
          <Field label="Cover media ID" hint="Pick from Media; store the media ID here." htmlFor="coverMediaId" error={errors.coverMediaId} required>
            <input {...inputProps('coverMediaId', errors.coverMediaId)} value={form.coverMediaId} onChange={(e) => set('coverMediaId', e.target.value)} />
          </Field>
          <Field label="Cover alt text" htmlFor="coverAlt" error={errors.coverAlt} required>
            <input {...inputProps('coverAlt', errors.coverAlt)} value={form.coverAlt} onChange={(e) => set('coverAlt', e.target.value)} />
          </Field>
        </div>
        <div className="admin-form-grid">
          <Field label="Location" htmlFor="location" error={errors.location}>
            <input {...inputProps('location', errors.location)} value={form.location} onChange={(e) => set('location', e.target.value)} />
          </Field>
          <Field label="Location embed URL" htmlFor="locationEmbedUrl" error={errors.locationEmbedUrl}>
            <input {...inputProps('locationEmbedUrl', errors.locationEmbedUrl)} value={form.locationEmbedUrl} onChange={(e) => set('locationEmbedUrl', e.target.value)} placeholder="https://…" />
          </Field>
        </div>
        <Toggle id="registrationEnabled" label="Registration enabled" checked={form.registrationEnabled} onChange={(v) => set('registrationEnabled', v)} />
        {form.registrationEnabled ? (
          <Field label="Registration URL (https required)" htmlFor="registrationUrl" error={errors.registrationUrl} required>
            <input {...inputProps('registrationUrl', errors.registrationUrl)} value={form.registrationUrl} onChange={(e) => set('registrationUrl', e.target.value)} placeholder="https://…" />
          </Field>
        ) : null}
        <div className="admin-form-grid">
          <Field label="Starts at" htmlFor="startAt" error={errors.startAt} required>
            <input {...inputProps('startAt', errors.startAt)} type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} />
          </Field>
          <Field label="Ends at" htmlFor="endAt" error={errors.endAt} required>
            <input {...inputProps('endAt', errors.endAt)} type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
          </Field>
          <Field label="Status" htmlFor="status" error={errors.status} required>
            <select {...inputProps('status', errors.status)} value={form.status} onChange={(e) => set('status', e.target.value)}>
              {EVENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Display order (≥ 0)" htmlFor="display_order" error={errors.display_order}>
            <input {...inputProps('display_order', errors.display_order)} type="number" min="0" step="1" value={form.display_order} onChange={(e) => set('display_order', e.target.value)} />
          </Field>
        </div>
        <Toggle id="is_featured" label={`Featured (max ${MAX_FEATURED_EVENTS})`} checked={form.is_featured} onChange={(v) => set('is_featured', v)} hint="UI-enforced cap; server is truth." />
        <Toggle id="is_active" label="Active (off hides publicly)" checked={form.is_active} onChange={(v) => set('is_active', v)} />

        <div className="gdg-btn-row">
          <button type="submit" className="gdg-btn gdg-btn-secondary" disabled={saving}>{saving ? 'Saving…' : 'Save draft'}</button>
          <button type="button" className="gdg-btn gdg-btn-primary" disabled={saving} onClick={() => persist({ ...form, status: 'published', is_active: true }, { publish: true })}>
            {saving ? 'Publishing…' : 'Publish'}
          </button>
          {!isNew && original.status !== 'draft' ? (
            <button type="button" className="gdg-btn gdg-btn-secondary" onClick={() => setConfirmArchive(true)}>Archive</button>
          ) : null}
          {!isNew && original.status === 'draft' ? (
            <button type="button" className="gdg-btn gdg-btn-secondary" onClick={() => setConfirmDelete(true)}>Delete draft</button>
          ) : null}
        </div>
        {Object.keys(publishGate).length > 0 ? (
          <p className="admin-muted">Publish blocked: {Object.keys(publishGate).length} field(s) need attention.</p>
        ) : (
          <p className="admin-muted">Publish gate: all required fields valid.</p>
        )}
      </form>

      <TypedConfirm open={confirmArchive} title="Archive event?" body="Archive hides it publicly but keeps it editable and restorable (preferred over delete)." expected={form.slug} confirmLabel="Archive" busy={saving} onCancel={() => setConfirmArchive(false)} onConfirm={archive} />
      <TypedConfirm open={confirmDelete} title="Delete never-published draft?" body="Hard delete is only for never-published drafts. This cannot be undone." expected={form.slug} confirmLabel="Delete forever" busy={saving} onCancel={() => setConfirmDelete(false)} onConfirm={hardDelete} />
    </section>
  );
}
