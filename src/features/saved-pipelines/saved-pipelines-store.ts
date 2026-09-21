import { supabase } from "@/lib/supabase";

import { parseSavedPlaygroundState } from "./saved-playground-state";
import {
  SAVED_PIPELINE_LIMIT,
  type SavedPipeline,
  type SavedPlaygroundState,
  type SavePipelineResult,
} from "./types";

type SavedPipelineRow = {
  id: string;
  name: string;
  pipeline: unknown;
  created_at: string;
  updated_at: string;
};

type DeletePipelineResult =
  | { ok: true }
  | { ok: false; message: string };

type RenamePipelineResult =
  | { ok: true; pipeline: SavedPipeline }
  | { ok: false; message: string };

type UpdatePipelineResult =
  | { ok: true; pipeline: SavedPipeline }
  | { ok: false; message: string };

export async function loadSavedPipelines(): Promise<SavedPipeline[]> {
  if (!supabase) {
    return [];
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_pipelines")
    .select("id,name,pipeline,created_at,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .overrideTypes<SavedPipelineRow[], { merge: false }>();

  if (error) {
    throw new Error(error.message);
  }

  return data.flatMap((row) => {
    const playgroundState = parseSavedPlaygroundState(row.pipeline);

    if (!playgroundState) {
      return [];
    }

    return [mapSavedPipelineRow(row, playgroundState)];
  });
}

export async function createSavedPipeline(
  name: string,
  playgroundState: SavedPlaygroundState
): Promise<SavePipelineResult> {
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
      message: "Pro ukládání pipeline je potřeba přihlášení.",
    };
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    return {
      ok: false,
      message: "Zadejte název pipeline.",
    };
  }

  const { count, error: countError } = await supabase
    .from("saved_pipelines")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    return { ok: false, message: countError.message };
  }

  if ((count ?? 0) >= SAVED_PIPELINE_LIMIT) {
    return {
      ok: false,
      message: `Můžete mít uložených nejvýše ${SAVED_PIPELINE_LIMIT} pipeline. Nejprve některou odstraňte.`,
    };
  }

  const { data, error } = await supabase
    .from("saved_pipelines")
    .insert({
      user_id: user.id,
      name: normalizedName,
      pipeline: playgroundState,
    })
    .select("id,name,pipeline,created_at,updated_at")
    .single<SavedPipelineRow>();

  if (error) {
    return { ok: false, message: error.message };
  }

  const parsedState = parseSavedPlaygroundState(data.pipeline);

  if (!parsedState) {
    return {
      ok: false,
      message: "Pipeline se uložila v neplatném formátu.",
    };
  }

  return {
    ok: true,
    pipeline: mapSavedPipelineRow(data, parsedState),
  };
}

export async function deleteSavedPipeline(
  id: string
): Promise<DeletePipelineResult> {
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase není nakonfigurovaný.",
    };
  }

  const { error } = await supabase.from("saved_pipelines").delete().eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

export async function renameSavedPipeline(
  id: string,
  name: string
): Promise<RenamePipelineResult> {
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase není nakonfigurovaný.",
    };
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    return {
      ok: false,
      message: "Zadejte název pipeline.",
    };
  }

  const { data, error } = await supabase
    .from("saved_pipelines")
    .update({ name: normalizedName })
    .eq("id", id)
    .select("id,name,pipeline,created_at,updated_at")
    .single<SavedPipelineRow>();

  if (error) {
    return { ok: false, message: error.message };
  }

  const parsedState = parseSavedPlaygroundState(data.pipeline);

  if (!parsedState) {
    return {
      ok: false,
      message: "Pipeline má neplatný formát.",
    };
  }

  return {
    ok: true,
    pipeline: mapSavedPipelineRow(data, parsedState),
  };
}

export async function updateSavedPipeline(
  id: string,
  name: string,
  playgroundState: SavedPlaygroundState
): Promise<UpdatePipelineResult> {
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase není nakonfigurovaný.",
    };
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    return {
      ok: false,
      message: "Zadejte název pipeline.",
    };
  }

  const { data, error } = await supabase
    .from("saved_pipelines")
    .update({
      name: normalizedName,
      pipeline: playgroundState,
    })
    .eq("id", id)
    .select("id,name,pipeline,created_at,updated_at")
    .single<SavedPipelineRow>();

  if (error) {
    return { ok: false, message: error.message };
  }

  const parsedState = parseSavedPlaygroundState(data.pipeline);

  if (!parsedState) {
    return {
      ok: false,
      message: "Pipeline se uložila v neplatném formátu.",
    };
  }

  return {
    ok: true,
    pipeline: mapSavedPipelineRow(data, parsedState),
  };
}

function mapSavedPipelineRow(
  row: SavedPipelineRow,
  playgroundState: SavedPlaygroundState
): SavedPipeline {
  return {
    id: row.id,
    name: row.name,
    playgroundState,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
