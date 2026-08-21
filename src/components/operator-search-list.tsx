import { type ReactNode, useMemo, useState } from "react";

import { SearchInput } from "@/components/ui/search-input";

type SearchableOperator = {
  label: string;
};

type OperatorSearchListProps<TOperator extends SearchableOperator> = {
  ariaLabel: string;
  emptyMessage?: string;
  operators: TOperator[];
  placeholder: string;
  renderOperator: (operator: TOperator) => ReactNode;
};

export function OperatorSearchList<TOperator extends SearchableOperator>({
  ariaLabel,
  emptyMessage = "Nebyl nalezen žádný operátor.",
  operators,
  placeholder,
  renderOperator,
}: OperatorSearchListProps<TOperator>) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOperators = useMemo(
    () =>
      operators.filter((operator) =>
        matchesOperatorName(operator.label, searchQuery)
      ),
    [operators, searchQuery]
  );

  return (
    <>
      <SearchInput
        value={searchQuery}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onClear={() => setSearchQuery("")}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <section className="grid min-w-0 gap-3">
        {filteredOperators.length > 0 ? (
          filteredOperators.map((operator) => renderOperator(operator))
        ) : (
          <div className="rounded-lg border bg-background px-4 py-5 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </section>
    </>
  );
}

function matchesOperatorName(operatorLabel: string, searchQuery: string) {
  const normalizedQuery = normalizeSearchText(searchQuery);

  if (normalizedQuery.length === 0) {
    return true;
  }

  return normalizeSearchText(operatorLabel).includes(normalizedQuery);
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("cs-CZ");
}
