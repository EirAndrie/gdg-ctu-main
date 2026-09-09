import { SignIn } from '@clerk/clerk-react';

export default function AdminLogin() {
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
