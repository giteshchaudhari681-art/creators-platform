const DEFAULT_ORIGINS = Array.from({ length: 11 }, (_, index) => `http://localhost:${5000 + index}`);

let resolvedOriginPromise;

const canUseBrowserApis = typeof window !== 'undefined' && typeof fetch !== 'undefined';

const probeOrigin = async (origin) => {
  try {
    const response = await fetch(`${origin}/api/health`, {
      method: 'GET',
      mode: 'cors',
    });
    return response.ok ? origin : null;
  } catch {
    return null;
  }
};

export const getCandidateOrigins = () => {
  const envOrigin = import.meta.env.VITE_API_URL;
  return envOrigin ? [envOrigin, ...DEFAULT_ORIGINS.filter((origin) => origin !== envOrigin)] : DEFAULT_ORIGINS;
};

export const resolveApiOrigin = async () => {
  if (!canUseBrowserApis) {
    return import.meta.env.VITE_API_URL || DEFAULT_ORIGINS[0];
  }

  if (!resolvedOriginPromise) {
    resolvedOriginPromise = (async () => {
      for (const origin of getCandidateOrigins()) {
        const workingOrigin = await probeOrigin(origin);
        if (workingOrigin) {
          window.__CREATORHUB_API_ORIGIN__ = workingOrigin;
          return workingOrigin;
        }
      }

      throw new Error('Unable to connect to the backend server. Make sure the server is running.');
    })();
  }

  return resolvedOriginPromise;
};
