import type {
  Property,
  Request,
  DashboardMetrics,
  RequestStatus,
} from "@immoconnect/shared";
import type { PropertyManagementAdapter } from "./adapter.js";

const properties: Property[] = [
  {
    id: "p1",
    address: "Berliner Str. 42",
    city: "Berlin",
    zip: "10115",
    totalRent: 4200,
    occupancyRate: 87.5,
    imageUrl: "bg-gradient-to-br from-blue-400 to-indigo-600",
    units: [
      { id: "u1-1", number: "Whg. EG links", area: 65, tenant: "Müller, J.", kaltmiete: 850, nebenkosten: 150, status: "Vermietet", arrears: 0 },
      { id: "u1-2", number: "Whg. EG rechts", area: 70, tenant: "Schmidt, A.", kaltmiete: 900, nebenkosten: 160, status: "Vermietet", arrears: 0 },
      { id: "u1-3", number: "Whg. 1.OG links", area: 65, tenant: "Weber, K.", kaltmiete: 850, nebenkosten: 150, status: "Vermietet", arrears: 850 },
      { id: "u1-4", number: "Whg. 1.OG rechts", area: 70, tenant: "Leerstehend", kaltmiete: 0, nebenkosten: 0, status: "Leerstehend", arrears: 0 },
      { id: "u1-5", number: "Whg. 2.OG links", area: 65, tenant: "Wagner, P.", kaltmiete: 850, nebenkosten: 150, status: "Vermietet", arrears: 0 },
      { id: "u1-6", number: "Whg. 2.OG rechts", area: 70, tenant: "Becker, S.", kaltmiete: 900, nebenkosten: 160, status: "Vermietet", arrears: 0 },
      { id: "u1-7", number: "Whg. 3.OG links", area: 60, tenant: "Hoffmann, T.", kaltmiete: 800, nebenkosten: 140, status: "Vermietet", arrears: 0 },
      { id: "u1-8", number: "Whg. 3.OG rechts", area: 60, tenant: "Schäfer, M.", kaltmiete: 800, nebenkosten: 140, status: "Vermietet", arrears: 0 },
    ],
  },
  {
    id: "p2",
    address: "Münchner Allee 15",
    city: "München",
    zip: "80331",
    totalRent: 3850,
    occupancyRate: 83.3,
    imageUrl: "bg-gradient-to-br from-emerald-400 to-teal-600",
    units: [
      { id: "u2-1", number: "Whg. EG", area: 90, tenant: "Bauer, H.", kaltmiete: 1200, nebenkosten: 200, status: "Vermietet", arrears: 0 },
      { id: "u2-2", number: "Whg. 1.OG", area: 85, tenant: "Richter, L.", kaltmiete: 1150, nebenkosten: 190, status: "Vermietet", arrears: 0 },
      { id: "u2-3", number: "Whg. 2.OG", area: 85, tenant: "Klein, F.", kaltmiete: 1150, nebenkosten: 190, status: "Vermietet", arrears: 0 },
      { id: "u2-4", number: "Whg. 3.OG", area: 80, tenant: "Wolf, D.", kaltmiete: 1100, nebenkosten: 180, status: "Vermietet", arrears: 1100 },
      { id: "u2-5", number: "Whg. 4.OG links", area: 40, tenant: "Schröder, J.", kaltmiete: 600, nebenkosten: 100, status: "Vermietet", arrears: 0 },
      { id: "u2-6", number: "Whg. 4.OG rechts", area: 40, tenant: "Leerstehend", kaltmiete: 0, nebenkosten: 0, status: "Leerstehend", arrears: 0 },
    ],
  },
  {
    id: "p3",
    address: "Hamburger Weg 8",
    city: "Hamburg",
    zip: "20095",
    totalRent: 2800,
    occupancyRate: 100,
    imageUrl: "bg-gradient-to-br from-orange-400 to-red-500",
    units: [
      { id: "u3-1", number: "Whg. EG", area: 75, tenant: "Neumann, R.", kaltmiete: 950, nebenkosten: 180, status: "Vermietet", arrears: 0 },
      { id: "u3-2", number: "Whg. 1.OG", area: 75, tenant: "Schwarz, B.", kaltmiete: 950, nebenkosten: 180, status: "Vermietet", arrears: 0 },
      { id: "u3-3", number: "Whg. 2.OG", area: 70, tenant: "Zimmermann, K.", kaltmiete: 900, nebenkosten: 170, status: "Vermietet", arrears: 390 },
      { id: "u3-4", number: "Whg. 3.OG", area: 70, tenant: "Braun, E.", kaltmiete: 900, nebenkosten: 170, status: "Vermietet", arrears: 0 },
    ],
  },
  {
    id: "p4",
    address: "Kölner Ring 23",
    city: "Köln",
    zip: "50667",
    totalRent: 1600,
    occupancyRate: 66.6,
    imageUrl: "bg-gradient-to-br from-purple-400 to-pink-600",
    units: [
      { id: "u4-1", number: "Whg. EG", area: 55, tenant: "Leerstehend", kaltmiete: 0, nebenkosten: 0, status: "Leerstehend", arrears: 0 },
      { id: "u4-2", number: "Whg. 1.OG links", area: 45, tenant: "Krüger, M.", kaltmiete: 600, nebenkosten: 120, status: "Vermietet", arrears: 0 },
      { id: "u4-3", number: "Whg. 1.OG rechts", area: 45, tenant: "Hofmann, S.", kaltmiete: 600, nebenkosten: 120, status: "Vermietet", arrears: 0 },
      { id: "u4-4", number: "Whg. 2.OG", area: 90, tenant: "Leerstehend", kaltmiete: 0, nebenkosten: 0, status: "Leerstehend", arrears: 0 },
      { id: "u4-5", number: "Whg. 3.OG links", area: 45, tenant: "Lange, T.", kaltmiete: 600, nebenkosten: 120, status: "Vermietet", arrears: 0 },
      { id: "u4-6", number: "Whg. 3.OG rechts", area: 45, tenant: "Werner, C.", kaltmiete: 600, nebenkosten: 120, status: "Vermietet", arrears: 0 },
    ],
  },
];

