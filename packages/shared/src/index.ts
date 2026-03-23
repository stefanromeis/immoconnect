export type RequestStatus =
  | "Ausstehend"
  | "Genehmigt"
  | "Abgelehnt"
  | "Rückruf erbeten";

export type RequestType =
  | "Reparatur"
  | "Neuvermietung"
  | "Mietanpassung"
  | "Handwerkerauftrag";

export type Priority = "Niedrig" | "Mittel" | "Hoch";

export type UnitStatus = "Vermietet" | "Leerstehend";

export interface Unit {
  id: string;
  number: string;
  area: number;
  tenant: string;
  kaltmiete: number;
  nebenkosten: number;
  status: UnitStatus;
  arrears: number;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  zip: string;
  units: Unit[];
  totalRent: number;
  occupancyRate: number;
  imageUrl: string;
}

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  propertyId: string;
  unitId?: string;
  description: string;
  costEstimate?: number;
  dateSubmitted: string;
  status: RequestStatus;
  priority: Priority;
  managerNote?: string;
  attachments?: string[];
}

export type TokenScope = "approve-request" | "view-unit" | "submit-repair";

export interface ActionToken {
  id: string;
  email: string;
  scope: TokenScope;
  resourceId: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

export interface Recipient {
  id: string;
  email: string;
  name: string;
  role: "tenant" | "landlord";
  unitId?: string;
  propertyId?: string;
}

export interface DashboardMetrics {
  totalRent: number;
  rentTrend: number;
  occupancyRate: number;
  occupancyTrend: number;
  totalArrears: number;
  arrearsTrend: number;
  openRequests: number;
  requestsTrend: number;
}
