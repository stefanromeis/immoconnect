export type {
  Property,
  Unit,
  Request,
  DashboardMetrics,
  RequestStatus,
  RequestType,
  Priority,
  UnitStatus,
  ActionToken,
  TokenScope,
  Recipient,
} from "@immoconnect/shared";

export type UserRole = "vermieter" | "verwalter" | "admin";

export type UserStatus = "Aktiv" | "Ausstehend" | "Eingeladen" | "Deaktiviert";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  lastActive?: string;
  properties?: string[];
}
