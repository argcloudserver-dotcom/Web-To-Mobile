import type { Lead, LeadActivity } from "@workspace/db";

export interface LeadWithRelations extends Lead {
  projectName: string | null;
  primarySalesName: string | null;
}

export interface LeadActivityWithUser extends LeadActivity {
  userName: string | null;
}

export const LEAD_STATUSES = [
  "new",
  "called",
  "qualified",
  "meeting",
  "negotiation",
  "bought",
  "not_qualified",
  "low_budget",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
