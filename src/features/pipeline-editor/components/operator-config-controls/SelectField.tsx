import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SelectOption } from "./options";

type SelectFieldProps<TValue extends string | number> = {
  label: string;
  value: TValue;
  options: SelectOption<TValue>[];
  disabled: boolean;
  className?: string;
  onValueChange: (value: TValue) => void;
};

export function SelectField<TValue extends string | number>({
  className,
  disabled,
  label,
  onValueChange,
  options,
  value,
}: SelectFieldProps<TValue>) {
  return (
    <label className={className ?? "grid gap-1 text-xs text-muted-foreground"}>
      {label}
      <Select
        value={String(value)}
        disabled={disabled}
        onValueChange={(nextValue) => {
          const selectedOption = options.find(
            (option) => String(option.value) === nextValue
          );

          if (selectedOption) {
            onValueChange(selectedOption.value);
          }
        }}
      >
        <SelectTrigger className="w-full text-xs font-normal">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              className="text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
