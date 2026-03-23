# ImmoConnect

A property management portal for landlords (Vermieter) to oversee properties, review requests from their property manager, and approve or reject them via magic links — no login required for recipients.

## Architecture

```
apps/
  web/    @immoconnect/web   — Remix frontend (SSR, Tailwind, Framer Motion)
  api/    @immoconnect/api   — Hono integration API (Node.js, adapter pattern)
packages/
  shared/ @immoconnect/shared — Canonical types shared across apps
```

### Two-layer design

```
Remix Web App  ──────────►  Integration API  ──────────►  PropertyManagementAdapter
(UI + workflows)             (Hono, port 3001)             (customer implements this)
```

The **Integration API** acts as a standardisation layer. Property management software developers implement the `PropertyManagementAdapter` interface to connect their system to ImmoConnect. Swap adapters without touching the frontend.

**`PropertyManagementAdapter`** — what a customer implements (7 methods):
- `getProperties` / `getPropertyById`
- `getRequests` / `getRequestById` / `updateRequestStatus`
- `getMetrics`
- `getRecipientByEmail`

**`TokenStore`** — ImmoConnect infrastructure (not the customer's concern). Ships with `InMemoryTokenStore` for development; swap for Redis/Postgres in production.

## Magic link flow

1. Manager triggers "send approval link" in the web app
2. API generates a scoped token (48h expiry, single-use) and emails a link to the recipient
3. Recipient opens `/a/:token` — sees a large, accessible approve/reject UI (no login required)
4. On action the token is consumed; the request status is updated in the adapter
5. If the link expires, `/auth/request-link` lets the recipient request a new one by email

## Getting started

```bash
# Install dependencies
pnpm install

# Start both servers in parallel
pnpm dev
```

| Service | URL |
|---|---|
| Web (Remix) | http://localhost:5173 |
| API (Hono) | http://localhost:3001 |

Or run individually:

```bash
pnpm dev:web   # Remix frontend only
pnpm dev:api   # Hono API only
```

## Mock recipients (dev)

The mock adapter ships with these registered email addresses for testing magic links:

| Email | Role |
|---|---|
| johannes.doe@beispiel.de | Landlord |
| mueller@beispiel.de | Tenant (Berliner Str. 42, EG links) |
| weber@beispiel.de | Tenant (Berliner Str. 42, 1.OG links) |
| wolf@beispiel.de | Tenant (Münchner Allee 15, 3.OG) |

In dev mode the magic link is printed to the API terminal — no email provider needed.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `API_URL` | `http://localhost:3001` | API base URL (web app) |
| `APP_URL` | `http://localhost:5173` | Frontend base URL (API, for email links) |
| `SESSION_SECRET` | — | Required in production for cookie signing |
| `NODE_ENV` | `development` | Set to `production` to enable real email sending |

## Implementing your own adapter

```ts
import type { PropertyManagementAdapter } from "@immoconnect/api/adapters";

export class MyPropSoftwareAdapter implements PropertyManagementAdapter {
  async getProperties() { /* fetch from your system */ }
  async getPropertyById(id) { /* ... */ }
  async getRequests() { /* ... */ }
  async getRequestById(id) { /* ... */ }
  async updateRequestStatus(id, status) { /* ... */ }
  async getMetrics() { /* ... */ }
  async getRecipientByEmail(email) { /* ... */ }
}
```

Then swap it in `apps/api/src/index.ts`:

```ts
const adapter = new MyPropSoftwareAdapter();
```
