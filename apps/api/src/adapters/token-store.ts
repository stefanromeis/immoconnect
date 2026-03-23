import type { ActionToken, TokenScope } from "@immoconnect/shared";

/**
 * Persistence layer for confirmation tokens.
 *
 * ImmoConnect ships an InMemoryTokenStore for development.
 * For production, implement this interface backed by Redis, Postgres, etc.
 * Customers do NOT need to implement this — it is ImmoConnect infrastructure.
 */
export interface TokenStore {
  createToken(email: string, scope: TokenScope, resourceId: string): Promise<ActionToken>;
  getToken(id: string): Promise<ActionToken | undefined>;
  consumeToken(id: string): Promise<void>;
}
