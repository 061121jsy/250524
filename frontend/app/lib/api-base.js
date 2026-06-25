export const DEFAULT_API_BASE_URL = "https://doxlchnnggjnqupeqrzh.supabase.co/functions/v1";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getReadingsUrl(kind) {
  const apiBase = getApiBaseUrl();
  if (apiBase.includes("/functions/v1")) {
    return `${apiBase}/readings?kind=${kind}`;
  }

  return `${apiBase}/api/${kind}/readings`;
}
