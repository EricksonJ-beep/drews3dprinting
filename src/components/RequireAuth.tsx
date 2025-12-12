import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
}
