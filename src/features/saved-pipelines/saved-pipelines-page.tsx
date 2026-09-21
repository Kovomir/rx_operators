import {
  CheckIcon,
  FolderOpenIcon,
  PencilIcon,
  PlayIcon,
  RefreshCwIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PlaygroundNavigationState } from "@/features/playground/playground-page";

import {
  deleteSavedPipeline,
  loadSavedPipelines,
  renameSavedPipeline,
} from "./saved-pipelines-store";
import {
  SAVED_PIPELINE_LIMIT,
  type SavedPipeline,
} from "./types";

type DeleteState = {
  id: string;
  isDeleting: boolean;
};

export function SavedPipelinesPage() {
  const navigate = useNavigate();
  const [pipelines, setPipelines] = useState<SavedPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);
  const [pendingDeletePipeline, setPendingDeletePipeline] =
    useState<SavedPipeline | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function refreshPipelines() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setPipelines(await loadSavedPipelines());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Uložené pipeline se nepodařilo načíst."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshPipelines();
  }, []);

  function restorePipeline(pipeline: SavedPipeline) {
    const state: PlaygroundNavigationState = {
      restoredPipelineId: pipeline.id,
      restoredPipelineName: pipeline.name,
      restoredPlaygroundState: pipeline.playgroundState,
    };

    navigate("/playground", { state });
  }

  async function removePipeline(pipeline: SavedPipeline) {
    setDeleteState({ id: pipeline.id, isDeleting: true });
    setErrorMessage(null);

    const result = await deleteSavedPipeline(pipeline.id);

    setDeleteState(null);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setPipelines((currentPipelines) =>
      currentPipelines.filter((item) => item.id !== pipeline.id)
    );
    setIsDeleteDialogOpen(false);
  }

  function openDeleteDialog(pipeline: SavedPipeline) {
    setPendingDeletePipeline(pipeline);
    setIsDeleteDialogOpen(true);
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-hidden p-4 md:p-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-normal text-foreground">
            Uložené projekty
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Obnovte rozpracovaný playground nebo odstraňte uložené pipeline, které už nepotřebujete.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={refreshPipelines}
        >
          <RefreshCwIcon />
          Obnovit
        </Button>
      </section>

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <LoadingState label="Načítání uložených projektů" />
      ) : pipelines.length === 0 ? (
        <EmptySavedPipelines />
      ) : (
        <section className="grid min-w-0 gap-3">
          <div className="text-xs text-muted-foreground">
            Uloženo {pipelines.length}/{SAVED_PIPELINE_LIMIT}
          </div>
          {pipelines.map((pipeline) => (
            <SavedPipelineRow
              key={pipeline.id}
              pipeline={pipeline}
              isDeleting={
                deleteState?.id === pipeline.id && deleteState.isDeleting
              }
              onDelete={() => openDeleteDialog(pipeline)}
              onRename={(renamedPipeline) =>
                setPipelines((currentPipelines) =>
                  currentPipelines.map((currentPipeline) =>
                    currentPipeline.id === renamedPipeline.id
                      ? renamedPipeline
                      : currentPipeline
                  )
                )
              }
              onRestore={() => restorePipeline(pipeline)}
            />
          ))}
        </section>
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!deleteState?.isDeleting) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Odstranit pipeline</DialogTitle>
            <DialogDescription>
              Opravdu odstranit pipeline „{pendingDeletePipeline?.name}“? Tuto akci nepůjde vrátit zpět.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={deleteState?.isDeleting}
              >
                Zrušit
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteState?.isDeleting || !pendingDeletePipeline}
              onClick={() => {
                if (pendingDeletePipeline) {
                  void removePipeline(pendingDeletePipeline);
                }
              }}
            >
              <Trash2Icon />
              {deleteState?.isDeleting ? "Mazání" : "Odstranit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function EmptySavedPipelines() {
  return (
    <section className="flex min-h-48 items-center rounded-lg border bg-background p-6 text-left shadow-sm">
      <div className="flex max-w-xl items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FolderOpenIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Zatím nemáte uloženou žádnou pipeline
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pipeline uložíte přímo z playgroundu.
          </p>
        </div>
      </div>
    </section>
  );
}

type SavedPipelineRowProps = {
  pipeline: SavedPipeline;
  isDeleting: boolean;
  onDelete: () => void;
  onRename: (pipeline: SavedPipeline) => void;
  onRestore: () => void;
};

function SavedPipelineRow({
  pipeline,
  isDeleting,
  onDelete,
  onRename,
  onRestore,
}: SavedPipelineRowProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(pipeline.name);
  const [renameErrorMessage, setRenameErrorMessage] = useState<string | null>(
    null
  );
  const [isRenaming, setIsRenaming] = useState(false);

  function startRename() {
    setNameInput(pipeline.name);
    setRenameErrorMessage(null);
    setIsEditingName(true);
  }

  function cancelRename() {
    setNameInput(pipeline.name);
    setRenameErrorMessage(null);
    setIsEditingName(false);
  }

  async function saveRename() {
    setIsRenaming(true);
    setRenameErrorMessage(null);

    const result = await renameSavedPipeline(pipeline.id, nameInput);

    setIsRenaming(false);

    if (!result.ok) {
      setRenameErrorMessage(result.message);
      return;
    }

    onRename(result.pipeline);
    setIsEditingName(false);
  }

  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-lg border bg-background p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        {isEditingName ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Input
              value={nameInput}
              maxLength={80}
              className="max-w-sm"
              disabled={isRenaming}
              onChange={(event) => {
                setNameInput(event.target.value);
                setRenameErrorMessage(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void saveRename();
                }

                if (event.key === "Escape") {
                  cancelRename();
                }
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              disabled={isRenaming}
              aria-label="Potvrdit přejmenování"
              onClick={() => void saveRename()}
            >
              <CheckIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={isRenaming}
              aria-label="Zrušit přejmenování"
              onClick={cancelRename}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-1.5">
            <h2 className="truncate text-sm font-semibold text-foreground">
              {pipeline.name}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Přejmenovat pipeline"
              onClick={startRename}
            >
              <PencilIcon className="size-4" />
            </Button>
          </div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {pipeline.playgroundState.operators.length} operátorů · Uloženo{" "}
          {formatSavedDate(pipeline.updatedAt)}
        </p>
        {renameErrorMessage && (
          <p className="mt-2 text-xs text-destructive">{renameErrorMessage}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button type="button" onClick={onRestore}>
          <PlayIcon />
          Pokračovat
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                disabled={isDeleting}
                aria-label="Odstranit"
                onClick={onDelete}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              Odstranit
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </article>
  );
}

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
