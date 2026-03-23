import type {
  Property,
  Request,
  DashboardMetrics,
  RequestStatus,
  Recipient,
} from "@immoconnect/shared";

/**
 * The interface a customer (ImmoProp software developer) implements
 * to connect their property management system to ImmoConnect.
 *
 * This covers data access only — token/confirmation infrastructure is
 * handled separately via TokenStore and is NOT the customer's concern.
 */
export interface PropertyManagementAdapter {
  // --- Properties ---
  getProperties(): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;

  // --- Requests (Vorgänge) ---
  getRequests(): Promise<Request[]>;
  getRequestById(id: string): Promise<Request | undefined>;
  updateRequestStatus(id: string, status: RequestStatus): Promise<Request | undefined>;

  // --- Dashboard ---
  getMetrics(): Promise<DashboardMetrics>;

  // --- Recipients (who can receive confirmation links) ---
  getRecipientByEmail(email: string): Promise<Recipient | undefined>;
}
