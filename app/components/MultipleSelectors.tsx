import React from "react";
import MultipleSelector from "./ui/multipleSelect";
import type { Option } from "./ui/multipleSelect";

export function MultipleSelectors({
  options,
  selected,
  setSelected,
  label,
  dropdownRef,
}: {
  options: Option[];
  selected: Option[];
  setSelected: (selected: Option[]) => void;
  label: string;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex flex-col gap-[6px] w-full md:w-[240px]">
      <label className="text-foreground text-sm">{label}</label>
      <MultipleSelector
        defaultOptions={options}
        className="w-full md:w-[240px]"
        placeholder={`Select ${label}...`}
        selected={selected}
        setSelected={setSelected}
        allSelectLabel={`All ${label}`}
        dropdownRef={dropdownRef}
        emptyIndicator={
          <p className="text-center text-md leading-50">
            No {label.toLowerCase()} found.
          </p>
        }
        groupBy="group"
      />
    </div>
  );
}
