import { HelpCircle } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

export const AnswerRateTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div>
            <HelpCircle className="h-4 w-4 stroke-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          sideOffset={4}
          className="bg-popover p-2 flex flex-col gap-2 items-center text-popover-foreground"
        >
          <div className="flex flex-row gap-2 items-center justify-center">
            <p>Answer Rate =</p>
            <div className="flex flex-col gap-1 justify-center items-center">
              <p>Answered</p>
              <div className="w-[200px] border-b border-popover-foreground" />
              <p>Answered + Not Answered</p>
            </div>
            <p>x 100</p>
          </div>
          <div className="w-full flex justify-end">
            <p className="text-xs">*Not Allowed is excluded</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
