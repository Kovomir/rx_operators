import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PipelineEditor,
  type PipelineOperator,
} from "@/features/pipeline-editor";
import { createSavedPlaygroundState } from "@/features/saved-pipelines/saved-playground-state";
import {
  createSavedPipeline,
  loadSavedPipelines,
  updateSavedPipeline,
} from "@/features/saved-pipelines/saved-pipelines-store";
import type {
  SavedPipeline,
  SavedPlaygroundState,
} from "@/features/saved-pipelines/types";
import { PipelineVisualizer } from "@/features/stream-visualizer";

const NEW_SAVE_TARGET_ID = "__new__";

export type PlaygroundNavigationState = {
  restoredPipelineId?: string;
  restoredPipelineName?: string;
  restoredPlaygroundState?: SavedPlaygroundState;
};

type SaveStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function PlaygroundPage() {
  const location = useLocation();
  const navigationState = location.state as PlaygroundNavigationState | null;
  const [operators, setOperators] = useState<PipelineOperator[]>(
    () => navigationState?.restoredPlaygroundState?.operators ?? []
  );
  const [pipelineName, setPipelineName] = useState(
    () => navigationState?.restoredPipelineName ?? "Rozpracovaná pipeline"
  );
  const [saveTargetId, setSaveTargetId] = useState(
    () => navigationState?.restoredPipelineId ?? NEW_SAVE_TARGET_ID
  );
  const [savedPipelines, setSavedPipelines] = useState<SavedPipeline[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSaveTargetsLoading, setIsSaveTargetsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSaveDialogOpen) {
      return;
    }

    let isMounted = true;

    async function loadSaveTargets() {
      setIsSaveTargetsLoading(true);

      try {
        const pipelines = await loadSavedPipelines();

        if (!isMounted) {
          return;
        }

        setSavedPipelines(pipelines);

        setSaveTargetId((currentTargetId) =>
          currentTargetId !== NEW_SAVE_TARGET_ID &&
          !pipelines.some((pipeline) => pipeline.id === currentTargetId)
            ? NEW_SAVE_TARGET_ID
            : currentTargetId
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSaveStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Uložené pipeline se nepodařilo načíst.",
        });
      } finally {
        if (isMounted) {
          setIsSaveTargetsLoading(false);
        }
      }
    }

    void loadSaveTargets();

    return () => {
      isMounted = false;
    };
  }, [isSaveDialogOpen]);

  async function savePipeline() {
    setIsSaving(true);
    setSaveStatus(null);

    const playgroundState = createSavedPlaygroundState(operators);
    const result =
      saveTargetId === NEW_SAVE_TARGET_ID
        ? await createSavedPipeline(pipelineName, playgroundState)
        : await updateSavedPipeline(saveTargetId, pipelineName, playgroundState);

    setIsSaving(false);

    if (!result.ok) {
      setSaveStatus({ type: "error", message: result.message });
      return;
    }

    setSaveStatus({
      type: "success",
      message:
        saveTargetId === NEW_SAVE_TARGET_ID
          ? `Pipeline „${result.pipeline.name}“ byla uložena.`
          : `Pipeline „${result.pipeline.name}“ byla přepsána.`,
    });
    setPipelineName(result.pipeline.name);
    setSaveTargetId(result.pipeline.id);
    setSavedPipelines((currentPipelines) => [
      result.pipeline,
      ...currentPipelines.filter((pipeline) => pipeline.id !== result.pipeline.id),
    ]);
    setIsSaveDialogOpen(false);
  }

  function changeSaveTarget(nextTargetId: string) {
    setSaveTargetId(nextTargetId);
    setSaveStatus(null);

    const selectedPipeline = savedPipelines.find(
      (pipeline) => pipeline.id === nextTargetId
    );

    if (selectedPipeline) {
      setPipelineName(selectedPipeline.name);
    }
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-hidden p-4 md:p-6">
      <section className="max-w-3xl">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-normal text-foreground">
            Playground
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Vizualizační playground pro testování různých kombinací parametrů ve volném sandboxu.
          </p>
        </div>
      </section>

      <PipelineEditor
        enabledOperatorTypes={["map", "filter", "skip", "take"]}
        operators={operators}
        onOperatorsChange={setOperators}
        mode="editable"
      />

      <PipelineVisualizer operators={operators} />

      <div className="fixed right-4 bottom-4 z-40 grid justify-items-end gap-2 md:right-6 md:bottom-6">
        {saveStatus?.type === "success" && (
          <p className="max-w-xs rounded-md border border-emerald-200 bg-background px-3 py-2 text-xs text-emerald-700 shadow-sm">
            {saveStatus.message}
          </p>
        )}
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={operators.length === 0}
              className="shadow-lg"
              onClick={() => setSaveStatus(null)}
            >
              <SaveIcon />
              Uložit pipeline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uložit pipeline</DialogTitle>
              <DialogDescription>
                Vyberte novou pozici nebo přepište některou z uložených pipeline.
              </DialogDescription>
            </DialogHeader>

            <label className="grid gap-1.5 text-sm font-medium text-foreground">
              Kam uložit
              <Select
                value={saveTargetId}
                disabled={isSaveTargetsLoading}
                onValueChange={changeSaveTarget}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NEW_SAVE_TARGET_ID}>
                    Nová pipeline
                  </SelectItem>
                  {savedPipelines.map((pipeline) => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      Přepsat: {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="grid gap-1.5 text-sm font-medium text-foreground">
              Název pipeline
              <Input
                value={pipelineName}
                maxLength={80}
                onChange={(event) => {
                  setPipelineName(event.target.value);
                  setSaveStatus(null);
                }}
              />
            </label>

            {saveStatus?.type === "error" && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {saveStatus.message}
              </p>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Zrušit
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={
                  isSaving ||
                  isSaveTargetsLoading ||
                  operators.length === 0
                }
                onClick={savePipeline}
              >
                <SaveIcon />
                {isSaving
                  ? "Ukládání"
                  : saveTargetId === NEW_SAVE_TARGET_ID
                    ? "Uložit novou"
                    : "Přepsat"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
