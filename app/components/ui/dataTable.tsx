import * as React from "react";

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdownMenu";
import { ChevronDown } from "lucide-react";
import { Form } from "@remix-run/react";
import { cn } from "~/lib/utils";

export enum SelectActionType {
  AddExistingDatasources = "ADD_EXISTING_DATASOURCES",
  RemoveDatasources = "REMOVE_DATASOURCES",
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  selectFunctionality?: SelectActionType;
  assistantId?: string;
  noResultsMessage?: string;
  tableRowOnClick?: (row: TData) => void;
  usePadding?: boolean;
  searchItem?: string;
}

function AddExistingDatasources({
  assistantId,
  selectedItems,
  totalItems,
}: {
  assistantId: string;
  selectedItems: any[];
  totalItems: number;
}) {
  const datasourceIds = selectedItems.map((item) => item.original.id);

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      action={`/assistants/${assistantId}/datasources/add-existing`}
    >
      <input hidden name="assistantId" value={assistantId} />
      <input hidden name="datasourceIds" value={datasourceIds} />

      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedItems.length} of {totalItems} item(s) selected.
        </div>
        <div>
          <Button type="submit" disabled={selectedItems.length === 0}>
            Add Selected Data Sources
          </Button>
        </div>
      </div>
    </Form>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  selectFunctionality,
  assistantId,
  noResultsMessage,
  tableRowOnClick,
  usePadding,
  searchItem,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    setGlobalFilter(searchValue);
    if (searchItem) {
      table.getColumn(searchItem)?.setFilterValue(searchValue);
    } else {
      // If searchItem is not provided, apply search to all columns
      table.setGlobalFilter(searchValue);
    }
  };

  return (
    <div>
      <div className={cn("flex items-center gap-4 py-4", usePadding && "px-4")}>
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={handleInputChange}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {typeof column.columnDef.header !== "function"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={cn("rounded-md border-b", !usePadding && "border")}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (tableRowOnClick) {
                      tableRowOnClick(row.original);
                    }
                  }}
                  className={
                    tableRowOnClick ? "cursor-pointer" : "cursor-default"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {noResultsMessage || "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div
        className={cn(
          "flex items-center justify-end space-x-2 py-4",
          usePadding && "px-4"
        )}
      >
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {
        !selectFunctionality ? (
          <></>
        ) : selectFunctionality === SelectActionType.AddExistingDatasources ? (
          <AddExistingDatasources
            assistantId={assistantId || ""}
            selectedItems={table.getFilteredSelectedRowModel().rows}
            totalItems={table.getFilteredRowModel().rows.length}
          />
        ) : (
          <></>
        )
        // this would be where the other options would go
      }
    </div>
  );
}
