import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';

export const RESERVED_SLUGS = ['api', 'admin', 'media', 'sitemap.xml', 'login', 'events', 'team', 'gallery', 'content', 'partners', 'settings', 'officers'];
export const EVENT_STATUSES = ['draft', 'published', 'archived', 'cancelled'];
export const PARTNER_TIERS = ['platinum', 'gold', 'silver', 'community'];
export const CONTENT_KEYS = ['hero', 'about', 'community', 'cta', 'footer'];
export const MAX_FEATURED_EVENTS = 3;
export const MAX_FEATURED_TEAM = 10;
export const MAX_FEATURED_PHOTOS = 8;
export const MEDIA_ALLOW = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export function slugify(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function isReservedSlug(slug) {
  return RESERVED_SLUGS.includes(String(slug).toLowerCase());
}

export function isHttpsUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isAnyUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Inline async uniqueness check: 404 => unique; 200 with a different id => duplicate. */
export async function checkSlugUnique(api, slug, currentId = null) {
  if (!slug || isReservedSlug(slug)) return false;
  try {
    const found = await api.getBySlug(slug);
    const foundId = found?.id ?? found?._id;
    if (currentId && foundId && String(foundId) === String(currentId)) return true;
    return false;
  } catch (err) {
    if (err?.status === 404) return true;
    throw err;
  }
}

function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function validateEvent(v) {
  const errors = {};
  if (!required(v.title)) errors.title = 'Title is required.';
  if (!required(v.slug)) errors.slug = 'Slug is required.';
  else if (isReservedSlug(v.slug)) errors.slug = 'This slug is reserved.';
  else if (!/^[a-z0-9-]+$/.test(v.slug)) errors.slug = 'Use lowercase letters, numbers, and hyphens only.';
  if (!required(v.description)) errors.description = 'Description is required.';
  if (!required(v.coverMediaId)) errors.coverMediaId = 'Cover image is required before publish.';
  if (!required(v.coverAlt)) errors.coverAlt = 'Cover alt text is required.';
  if (!v.startAt) errors.startAt = 'Start date/time is required.';
  if (!v.endAt) errors.endAt = 'End date/time is required.';
  else if (v.startAt && new Date(v.endAt) < new Date(v.startAt)) errors.endAt = 'End must be after start.';
  if (!EVENT_STATUSES.includes(v.status)) errors.status = 'Pick a valid status.';
  if (v.registrationEnabled && !isHttpsUrl(v.registrationUrl)) {
    errors.registrationUrl = 'Registration URL must be a valid https:// URL when registration is enabled.';
  }
  if (!Number.isInteger(Number(v.display_order)) || Number(v.display_order) < 0) {
    errors.display_order = 'Display order must be an integer ≥ 0.';
  }
  return errors;
}

export function validateTeam(v) {
  const errors = {};
  if (!required(v.firstName)) errors.firstName = 'First name is required.';
  if (!required(v.lastName)) errors.lastName = 'Last name is required.';
  if (!required(v.slug)) errors.slug = 'Slug is required.';
  else if (isReservedSlug(v.slug)) errors.slug = 'This slug is reserved.';
  if (!required(v.roleTitle)) errors.roleTitle = 'Role title is required.';
  else if (String(v.roleTitle).length > 80) errors.roleTitle = 'Role title must be ≤ 80 characters.';
  for (const key of ['linkedin_url', 'github_url', 'website_url']) {
    if (v[key] && !isAnyUrl(v[key])) errors[key] = 'Must be a valid URL.';
  }
  if (!required(v.profileAlt) && v.profileMediaId) errors.profileAlt = 'Photo alt text is required.';
  return errors;
}

export function validatePartner(v) {
  const errors = {};
  if (!required(v.name)) errors.name = 'Name is required.';
  if (!required(v.slug)) errors.slug = 'Slug is required.';
  else if (isReservedSlug(v.slug)) errors.slug = 'This slug is reserved.';
  if (!required(v.logoMediaId)) errors.logoMediaId = 'Logo is required.';
  if (!required(v.logoAlt)) errors.logoAlt = 'Logo alt text is required.';
  if (v.websiteUrl && !isHttpsUrl(v.websiteUrl)) errors.websiteUrl = 'Website must be a valid https:// URL.';
  if (!PARTNER_TIERS.includes(v.tier)) errors.tier = 'Pick a tier.';
  if (!Number.isInteger(Number(v.display_order ?? 0)) || Number(v.display_order ?? 0) < 0) {
    errors.display_order = 'Display order must be an integer ≥ 0.';
  }
  return errors;
}

export function validateAlbum(v) {
  const errors = {};
  if (!required(v.title)) errors.title = 'Title is required.';
  if (!required(v.slug)) errors.slug = 'Slug is required.';
  else if (isReservedSlug(v.slug)) errors.slug = 'This slug is reserved.';
  if (!required(v.coverMediaId)) errors.coverMediaId = 'Album cover is required before publish.';
  if (!required(v.coverAlt)) errors.coverAlt = 'Cover alt text is required.';
  return errors;
}

export function validateContent(v) {
  const errors = {};
  if (v.buttonUrl && !isAnyUrl(v.buttonUrl)) errors.buttonUrl = 'Button URL must be valid.';
  return errors;
}

/** Warn on dirty-form navigation (react-router blocker + native beforeunload). */
export function useDirtyGuard(dirty) {
  const blocker = useBlocker(dirty);
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
  return blocker;
}

/** Shared list-fetch state machine: loading skeleton / error+retry(requestId) / data. */
export function useAdminList(loader, depsKey = '') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [nonce, setNonce] = useState(0);
  const retry = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let alive = true;
    const rid = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`;
    setLoading(true);
    setError(null);
    setRequestId(rid);
    Promise.resolve()
      .then(loader)
      .then((rows) => {
        if (alive) {
          setData(rows ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (alive) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey, nonce]);

  return { data, loading, error, requestId, retry };
}

export function timeAgo(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef(null);
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer.current);
  }, [value, delay]);
  return debounced;
}
