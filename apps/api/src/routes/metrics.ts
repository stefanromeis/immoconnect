import { Hono } from "hono";
import type { MetricsService } from "../services/metrics.service.js";

export function metricsRoutes(service: MetricsService) {
  const app = new Hono();

  app.get("/", async (c) => {
    const metrics = await service.get();
    return c.json(metrics);
  });

  return app;
}
