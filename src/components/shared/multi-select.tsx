"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Popover } from "@radix-ui/react-popover";
import { ScrollArea } from "../ui/scroll-area";

type Framework = Record<"value" | "label", string>;

interface Props {
  options: Framework[];
  placeholder: string;
  setSelections: (values: Framework[]) => void;
  selectedVal: any;
  disabled: boolean;
}
export function FancyMultiSelect({
  options: OPTIONS,
  placeholder,
  setSelections,
  selectedVal,
  disabled,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [noData, setNoData] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((framework: Framework) => {
    setSelected((prev) => prev.filter((s) => s.value !== framework.value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = OPTIONS.filter(
    (framework) => !selected.some((sel) => sel.value === framework.value)
  );

  React.useEffect(() => {
    if (selected.length > 0) {
      setSelections(selected);
    }
  }, [selected]);

  React.useEffect(() => {
    if (selected.length == 0 && selectedVal && selectedVal.length > 0) {
      setSelected(selectedVal);
    }
  }, [selectedVal]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent h-15"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected &&
            selected.length > 0 &&
            selected.map((framework) => {
              return (
                <Badge key={framework.value} variant="secondary">
                  {framework.label}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(framework);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(framework)}
                    disabled={disabled ? true : false}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => {
              setOpen(false);
              setNoData(false);
            }}
            onFocus={() =>
              selectables.length > 0 ? setOpen(true) : setNoData(true)
            }
            disabled={disabled ? true : false}
            placeholder={placeholder || "Select options..."}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <Popover>
          <CommandList className={open ? " h-40" : noData ? "h-10" : ""}>
            {open && selectables.length > 0 ? (
              <div className="absolute top-0 z-[1] w-full rounded-md  h- bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((framework) => {
                    return (
                      <CommandItem
                        key={framework.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={(value) => {
                          setInputValue("");
                          setSelected((prev) => [...prev, framework]);
                        }}
                        className={"cursor-pointer"}
                      >
                        {framework.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ) : null}
            {noData && (
              <div className="absolute top-0 z-[1] w-full rounded-md  h- bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto">
                  <CommandItem>No data found</CommandItem>
                </CommandGroup>
              </div>
            )}
          </CommandList>
        </Popover>
      </div>
    </Command>
  );
}
