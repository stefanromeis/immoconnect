import type { PropertyManagementAdapter } from "../adapters/index.js";

export class PropertyService {
  constructor(private adapter: PropertyManagementAdapter) {}

  async getAll() {
    return this.adapter.getProperties();
  }

  async getById(id: string) {
    return this.adapter.getPropertyById(id);
  }
}
