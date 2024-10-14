import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column, Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  table: Table<TData>;
}
type ComparisonOperator = "lessThan" | "greaterThan" | "equals";

export function DataTableComparisonFilter<TData, TValue>({
  column,
  title,
  options,
  table,
}: DataTableFacetedFilterProps<TData, TValue>) {
  // const facets = column?.getFacetedUniqueValues();
  const [value, setValue] = React.useState<string[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const selectedValues = new Set(
    value.length > 0 ? value : (column?.getFilterValue() as string[])
  );

  const updateUrl = (value: string) => {
    window.history.replaceState({}, "", `${window.location.pathname}?${value}`);
  };
  React.useEffect(() => {
    if (column?.getFilterValue() === undefined) {
      setValue([]);
      setInput("");
    }
  }, [column?.getFilterValue()]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="max-md:w-full">
        <Button
          variant="outline"
          size="lg"
          className="max-md:h-11 h-[36px] border  px-3 rounded-[32px] max-md:w-full flex justify-between "
        >
          {title}
          {open ? (
            <ChevronUp className="ml-2" size={18} />
          ) : (
            <ChevronDown className="ml-2" size={18} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="   w-[300px] md:w-[200px]  p-0 relative md:-left-10"
        align="center"
      >
        <Command>
          <div className="p-2">
            <Input
              placeholder="Enter value"
              className="h-8 rounded-sm"
              value={input}
              type="number"
              onChange={(e) => {
                column?.setFilterValue(e.target.value);
                setInput(e.target.value);
              }}
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      updateUrl(option.value);
                      selectedValues.clear();
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      setValue(filterValues);
                      {
                        input && column?.setFilterValue(String(input));
                      }
                    }}
                  >
                    <div className="border border-primary p-[1px] h-4 w-4 rounded-lg mr-2">
                      <div
                        className={cn(
                          " flex h-full w-full  rounded-lg items-center justify-center  border  ",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        {/* <CheckIcon className={cn("h-4 w-4")} /> */}
                      </div>
                    </div>
                    {/* {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}

                    <span>{option.label}</span>
                    {/* {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )} */}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined);
                      setValue([]);
                      setInput("");
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
