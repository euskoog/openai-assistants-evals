import * as React from "react";
import { Check, X } from "lucide-react";

import { Command as CommandPrimitive } from "cmdk";
import { useEffect } from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}
interface GroupOption {
  [key: string]: Option[];
}

interface MultipleSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  onChange?: (options: Option[]) => void;

  /* Custom selected options for parent state management. */
  selected?: Option[];
  setSelected?: (options: Option[]) => void;

  /* All Select Label */
  allSelectLabel?: string;

  dropdownRef?: React.RefObject<HTMLDivElement>;

  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
}

export interface MultipleSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value)
    );
  }
  return cloneOption;
}

const MultipleSelector = React.forwardRef<
  MultipleSelectorRef,
  MultipleSelectorProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      selected,
      setSelected,
      allSelectLabel,
      dropdownRef,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
      }),
      [selected]
    );

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected?.(newOptions);
        onChange?.(newOptions);
      },
      [selected]
    );

    useEffect(() => {
      const handleClickOutside = (event) => {
        const dropdownContent = dropdownRef?.current;

        if (dropdownContent && !dropdownContent.contains(event.target)) {
          const isButton = event.target.closest(".command-item");

          if (!isButton) {
            setOpen(false);
          }
        }
      };

      document.addEventListener("click", handleClickOutside);

      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [dropdownRef]);

    useEffect(() => {
      if (value) {
        setSelected?.(value);
      }
    }, [value, setSelected]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);

      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    const EmptyItem = () => {
      if (!emptyIndicator) return undefined;

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    };

    const selectables = React.useMemo<GroupOption>(
      () => removePickedOption(options, selected),
      [options, selected]
    );

    return (
      <Command
        {...commandProps}
        onKeyDown={(e) => {
          commandProps?.onKeyDown?.(e);
          e.stopPropagation();
        }}
        className={cn(
          "w-full",
          "overflow-visible bg-transparent",
          commandProps?.className
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        } // When onSearch is provided, we don't want to filter the options. You can still override it.
      >
        <div
          className={cn(
            "groupl  bg-background rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            className
          )}
        >
          <div
            className="flex flex-wrap gap-1 cursor-pointer"
            onClick={() => setOpen(true)}
            id="dropdown"
            ref={dropdownRef}
          >
            {selected && selected.length > 0 ? (
              selected.map((option) => {
                return (
                  <Badge
                    variant={"secondary"}
                    key={option.value}
                    className={cn(
                      "truncate justify-between flex flex-row gap-1",
                      "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                      "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                      badgeClassName
                    )}
                    data-fixed={option.fixed}
                    data-disabled={disabled}
                  >
                    <span className="truncate">{option.label}</span>
                    <button
                      className={cn(
                        "z-10 ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        (disabled || option.fixed) && "hidden"
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(option);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(option)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })
            ) : (
              <Badge
                variant={"secondary"}
                key={"All"}
                className={cn(
                  "truncate justify-between flex flex-row gap-1",
                  "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                  "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                  badgeClassName
                )}
              >
                {allSelectLabel || "All"}
              </Badge>
            )}
          </div>
        </div>
        <div className="relative mt-2">
          {open && (
            <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-background text-popover-foreground shadow-md outline-none animate-in">
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {!selectFirstItem && (
                    <CommandItem value="-" className="hidden" />
                  )}

                  <>
                    <div className="p-1">
                      <CommandItem
                        key="All"
                        value="All"
                        onSelect={() => {
                          setSelected?.([]); // Sorting by "All" eliminates all selected options
                          onChange?.([]);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="command-item cursor-pointer flex-row gap-2"
                      >
                        {selected && selected.length === 0 ? (
                          <Check className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 flex-shrink-0" />
                        )}
                        {allSelectLabel || "All"}
                      </CommandItem>
                    </div>
                    <div className="border-border border-t-[1px]" />
                  </>

                  {Object.entries(options).map(([key, dropdowns]) => (
                    <CommandGroup
                      key={key}
                      heading={key}
                      className="h-full overflow-auto"
                    >
                      <>
                        {dropdowns.map((option) => {
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              disabled={option.disable}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                if (
                                  selected &&
                                  selected.length >= maxSelected
                                ) {
                                  onMaxSelected?.(selected.length);
                                  return;
                                }

                                let newOptions = [...selected, option];
                                if (
                                  selected?.find(
                                    (s) => s.value === option.value
                                  )
                                ) {
                                  newOptions = selected.filter(
                                    (s) => s.value !== option.value
                                  );
                                }
                                setSelected?.(newOptions);
                                onChange?.(newOptions);
                              }}
                              className={cn(
                                "command-item",
                                "cursor-pointer flex-row gap-2",
                                option.disable &&
                                  "cursor-default text-muted-foreground"
                              )}
                            >
                              {selected &&
                              selected.find((s) => s.value === option.value) ? (
                                <Check className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <div className="h-4 w-4 flex-shrink-0" />
                              )}
                              <span className="truncate">{option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </>
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
