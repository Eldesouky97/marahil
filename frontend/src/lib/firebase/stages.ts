import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./client";
import type { StageId } from "@/types/stage";

const stageSubjectsRef = collection(db, "stageSubjects");

/**
 * Admin-editable overrides of the static per-stage subject lists (see
 * data/stages.ts / messages/*.json's "stages" namespace). A stage with no
 * doc here just falls back to the static list — see useStages().
 */
export async function getStageSubjectsOverrides(): Promise<Partial<Record<StageId, string[]>>> {
  const snap = await getDocs(stageSubjectsRef);
  const overrides: Partial<Record<StageId, string[]>> = {};
  snap.docs.forEach((d) => {
    overrides[d.id as StageId] = d.data().subjects ?? [];
  });
  return overrides;
}

/** Admin-only (see backend/firestore.rules). */
export async function setStageSubjects(stageId: StageId, subjects: string[]): Promise<void> {
  await setDoc(doc(db, "stageSubjects", stageId), { subjects });
}
