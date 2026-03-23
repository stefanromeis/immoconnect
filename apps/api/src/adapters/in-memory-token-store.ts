import { randomBytes } from "node:crypto";
import type { ActionToken, TokenScope } from "@immoconnect/shared";
import type { TokenStore } from "./token-store.js";

/**
 * Default TokenStore for development and testing.
 * Tokens are kept in-process memory — they are lost on server restart.
 *
 * Replace with a Redis or Postgres-backed implementation for production.
 */
export class InMemoryTokenStore implements TokenStore {
  private tokens = new Map<string, ActionToken>();

  async createToken(email: string, scope: TokenScope, resourceId: string): Promise<ActionToken> {
    const token: ActionToken = {
      id: randomBytes(32).toString("base64url"),
      email,
      scope,
      resourceId,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.tokens.set(token.id, token);
    return token;
  }

  async getToken(id: string): Promise<ActionToken | undefined> {
    return this.tokens.get(id);
  }

  async consumeToken(id: string): Promise<void> {
    const token = this.tokens.get(id);
    if (token) {
      this.tokens.set(id, { ...token, usedAt: new Date().toISOString() });
    }
  }
}
