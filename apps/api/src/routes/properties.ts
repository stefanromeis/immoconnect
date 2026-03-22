import { Hono } from "hono";
import type { PropertyService } from "../services/property.service.js";

export function propertiesRoutes(service: PropertyService) {
  const app = new Hono();

  app.get("/", async (c) => {
    const properties = await service.getAll();
    return c.json(properties);
  });

  app.get("/:id", async (c) => {
    const property = await service.getById(c.req.param("id"));
    if (!property) {
      return c.json({ error: "Property not found" }, 404);
    }
    return c.json(property);
  });

  return app;
}
