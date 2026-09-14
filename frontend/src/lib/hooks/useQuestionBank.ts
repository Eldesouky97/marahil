"use client";

import { useCallback, useEffect, useState } from "react";
import { listQuestionBank } from "@/lib/firebase/questionBank";
import type { BankQuestion } from "@/lib/firebase/questionBank";

export function useQuestionBank(teacherId: string | undefined) {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!teacherId) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setQuestions(await listQuestionBank(teacherId));
    setLoading(false);
  }, [teacherId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { questions, loading, refresh };
}
