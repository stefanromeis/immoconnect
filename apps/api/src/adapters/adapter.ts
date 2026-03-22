import type {
  Property,
  Request,
  DashboardMetrics,
  RequestStatus,
} from "@immoconnect/shared";

export interface PropertyManagementAdapter {
  getProperties(): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;

  getRequests(): Promise<Request[]>;
  getRequestById(id: string): Promise<Request | undefined>;
  updateRequestStatus(
    id: string,
    status: RequestStatus
  ): Promise<Request | undefined>;

  getMetrics(): Promise<DashboardMetrics>;
}
