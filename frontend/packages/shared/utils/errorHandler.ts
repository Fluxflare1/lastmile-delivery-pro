export function parseApiError(err: any) {
  const message = err?.response?.data?.error?.message || err.message || "Unknown error";
  const code = err?.response?.data?.error?.code || "UNKNOWN_ERROR";
  const trace = err?.response?.data?.error?.details?.trace_id || "N/A";
  return { message, code, trace };
}
