import { useState } from "react";
import { CategoryRateBarChart, TopicBarChart } from "./Charts";
import { cn } from "@/lib/utils";

import { scaleSequential } from "d3-scale";
import { interpolateViridis } from "d3-scale-chromatic";
import type {
  TopicsWithColor,
  CategoryStats,
  SelectedTopic,
  SetSelectedConversation,
  SetSelectedTopic,
} from "@/lib/evals/types";
import { defaultSelectedConversation } from "~/lib/evals/types";

export interface CategoryRowProps {
  formattedCategory: [string, CategoryStats];
  maxCount: number;
  selected: SelectedTopic;
  setConversation: SetSelectedConversation;
  setSelected: SetSelectedTopic;
}

export const CategoryRow = (props: CategoryRowProps) => {
  const categoryName = props.formattedCategory[0] || "Category Name";
  const categoryData = props.formattedCategory[1] || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<TopicsWithColor | null>(null);

  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const tooltipWidth = 140;

  const getOffset = (el: any) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  };

  const handleBarHover = (item: TopicsWithColor, e: any) => {
    setHoveredItem(item);

    const hoveredElement = document.getElementById(
      `${item.categoryId}:${item.topicId}`
    );

    if (hoveredElement) {
      const offset = getOffset(hoveredElement);
      setTooltipPosition({
        left: offset.left + hoveredElement.offsetWidth / 2 - tooltipWidth / 2,
        top: offset.top - 70,
      });
    }
  };

  const handleBarLeave = () => {
    setHoveredItem(null);
  };

  const topics = categoryData.topics || {};
  const numTopics = Object.keys(topics).length;

  const topicsArray = Object.entries(topics).map(([topicName, topicStats]) => ({
    topicName,
    ...topicStats,
  }));
  topicsArray.sort((a, b) => b.totalSum - a.totalSum);

  const colorScale = scaleSequential(interpolateViridis).domain([numTopics, 0]);

  // add a color to each topic
  const topicsWithColor = topicsArray
    .filter((topic) => topic.totalSum > 0)
    .map((topic, index) => {
      return {
        ...topic,
        color: colorScale(index),
      };
    });

  return (
    <div
      id="row"
      onClick={() => {
        setIsExpanded(!isExpanded);
      }}
      className={cn(
        "min-h-16 flex flex-row self-stretch border-t border-border rounded-b-md cursor-pointer transition-all duration-200 ease-in-out ",
        isExpanded ? "bg-muted" : "hover:bg-muted/50 bg-background"
      )}
    >
      <div className="p-4 min-w-[100px] md:min-w-[256px] pt-5 items-center justify-end">
        <p className="truncate text-foreground md:text-right">{categoryName}</p>
      </div>
      <div className="flex flex-col gap-2 p-4 w-full">
        <CategoryRateBarChart barData={categoryData} max={props.maxCount} />
        {isExpanded && (
          <div className="flex flex-col gap-2">
            <div className="py-2">
              <TopicBarChart
                selectedTopic={props.selected}
                barData={topicsWithColor}
                categorySum={categoryData.totalSum}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                handleBarHover={handleBarHover}
                handleBarLeave={handleBarLeave}
                tooltipPosition={tooltipPosition}
                setSelectedConversation={props.setConversation}
                setSelectedTopic={props.setSelected}
              />
            </div>
            <div className="flex gap-4 content-start items-start self-stretch flex-wrap">
              {topicsWithColor.map((topic, index) => (
                <div
                  key={index}
                  onMouseEnter={(e) => {
                    handleBarHover(topic, e);
                  }}
                  onMouseLeave={() => {
                    handleBarLeave();
                  }}
                  className={cn(
                    "py-1 px-1.5 w-[120px] md:w-[148px] flex flex-row gap-1 items-baseline z-10 rounded-sm",
                    props.selected.topicId === topic.topicId &&
                      props.selected.categoryName === topic.categoryName
                      ? "border border-border bg-card"
                      : "hover:bg-card"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.setConversation(defaultSelectedConversation);
                    props.setSelected({
                      topicId: topic.topicId,
                      topicName: topic.topicName,
                      assistantIds: topic.assistantIds,
                      categoryName: topic.categoryName,
                      categoryId: topic.categoryId,
                    });
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 "
                    style={{ backgroundColor: topic.color }}
                  />
                  <p className="line-clamp-2 text-foreground text-sm">
                    {topic.topicName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 min-w-[70px] md:min-w-[132px] pt-5 items-center justify-end">
        <p className="text-foreground text-right truncate">
          {categoryData.totalSum || 0}
        </p>
      </div>
      <div className="hidden md:flex p-4 min-w-[132px] pt-5 justify-end">
        <p className="text-foreground text-right">
          {categoryData.numAnswered + categoryData.numNotAnswered > 0
            ? (
                (categoryData.numAnswered /
                  (categoryData.numAnswered + categoryData.numNotAnswered)) *
                100
              ).toFixed(1)
            : 0}
          %
        </p>
      </div>
    </div>
  );
};
