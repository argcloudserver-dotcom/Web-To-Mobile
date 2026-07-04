export type DealStage = "new" | "qualified" | "meeting" | "bought" | "not_qualified";
export interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: DealStage;
  contactId: string;
  createdAt: string;
  updatedAt: string;
}
