import type { RequestStatus } from "@immoconnect/shared";
import type { PropertyManagementAdapter } from "../adapters/index.js";

export class RequestService {
  constructor(private adapter: PropertyManagementAdapter) {}

  async getAll() {
    return this.adapter.getRequests();
  }

  async getById(id: string) {
    return this.adapter.getRequestById(id);
  }

  async updateStatus(id: string, status: RequestStatus) {
    return this.adapter.updateRequestStatus(id, status);
  }
}
