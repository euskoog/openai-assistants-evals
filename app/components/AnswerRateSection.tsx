import { cn } from "~/lib/utils";
import { AnswerRateBarChart } from "./Charts";
import { AnswerRateTooltip } from "./AnswerRateTooltip";
import type { AssistantTopicData } from "~/lib/evals/utils";
import { formatCount } from "~/lib/evals/utils";

export const AnswerRateSection = ({
  filteredAnswerType,
}: {
  filteredAnswerType: AssistantTopicData[];
}) => {
  const countAnswered = filteredAnswerType.reduce(
    (sum, entry) => sum + entry.numAnswered,
    0
  );
  const countNotAnswered = filteredAnswerType.reduce(
    (sum, entry) => sum + entry.numNotAnswered,
    0
  );

  const countNotAllowed = filteredAnswerType.reduce(
    (sum, entry) => sum + entry.numNotAllowed,
    0
  );

  const answerRateChartData = [
    {
      value: "answered",
      count: countAnswered,
      color: "bg-answered",
    },
    {
      value: "notAnswered",
      count: countNotAnswered,
      color: "bg-not-answered",
    },
    {
      value: "notAllowed",
      count: countNotAllowed,
      color: "bg-not-allowed",
    },
  ].filter((entry) => entry.count > 0);

  return (
    <div className="w-full bg-muted border-[1px] border-border p-4 gap-2 flex flex-col items-left rounded-md">
      <div className="flex flex-row gap-2">
        <p className="text-md text-muted-foreground">Answer Rate</p>
        <AnswerRateTooltip />
      </div>
      <h1 className="text-5xl">
        {countAnswered + countNotAnswered > 0
          ? (
              (countAnswered / (countAnswered + countNotAnswered)) *
              100
            ).toFixed(1)
          : 0}
        %
      </h1>
      <AnswerRateBarChart barData={answerRateChartData} />
      <div
        id="answerRateKeyWrapper"
        className="flex flex-row gap-4 justify-end"
      >
        <div
          className={cn(
            countAnswered > 0 ? "flex flex-row gap-1 items-center" : "hidden"
          )}
        >
          <div className="w-4 h-5 bg-answered flex-shrink-0" />
          <p className="text-muted-foreground text-sm">
            Answered: {formatCount(countAnswered)}
          </p>
        </div>
        <div
          className={cn(
            countNotAnswered > 0 ? "flex flex-row gap-1 items-center" : "hidden"
          )}
        >
          <div className="w-4 h-5 bg-not-answered flex-shrink-0" />
          <p className="text-muted-foreground text-sm">
            Not Answered: {formatCount(countNotAnswered)}
          </p>
        </div>
        <div
          className={cn(
            countNotAllowed > 0 ? "flex flex-row gap-1 items-center" : "hidden"
          )}
        >
          <div className="w-4 h-5 bg-not-allowed flex-shrink-0" />
          <p className="text-muted-foreground text-sm">
            Not Allowed: {formatCount(countNotAllowed)}
          </p>
        </div>
      </div>
    </div>
  );
};
