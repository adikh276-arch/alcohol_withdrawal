import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function AuthHandshake() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const getUserId = async () => {
        try {
          const response = await fetch('https://api.mantracare.com/user/user-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          const data = await response.json();
          if (data && data.user_id) {
            sessionStorage.setItem('user_id', data.user_id);
            await fetch('/api/user/init', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: data.user_id })
            });
            searchParams.delete('token');
            navigate({ search: searchParams.toString() }, { replace: true });
          } else {
            window.location.href = '/token';
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          window.location.href = '/token';
        }
      };
      getUserId();
    } else if (!sessionStorage.getItem('user_id')) {
      window.location.href = '/token';
    }
  }, [searchParams, navigate]);

  return null;
}
