/**
 * Domain primitives for the Leads feature.
 */

export const STATUS_LABELS: Record<
  string,
  { en: string; ar: string }
> = {
  new:           { en: "New",           ar: "جديد" },
  called:        { en: "Contacted",     ar: "تم الاتصال" },
  qualified:     { en: "Qualified",     ar: "مؤهل" },
  meeting:       { en: "Meeting",       ar: "اجتماع" },
  negotiation:   { en: "Negotiation",   ar: "تفاوض" },
  bought:        { en: "Bought",        ar: "اشترى" },
  not_qualified: { en: "Not Qualified", ar: "غير مؤهل" },
  low_budget:    { en: "Low Budget",    ar: "ميزانية قليلة" },
};

export const LEAD_STATUS_ORDER: readonly string[] = [
  "new",
  "called",
  "qualified",
  "meeting",
  "negotiation",
  "bought",
  "not_qualified",
  "low_budget",
] as const;

export const LEAD_SOURCES = [
  "manual",
  "import",
  "campaign",
  "referral",
  "website",
  "social",
] as const;
export type LeadSourceLiteral = (typeof LEAD_SOURCES)[number];

export type TFunc = (
  key: string,
  values?: Record<string, string | number>,
) => string;
