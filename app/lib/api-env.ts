'use client';

import { useEffect, useState } from 'react';

export type ApiEnv = 'prod' | 'dev';

export const API_ENV_STORAGE_KEY = 'movietime-dashboard-api-env';
export const PROD_API_BASE_URL = 'https://hufyvhlacb.execute-api.us-west-2.amazonaws.com';
export const DEV_API_BASE_URL = 'https://9ydbyn5j6h.execute-api.us-west-2.amazonaws.com';
const API_ENV_CHANGED_EVENT = 'movietime:api-env-changed';

function isApiEnv(value: unknown): value is ApiEnv {
  return value === 'prod' || value === 'dev';
}

export function getApiEnv(): ApiEnv {
  if (typeof window === 'undefined') return 'prod';
  const stored = window.localStorage.getItem(API_ENV_STORAGE_KEY);
  return isApiEnv(stored) ? stored : 'prod';
}

export function setApiEnv(nextEnv: ApiEnv) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(API_ENV_STORAGE_KEY, nextEnv);
  window.dispatchEvent(new CustomEvent<ApiEnv>(API_ENV_CHANGED_EVENT, { detail: nextEnv }));
}

export function getApiBaseUrl(env: ApiEnv = getApiEnv()) {
  return env === 'dev' ? DEV_API_BASE_URL : PROD_API_BASE_URL;
}

export function getApiUrl(pathname: string, env: ApiEnv = getApiEnv()) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getApiBaseUrl(env)}${normalizedPath}`;
}

export function useApiEnv() {
  const [apiEnv, setApiEnvState] = useState<ApiEnv>(() => getApiEnv());

  useEffect(() => {
    setApiEnvState(getApiEnv());

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== API_ENV_STORAGE_KEY) return;
      setApiEnvState(getApiEnv());
    };

    const handleApiEnvChange = () => {
      setApiEnvState(getApiEnv());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(API_ENV_CHANGED_EVENT, handleApiEnvChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(API_ENV_CHANGED_EVENT, handleApiEnvChange as EventListener);
    };
  }, []);

  const updateApiEnv = (nextEnv: ApiEnv) => {
    setApiEnv(nextEnv);
    setApiEnvState(nextEnv);
  };

  return { apiEnv, setApiEnv: updateApiEnv };
}
