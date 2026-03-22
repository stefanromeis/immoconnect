import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { MockAdapter } from "./adapters/index.js";
import {
  PropertyService,
  RequestService,
  MetricsService,
} from "./services/index.js";
import {
  propertiesRoutes,
  requestsRoutes,
  metricsRoutes,
} from "./routes/index.js";

const adapter = new MockAdapter();
const propertyService = new PropertyService(adapter);
const requestService = new RequestService(adapter);
const metricsService = new MetricsService(adapter);

const app = new Hono();

app.use("/api/*", cors({ origin: "http://localhost:5173" }));

app.route("/api/properties", propertiesRoutes(propertyService));
app.route("/api/requests", requestsRoutes(requestService));
app.route("/api/metrics", metricsRoutes(metricsService));

const port = 3001;
console.log(`ImmoConnect API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
