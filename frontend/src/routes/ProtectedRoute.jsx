import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (pathname.startsWith('/admin') && user?.role !== 'ADMIN') return <Navigate to="/login" replace />;
  const isMentorPortal = pathname === '/mentor' || pathname.startsWith('/mentor/');
  if (isMentorPortal && pathname !== '/mentor/pending-verification') {
    if (user?.role !== 'MENTOR') return <Navigate to="/login" replace />;
    if (user?.accountStatus !== 'VERIFIED') return <Navigate to="/mentor/pending-verification" replace />;
  }
  if (pathname.startsWith('/student') && user?.role !== 'STUDENT') return <Navigate to="/login" replace />;

  return children;
}
