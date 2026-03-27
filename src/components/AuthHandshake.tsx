import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { pool } from '@/lib/db';

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
            // Initialize user in DB directly
            await pool.query('INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING', [data.user_id]);
            
            // Clear token from URL
            searchParams.delete('token');
            navigate({ search: searchParams.toString() }, { replace: true });
          } else {
            redirectToLogin();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          redirectToLogin();
        }
      };
      getUserId();
    } else if (!sessionStorage.getItem('user_id')) {
      redirectToLogin();
    }
  }, [searchParams, navigate]);

  const redirectToLogin = () => {
    const currentUrl = window.location.origin + (import.meta.env.BASE_URL || '/');
    const loginUrl = `https://api.mantracare.com/user/login?redirect_url=${encodeURIComponent(currentUrl + '?token=')}`;
    window.location.href = loginUrl;
  };

  return null;
}
