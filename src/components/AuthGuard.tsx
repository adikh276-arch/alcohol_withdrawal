import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      const apiBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      window.location.href = `${apiBase}/token`;
    }
  }, [userId, navigate]);

  if (!userId) {
    return null;
  }

  return <>{children}</>;
}
