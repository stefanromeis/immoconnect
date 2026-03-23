import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { MockAdapter, InMemoryTokenStore } from "./adapters/index.js";
import {
  PropertyService,
  RequestService,
  MetricsService,
  TokenService,
  EmailService,
} from "./services/index.js";
import {
  propertiesRoutes,
  requestsRoutes,
  metricsRoutes,
  authRoutes,
} from "./routes/index.js";

const adapter = new MockAdapter();
const tokenStore = new InMemoryTokenStore();

const propertyService = new PropertyService(adapter);
const requestService = new RequestService(adapter);
const metricsService = new MetricsService(adapter);
const tokenService = new TokenService(adapter, tokenStore);
const emailService = new EmailService();

const app = new Hono();

app.use("/api/*", cors({ origin: "http://localhost:5173" }));

app.route("/api/properties", propertiesRoutes(propertyService));
app.route("/api/requests", requestsRoutes(requestService));
app.route("/api/metrics", metricsRoutes(metricsService));
app.route("/api/auth", authRoutes(tokenService, emailService, requestService));

const port = 3001;
console.log(`ImmoConnect API running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
