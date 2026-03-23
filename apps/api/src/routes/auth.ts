import { Hono } from "hono";
import type { TokenService } from "../services/token.service.js";
import type { EmailService } from "../services/email.service.js";
import type { RequestService } from "../services/request.service.js";

export function authRoutes(
  tokenService: TokenService,
  emailService: EmailService,
  requestService: RequestService
) {
  const app = new Hono();

  // POST /api/auth/request-link
  // Body: { email, scope, resourceId }
  // Called by the manager's web app to send a magic link to a recipient
  app.post("/request-link", async (c) => {
    const { email, scope, resourceId } = await c.req.json();
    if (!email || !scope || !resourceId) {
      return c.json({ error: "email, scope and resourceId are required" }, 400);
    }

    const token = await tokenService.createForEmail(email, scope, resourceId);
    if (!token) {
      // Don't reveal whether the email is registered
      return c.json({ ok: true });
    }

    await emailService.sendMagicLink(email, token.id, scope);
    return c.json({ ok: true });
  });

  // POST /api/auth/resend
  // Body: { email }
  // Called from the expired-link page — user requests a new link for the same resource
  app.post("/resend", async (c) => {
    const { email, scope, resourceId } = await c.req.json();
    if (!email || !scope || !resourceId) {
      return c.json({ error: "email, scope and resourceId are required" }, 400);
    }

    const token = await tokenService.createForEmail(email, scope, resourceId);
    if (!token) {
      return c.json({ ok: true }); // silent — don't reveal unregistered emails
    }

    await emailService.sendMagicLink(email, token.id, scope);
    return c.json({ ok: true });
  });

  // GET /api/auth/token/:id
  // Validates a token and returns scoped data
  app.get("/token/:id", async (c) => {
    const result = await tokenService.validate(c.req.param("id"));

    if (!result.valid) {
      return c.json(
        { valid: false, email: "email" in result ? result.email : undefined },
        410
      );
    }

    const { token } = result;

    if (token.scope === "approve-request") {
      const request = await requestService.getById(token.resourceId);
      if (!request) return c.json({ error: "Resource not found" }, 404);
      return c.json({ valid: true, token, request });
    }

    return c.json({ valid: true, token });
  });

  // POST /api/auth/token/:id/act
  // Executes the action and consumes the token (single-use)
  app.post("/token/:id/act", async (c) => {
    const result = await tokenService.validate(c.req.param("id"));
    if (!result.valid) {
      return c.json({ error: "Token invalid or expired" }, 410);
    }

    const { token } = result;
    const body = await c.req.json();

    if (token.scope === "approve-request") {
      const { status } = body;
      if (!status) return c.json({ error: "status is required" }, 400);
      await requestService.updateStatus(token.resourceId, status);
      await tokenService.consume(token.id);
      return c.json({ ok: true, status });
    }

    return c.json({ error: "Unknown scope" }, 400);
  });

  return app;
}
