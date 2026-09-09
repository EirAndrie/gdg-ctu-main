import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <p>Loading…</p>;
  if (!isSignedIn) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
