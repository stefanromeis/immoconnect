import { Hono } from "hono";
import type { RequestService } from "../services/request.service.js";

export function requestsRoutes(service: RequestService) {
  const app = new Hono();

  app.get("/", async (c) => {
    const requests = await service.getAll();
    return c.json(requests);
  });

  app.get("/:id", async (c) => {
    const request = await service.getById(c.req.param("id"));
    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }
    return c.json(request);
  });

  app.patch("/:id", async (c) => {
    const body = await c.req.json();
    const { status } = body;
    if (!status) {
      return c.json({ error: "Status is required" }, 400);
    }
    const updated = await service.updateStatus(c.req.param("id"), status);
    if (!updated) {
      return c.json({ error: "Request not found" }, 404);
    }
    return c.json(updated);
  });

  return app;
}
