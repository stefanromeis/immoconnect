import type { Property, Request, DashboardMetrics, ActionToken } from "~/types";

const API_BASE = process.env.API_URL || "http://localhost:3001";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, init);
  } catch (cause) {
    throw new Response(
      `Cannot reach API at ${API_BASE}. Is @immoconnect/api running? (pnpm dev:api)`,
      { status: 503 }
    );
  }
  if (!res.ok) {
    throw new Response(`API error: ${res.status}`, { status: res.status });
  }
  return res.json() as Promise<T>;
}

export async function fetchProperties(): Promise<Property[]> {
  return apiFetch<Property[]>("/api/properties");
}

export async function fetchProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/properties/${id}`);
}

export async function fetchRequests(): Promise<Request[]> {
  return apiFetch<Request[]>("/api/requests");
}

export async function fetchRequest(id: string): Promise<Request> {
  return apiFetch<Request>(`/api/requests/${id}`);
}

export async function fetchMetrics(): Promise<DashboardMetrics> {
  return apiFetch<DashboardMetrics>("/api/metrics");
}

export async function updateRequestStatus(
  id: string,
  status: string
): Promise<Request> {
  return apiFetch<Request>(`/api/requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

// --- Magic link / token auth ---

type TokenValidResult =
  | { valid: true; token: ActionToken; request?: Request }
  | { valid: false; email?: string };

export async function validateToken(id: string): Promise<TokenValidResult> {
  try {
    return await apiFetch<TokenValidResult>(`/api/auth/token/${id}`);
  } catch (err) {
    if (err instanceof Response && err.status === 410) {
      return err.json() as Promise<TokenValidResult>;
    }
    throw err;
  }
}

export async function actOnToken(
  id: string,
  body: Record<string, string>
): Promise<{ ok: boolean; status?: string }> {
  return apiFetch(`/api/auth/token/${id}/act`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function requestMagicLink(
  email: string,
  scope: string,
  resourceId: string
): Promise<{ ok: boolean }> {
  return apiFetch("/api/auth/request-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, scope, resourceId }),
  });
}

export async function resendMagicLink(
  email: string,
  scope: string,
  resourceId: string
): Promise<{ ok: boolean }> {
  return apiFetch("/api/auth/resend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, scope, resourceId }),
  });
}
