export const QUERY_TOKENS_METADATA_LIMIT = 120;

export const getBackendUrl = () => {
  const url = import.meta.env.VITE_BACKEND_URL;

  if (!url) {
    throw new Error("Backend URL is not set");
  }

  return url;
};
