import { ArrowUpDown, Ban, Check, XSquare } from "lucide-react";
import { Button } from "./ui/button";
import type { ColumnDef } from "@tanstack/react-table";

export const topicTableColumns: ColumnDef<any, unknown>[] = [
  {
    accessorKey: "classification",
    header: "Answered",
    cell: ({ row }) => {
      return row.original.classification === "Answered" ? (
        <div>
          <Check className="h-4 w-4 stroke-answered" />
        </div>
      ) : row.original.classification === "Not Answered" ? (
        <div>
          <XSquare className="h-4 w-4 stroke-not-answered" />
        </div>
      ) : (
        <div>
          <Ban className="h-4 w-4 stroke-not-allowed" />
        </div>
      );
    },
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
    cell: ({ row }) => {
      const sentimentFloat = parseFloat(row.original.sentiment);
      const sentiment =
        sentimentFloat > 0.4
          ? "Positive"
          : sentimentFloat < -0.4
          ? "Negative"
          : "Neutral";
      return <div className="truncate">{sentiment}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent hover:text-muted-foreground"
        >
          Time (UTC)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.timestamp);

      const formattedDateString = `${date.getDate()} ${date.toLocaleDateString(
        "en-US",
        {
          month: "long",
        }
      )} ${date.getFullYear()} ${
        date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
      }:${
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      } ${date.getHours() > 12 ? "PM" : "AM"}`;

      return <div className="">{formattedDateString}</div>;
    },
  },
  {
    accessorKey: "content",
    header: ({ column }) => {
      return <div className="truncate">Message</div>;
    },
    cell: ({ row }) => {
      return <div className="line-clamp-2">{row.original.content}</div>;
    },
  },
];
