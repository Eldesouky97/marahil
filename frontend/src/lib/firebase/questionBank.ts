import { addDoc, collection, deleteDoc, doc, DocumentData, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./client";
import type { QuizQuestion } from "@/types/quiz";

export interface BankQuestion extends QuizQuestion {
  teacherId: string;
  createdAt: number;
}

const bankRef = collection(db, "questionBank");

function mapBankQuestion(id: string, data: DocumentData): BankQuestion {
  return {
    id,
    question: data.question,
    choices: data.choices,
    correct: data.correct,
    explanation: data.explanation,
    teacherId: data.teacherId,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export async function listQuestionBank(teacherId: string): Promise<BankQuestion[]> {
  const snap = await getDocs(query(bankRef, where("teacherId", "==", teacherId)));
  return snap.docs.map((d) => mapBankQuestion(d.id, d.data()));
}

export async function addBankQuestion(teacherId: string, question: Omit<QuizQuestion, "id">): Promise<string> {
  const created = await addDoc(bankRef, { ...question, teacherId, createdAt: serverTimestamp() });
  return created.id;
}

export async function updateBankQuestion(questionId: string, patch: Partial<Omit<QuizQuestion, "id">>): Promise<void> {
  await updateDoc(doc(db, "questionBank", questionId), patch);
}

export async function deleteBankQuestion(questionId: string): Promise<void> {
  await deleteDoc(doc(db, "questionBank", questionId));
}
