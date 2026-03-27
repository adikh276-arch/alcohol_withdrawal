const getApiBase = (): string => {
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/$/, '');
};

export const apiBase = getApiBase();
export const apiFetch = (path: string, init?: RequestInit) =>
  fetch(`${apiBase}${path}`, init);
