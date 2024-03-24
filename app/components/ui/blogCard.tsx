import { Info } from "lucide-react";

export const BlogCard = ({ content }: { content: string }) => {
  return (
    <div className="bg-muted rounded-lg shadow-lg p-8 flex flex-row gap-4 self-stretch border-primary border-l-[4px]">
      <Info className="h-6 w-6 shrink-0 stroke-primary" />
      <p className="">{content}</p>
    </div>
  );
};
