import type { TokenScope, ActionToken } from "@immoconnect/shared";
import type { PropertyManagementAdapter } from "../adapters/adapter.js";
import type { TokenStore } from "../adapters/token-store.js";

export class TokenService {
  constructor(
    private adapter: PropertyManagementAdapter,
    private store: TokenStore
  ) {}

  async createForEmail(
    email: string,
    scope: TokenScope,
    resourceId: string
  ): Promise<ActionToken | null> {
    const recipient = await this.adapter.getRecipientByEmail(email);
    if (!recipient) return null;
    return this.store.createToken(email, scope, resourceId);
  }

  async validate(
    id: string
  ): Promise<{ valid: true; token: ActionToken } | { valid: false; email?: string }> {
    const token = await this.store.getToken(id);
    if (!token) return { valid: false };
    if (token.usedAt) return { valid: false, email: token.email };
    if (new Date(token.expiresAt) < new Date()) return { valid: false, email: token.email };
    return { valid: true, token };
  }

  async consume(id: string): Promise<void> {
    return this.store.consumeToken(id);
  }
}
