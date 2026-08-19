type PipelineEditorHeaderProps = {
  operatorCount: number;
  maxOperators: number;
};

export function PipelineEditorHeader({
  operatorCount,
  maxOperators,
}: PipelineEditorHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground">Rx pipeline</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Skládejte vlastní řetězce operátorů a nastavujte jejich parametry.
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        <div className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground">
          {operatorCount}/{maxOperators}
        </div>
      </div>
    </div>
  );
}
