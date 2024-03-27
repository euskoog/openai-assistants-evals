import type { CategoryStats, SelectedTopic } from "~/lib/evals/types";
import { CategoryRow } from "./CategoryRow";

interface CategoryTopicsSectionProps {
  sortedCategoriesMap: Record<string, CategoryStats>;
  maxCategorySum: number;
  selectedTopic: SelectedTopic;
  setSelectedTopic: any;
  setSelectedConversation: any;
}

export const CategoryTopicsSection = (props: CategoryTopicsSectionProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {!props.selectedTopic.topicId && (
        <div className="text-muted-foreground bg-muted flex justify-center items-center text-center p-6 h-full">
          <p>Expand a category and click a topic to see conversations</p>
        </div>
      )}
      <div
        id="tableWrapper"
        className="flex flex-col items-start rounded-md border border-border"
      >
        <div
          id="tableHeader"
          className="flex items-center md:items-start self-stretch"
        >
          <div className="px-4 py-2 min-w-[100px] md:min-w-[256px] items-center justify-start md:justify-end">
            <p className="text-md text-muted-foreground md:text-right">
              Category
            </p>
          </div>
          <div className="px-4 py-2 w-full" />
          <div className="px-4 py-2 min-w-[70px] md:min-w-[132px] items-center justify-end">
            <p className="text-md text-muted-foreground text-right">
              Msg. Count
            </p>
          </div>
          <div className="hidden md:flex px-2 md:px-4 py-2 min-w-[132px] items-center justify-end">
            <p className="text-md text-muted-foreground text-right">
              Answer Rate
            </p>
          </div>
        </div>
        {Object.entries(props.sortedCategoriesMap).map(
          (category, index) =>
            category[1].totalSum > 0 && (
              <CategoryRow
                key={index}
                maxCount={props.maxCategorySum}
                selected={props.selectedTopic}
                setSelected={props.setSelectedTopic}
                setConversation={props.setSelectedConversation}
                formattedCategory={category}
              />
            )
        )}
      </div>
    </div>
  );
};
