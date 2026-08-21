import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { OPERATOR_CATALOG } from "../operator-catalog";
import type { PipelineOperatorType } from "../types";
import { FlowConnector } from "./FlowConnector";
import { OperatorIcon } from "./OperatorIcon";

type InsertSlotProps = {
  disabled: boolean;
  onAddOperator: (type: PipelineOperatorType) => void;
};

export function InsertSlot({ disabled, onAddOperator }: InsertSlotProps) {
  return (
    <div className="group/slot flex shrink-0 items-center gap-1">
      <FlowConnector muted arrow={false} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative z-10 rounded-full border-dashed bg-background shadow-sm transition-colors group-hover/slot:border-primary/45 group-hover/slot:text-primary"
            aria-label="Přidat operátor"
            disabled={disabled}
          >
            <PlusIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="center"
          sideOffset={10}
          className="w-80 p-2"
        >
          <DropdownMenuLabel>Přidat operátor</DropdownMenuLabel>
          <div className="grid gap-1">
            {OPERATOR_CATALOG.map((operator) => (
              <DropdownMenuItem
                key={operator.type}
                className="items-start gap-3 p-2"
                onSelect={() => onAddOperator(operator.type)}
              >
                <OperatorIcon type={operator.type} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {operator.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {operator.description}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <FlowConnector muted />
    </div>
  );
}
