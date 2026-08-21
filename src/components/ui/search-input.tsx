import type { ComponentProps } from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Input } from "./input";

type SearchInputProps = Omit<ComponentProps<"input">, "type"> & {
  wrapperClassName?: string;
  onClear?: () => void;
};

function SearchInput({
  className,
  onClear,
  value,
  wrapperClassName,
  ...props
}: SearchInputProps) {
  const hasValue = value !== undefined && String(value).length > 0;

  return (
    <div className={cn("relative w-full max-w-md", wrapperClassName)}>
      <SearchIcon
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="text"
        inputMode="search"
        className={cn("pl-8", hasValue && onClear && "pr-8", className)}
        value={value}
        {...props}
      />
      {hasValue && onClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Vymazat hledání"
          onClick={onClear}
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

export { SearchInput };