const requests: Request[] = [
  {
    id: "r1",
    type: "Reparatur",
    title: "Heizungsanlage defekt",
    propertyId: "p1",
    unitId: "u1-5",
    description: "Die Heizungsanlage im 2. OG links fällt regelmäßig aus. Ein Techniker von der Firma WärmeTech hat sich das angesehen und empfiehlt den Austausch der Pumpe sowie diverser Ventile. Kostenvoranschlag liegt bei.",
    costEstimate: 2400,
    dateSubmitted: "2023-10-24T09:30:00Z",
    status: "Ausstehend",
    priority: "Hoch",
    managerNote: "Bitte um zeitnahe Freigabe, da die Temperaturen sinken und der Mieter bereits mit Mietminderung droht.",
    attachments: ["Kostenvoranschlag_WaermeTech.pdf", "Foto_Heizung.jpg"],
  },
  {
    id: "r2",
    type: "Neuvermietung",
    title: "Neue Mieterin Frau Schmidt",
    propertyId: "p4",
    unitId: "u4-1",
    description: "Wir haben eine passende Mieterin für die EG-Wohnung gefunden. Frau Schmidt ist fest angestellt (Nettoeinkommen 2.800€). Schufa-Auskunft ist positiv. Mietbeginn wäre der 01.12.",
    dateSubmitted: "2023-10-25T14:15:00Z",
    status: "Ausstehend",
    priority: "Mittel",
    managerNote: "Empfehle die Zusage, da die Wohnung bereits seit 2 Monaten leer steht.",
    attachments: ["Selbstauskunft_Schmidt.pdf", "Schufa_Bonitaetscheck.pdf"],
  },
  {
    id: "r3",
    type: "Mietanpassung",
    title: "Mieterhöhung nach Modernisierung",
    propertyId: "p2",
    unitId: "u2-4",
    description: "Nach dem Einbau der neuen Fenster im 3. OG können wir die Miete um 8% der Modernisierungskosten umlegen. Das entspricht einer Erhöhung von 85€ pro Monat.",
    costEstimate: 85,
    dateSubmitted: "2023-10-26T11:00:00Z",
    status: "Ausstehend",
    priority: "Mittel",
    attachments: ["Berechnung_Modernisierungsumlage.pdf"],
  },
  {
    id: "r4",
    type: "Handwerkerauftrag",
    title: "Dachreparatur Flachdach",
    propertyId: "p3",
    description: "Bei der letzten Begehung wurden Risse in der Dachpappe des Flachdachs festgestellt. Um Wasserschäden im Winter zu vermeiden, sollte dies kurzfristig neu abgedichtet werden.",
    costEstimate: 5800,
    dateSubmitted: "2023-10-27T08:45:00Z",
    status: "Ausstehend",
    priority: "Hoch",
    managerNote: "Wir haben 3 Angebote eingeholt. Das Angebot von Dachdecker Müller ist das wirtschaftlichste.",
    attachments: ["Angebot_Mueller.pdf", "Angebot_Schmidt.pdf", "Angebot_Lehmann.pdf", "Fotos_Dach.pdf"],
  },
  {
    id: "r5",
    type: "Reparatur",
    title: "Wasserschaden Badezimmer",
    propertyId: "p1",
    unitId: "u1-3",
    description: "Silikonfugen in der Dusche undicht, Wasser ist in die Wand eingedrungen. Trocknung und Neuverfugung notwendig.",
    costEstimate: 1200,
    dateSubmitted: "2023-10-20T10:20:00Z",
    status: "Genehmigt",
    priority: "Hoch",
    managerNote: "Versicherung ist bereits informiert, wir müssen aber in Vorleistung gehen.",
  },
  {
    id: "r6",
    type: "Neuvermietung",
    title: "Neuer Mieter Herr Weber",
    propertyId: "p4",
    unitId: "u4-4",
    description: "Herr Weber möchte die 90qm Wohnung mieten. Bonität geprüft und einwandfrei.",
    dateSubmitted: "2023-10-18T15:30:00Z",
    status: "Genehmigt",
    priority: "Mittel",
  },
  {
    id: "r7",
    type: "Mietanpassung",
    title: "Indexanpassung 2024",
    propertyId: "p2",
    unitId: "u2-2",
    description: "Reguläre Indexmietanpassung gemäß VPI.",
    dateSubmitted: "2023-10-15T09:00:00Z",
    status: "Abgelehnt",
    priority: "Niedrig",
    managerNote: "Vermieter wünscht aktuell keine Erhöhung, um den guten Mieter zu halten.",
  },
  {
    id: "r8",
    type: "Reparatur",
    title: "Aufzug Wartung",
    propertyId: "p1",
    description: "Die jährliche TÜV-Prüfung steht an. Es müssen vorab einige Verschleißteile getauscht werden.",
    costEstimate: 800,
    dateSubmitted: "2023-10-26T16:45:00Z",
    status: "Rückruf erbeten",
    priority: "Mittel",
  },
];

const metrics: DashboardMetrics = {
  totalRent: 12450,
  rentTrend: 2.4,
  occupancyRate: 87.5,
  occupancyTrend: 1.2,
  totalArrears: 2340,
  arrearsTrend: -5.4,
  openRequests: 4,
  requestsTrend: 2,
};

export class MockAdapter implements PropertyManagementAdapter {
  async getProperties(): Promise<Property[]> {
    return properties;
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    return properties.find((p) => p.id === id);
  }

  async getRequests(): Promise<Request[]> {
    return requests;
  }

  async getRequestById(id: string): Promise<Request | undefined> {
    return requests.find((r) => r.id === id);
  }

  async updateRequestStatus(
    id: string,
    status: RequestStatus
  ): Promise<Request | undefined> {
    const request = requests.find((r) => r.id === id);
    if (!request) return undefined;
    request.status = status;
    return request;
  }

  async getMetrics(): Promise<DashboardMetrics> {
    return metrics;
  }
}
