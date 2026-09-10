import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { API_BASE_URL } from '../../api/resources.js';

export default function AdminSettings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  return (
    <section aria-label="Settings and profile">
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p className="admin-muted">Profile + environment. V1 has no RBAC or versioning UI.</p>
        </div>
      </div>
      <div className="admin-cards">
        <article className="admin-card" aria-label="Profile">
          <h2>Profile</h2>
          <p><strong>{user?.fullName ?? 'Admin'}</strong></p>
          <p className="admin-muted">{user?.primaryEmailAddress?.emailAddress ?? 'No email on file'}</p>
          <p className="admin-muted">User ID: {user?.id ?? '—'}</p>
          <div className="gdg-btn-row">
            <button type="button" className="gdg-btn gdg-btn-secondary" onClick={() => signOut(() => navigate('/admin/login'))}>
              Sign out
            </button>
          </div>
        </article>
        <article className="admin-card" aria-label="Environment">
          <h2>Environment</h2>
          <p className="admin-muted">API base (VITE_API_URL):</p>
          <p><code>{API_BASE_URL || '(not set)'}</code></p>
          <p className="admin-muted">Expected: &lt;backend&gt;/GDGoC-CTU-Main/v0.0.1. Every mutation is verified server-side (Clerk requireAuth). 401 = signed out, 403 = inactive (contact tech/web officer).</p>
        </article>
      </div>
    </section>
  );
}
