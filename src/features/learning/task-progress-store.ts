import { supabase } from "@/lib/supabase";

import {
  getLearningTaskOperatorType,
  LEARNING_TASK_IDS,
} from "./learning-tasks";

const LEARNING_MODULE_ID = "learning";

type TaskCompletionRow = {
  task_id: string;
};

export type SaveTaskCompletionResult =
  | { ok: true }
  | { ok: false; message: string };

export async function loadCompletedLearningTaskIds() {
  if (!supabase) {
    return new Set<string>();
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return new Set<string>();
  }

  const { data, error } = await supabase
    .from("task_completions")
    .select("task_id")
    .eq("user_id", user.id)
    .in("task_id", LEARNING_TASK_IDS)
    .overrideTypes<TaskCompletionRow[], { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return new Set(data.map((row) => row.task_id));
}

export async function saveLearningTaskCompletion(
  taskId: string
): Promise<SaveTaskCompletionResult> {
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase není nakonfigurovaný.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { ok: false, message: userError.message };
  }

  if (!user) {
    return {
      ok: false,
      message: "Pro ukládání postupu je potřeba přihlášení.",
    };
  }

  const operatorType = getLearningTaskOperatorType(taskId);

  const { error } = await supabase.from("task_completions").upsert(
    {
      user_id: user.id,
      task_id: taskId,
      module_id: LEARNING_MODULE_ID,
      operator_id: operatorType ?? null,
      completed_at: new Date().toISOString(),
      metadata: {
        source: "learning_tasks",
      },
    },
    {
      onConflict: "user_id,task_id",
    }
  );

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}
