import { cn } from "~/lib/utils";
import { defaultSelectedConversation } from "~/lib/evals/types";
import type {
  SetSelectedTopic,
  SetSelectedConversation,
  CategoryStats,
  SelectedTopic,
  TopicsWithColor,
} from "@/lib/evals/types";

interface BarChartProps {
  barData: { value: string; count: number; color: string }[];
}

interface CategoryBarChartProps {
  barData: CategoryStats;
  max: number;
}

interface TopicBarChartProps {
  selectedTopic: SelectedTopic;
  barData: TopicsWithColor[];
  categorySum: number;
  hoveredItem: TopicsWithColor | null;
  setHoveredItem: (item: TopicsWithColor | null) => void;
  handleBarHover: (item: TopicsWithColor, e: any) => void;
  handleBarLeave: () => void;
  tooltipPosition: { left: number; top: number };
  setSelectedConversation: SetSelectedConversation;
  setSelectedTopic: SetSelectedTopic;
}

export const AnswerRateBarChart: React.FC<BarChartProps> = ({ barData }) => {
  const total = barData.reduce((acc, item) => acc + item.count, 0);

  return barData.length > 0 ? (
    <div className="h-16 w-full flex flex-row rounded-md overflow-hidden">
      {barData.map((item, index) => (
        <div
          key={index}
          className={cn(
            "transition-width duration-200 ease-in",
            `${item.color}`,
            index === 0 ? "rounded-l-sm" : "",
            index === barData.length - 1 ? "rounded-r-sm" : ""
          )}
          style={{
            width: `${(item.count / total) * 100}%`,
            backgroundColor: item.color,
          }}
        />
      ))}
    </div>
  ) : (
    <div className="h-16 w-full flex flex-row rounded-md overflow-hidden">
      <div className="bg-foreground transition-width duration-200 ease-in rounded-sm w-full" />
    </div>
  );
};

export const CategoryRateBarChart: React.FC<CategoryBarChartProps> = ({
  barData,
  max,
}) => {
  const remainder = max - barData.totalSum;

  const answerRateArray = [
    {
      value: "answered",
      count: barData.numAnswered,
      color: "bg-answered",
    },
    {
      value: "notAnswered",
      count: barData.numNotAnswered,
      color: "bg-not-answered",
    },
    {
      value: "notAllowed",
      count: barData.numNotAllowed,
      color: "bg-not-allowed",
    },
  ];

  const filteredAnswerRate = answerRateArray.filter((item) => item.count > 0);

  return (
    <div className="h-8 w-full flex flex-row rounded-md overflow-hidden border border-border">
      {filteredAnswerRate.map((item, index) => (
        <div
          key={index}
          className={cn(
            "transition-width duration-200 ease-in",
            `${item.color}`,
            index === 0 ? "rounded-l-sm" : "",
            index === filteredAnswerRate.length - 1 && remainder < 1
              ? "rounded-r-sm"
              : ""
          )}
          style={{
            width: `${(item.count / max) * 100}%`,
            backgroundColor: item.color,
          }}
        />
      ))}
      {remainder > 0 && (
        <div
          className="transition-width duration-200 ease-in bg-background rounded-r-sm"
          style={{
            width: `${(remainder / max) * 100}%`,
          }}
        />
      )}
    </div>
  );
};

export const TopicBarChart: React.FC<TopicBarChartProps> = ({
  selectedTopic,
  barData,
  categorySum,
  hoveredItem,
  setHoveredItem,
  handleBarHover,
  handleBarLeave,
  tooltipPosition,
  setSelectedConversation,
  setSelectedTopic,
}) => {
  const tooltipWidth = 140;

  const data = Object.entries(barData).map(([key, value]) => {
    return {
      key,
      ...value,
    };
  });

  return (
    <>
      {hoveredItem && (
        <div
          className="absolute bg-muted border border-border z-20 py-2 px-3.5 rounded overflow-hidden"
          style={{
            left: tooltipPosition.left,
            top: tooltipPosition.top,
            width: tooltipWidth,
          }}
        >
          <p className="truncate">{hoveredItem.topicName}:</p>
          <div className="flex flex-row gap-1">
            <p>{hoveredItem.totalSum}</p>
            <p className="truncate">messages</p>
          </div>
        </div>
      )}
      <div className="w-full flex flex-row overflow-hidden relative items-center">
        {data.map((item, index) => (
          <div
            key={index}
            id={`${item.categoryId}:${item.topicId}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedConversation(defaultSelectedConversation);
              setSelectedTopic({
                topicId: item.topicId,
                topicName: item.topicName,
                assistantIds: item.assistantIds,
                categoryName: item.categoryName,
                categoryId: item.categoryId,
              });
            }}
            onMouseEnter={(e) => handleBarHover(item, e)}
            onMouseLeave={handleBarLeave}
            style={{
              width: `${(item.totalSum / categorySum) * 100}%`,
              backgroundColor: item.color,
              opacity:
                (hoveredItem &&
                  hoveredItem.categoryId === item.categoryId &&
                  hoveredItem.topicId === item.topicId) ||
                (item.topicId === selectedTopic.topicId &&
                  item.categoryName === selectedTopic.categoryName)
                  ? 1.0
                  : 0.3,
            }}
            className={cn(
              "h-4 box-content transition-width duration-100 ease-in border-y border-y-border",
              index === 0 ? "rounded-l-md border-l-border" : "",
              index === barData.length - 1
                ? "rounded-r-md border-r-border"
                : "",
              item.topicId === selectedTopic.topicId &&
                item.categoryName === selectedTopic.categoryName &&
                "border-y-2 border-x-2 border-y-input border-x-input"
            )}
          ></div>
        ))}
      </div>
    </>
  );
};
