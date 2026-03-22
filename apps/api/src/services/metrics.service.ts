import type { PropertyManagementAdapter } from "../adapters/index.js";

export class MetricsService {
  constructor(private adapter: PropertyManagementAdapter) {}

  async get() {
    return this.adapter.getMetrics();
  }
}
