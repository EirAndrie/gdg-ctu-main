import { SignIn } from '@clerk/clerk-react';
import { AdminDisabled } from '../../components/ProtectedRoute.jsx';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AdminLogin() {
  if (!clerkPubKey) return <AdminDisabled />;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <SignIn
        routing="path"
        path="/admin/login"
        signUpUrl="/admin/login"
        afterSignInUrl="/admin"
      />
    </div>
  );
}
