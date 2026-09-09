export type StageId =
  | "kg"
  | "primary"
  | "prep"
  | "secondary"
  | "university"
  | "training";

export interface Stage {
  id: StageId;
  label: string;
  subjects: string[];
}
