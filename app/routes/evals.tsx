import { useEffect, useRef, useState } from "react";

import type { Option } from "~/components/ui/multipleSelect";
import { Spinner } from "~/components/ui/spinner";
import { TrendsEmpty } from "~/components/ui/trendsEmpty";
import { Api } from "~/lib/api";
import type {
  FormattedStats,
  SelectedConversation,
  SelectedTopic,
} from "~/lib/evals/types";
import {
  defaultSelectedConversation,
  defaultSelectedTopic,
} from "~/lib/evals/types";
import {
  getFilteredAnswerType,
  getFormattedCategories,
  getFormattedTime,
  getMaxCategorySum,
  getSelectedTopicAnswerRate,
  getSortedCategoriesMap,
  getTopicArrayWithSums,
} from "~/lib/evals/utils";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { useConversations } from "~/hooks/useConversation";
import { useTopics } from "~/hooks/useTopics";
import { topicTableColumns } from "~/components/columns";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { useAssistantData } from "~/hooks/useAssistantData";
import { useCategoriesData } from "~/hooks/useCategoriesData";
import { MultipleSelectors } from "~/components/MultipleSelectors";
import { AnswerRateSection } from "~/components/AnswerRateSection";
import { TopicSection } from "~/components/TopicSection";
import { ConversationSheetView } from "~/components/ConversationSheetView";
import { SelectedTopicSection } from "~/components/SelectedTopicSection";
import { CategoryTopicsSection } from "~/components/CategoryTopicsSection";

export const loader = async ({ request }: LoaderArgs) => {
  const assistants = (await Api.AssistantsService.listAssistants()).data || [];
  const assistantIds: string[] = assistants.map((assistant) => assistant.id);

  const categories = (await Api.AnalyticsService.getCategories()).data || [];
  const topics =
    (await Api.AnalyticsService.getTopicsCount(assistantIds)).data || [];

  return {
    assistants: assistants,
    categories: categories,
    topics: topics,
  };
};

export default function Index() {
  const { assistants, categories, topics } = useLoaderData<typeof loader>();

  const { selectedAssistants, setSelectedAssistants, assistantOptionsSorted } =
    useAssistantData(assistants);

  const { selectedCategories, setSelectedCategories, categoryOptionsSorted } =
    useCategoriesData(categories, selectedAssistants);

  const answerOptions: Option[] = [
    { value: "answered", label: "Answered" },
    { value: "notAnswered", label: "Not Answered" },
    { value: "notAllowed", label: "Not Allowed" },
  ];

  const assistantsDropddownRef = useRef<HTMLDivElement>(null);
  const categoriesDropddownRef = useRef<HTMLDivElement>(null);
  const answerTypesDropddownRef = useRef<HTMLDivElement>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAnswerTypes, setSelectedAnswerTypes] = useState<Option[]>([]);
  const [selectedTopic, setSelectedTopic] =
    useState<SelectedTopic>(defaultSelectedTopic);
  const [selectedConversation, setSelectedConversation] =
    useState<SelectedConversation>(defaultSelectedConversation);

  const useTopicsData = useTopics(
    selectedTopic["assistantIds"],
    selectedTopic.topicId,
    selectedTopic.categoryId,
    selectedAnswerTypes.map((answerType) => answerType.label)
  );
  const useConversationsData = useConversations(
    selectedConversation.conversationId
  );

  const topicsData = useTopicsData?.data["topicMessages"];
  const conversationsData = useConversationsData.data["conversationMessages"];

  // Get all Option values from the selected arrays, to be used for filtering
  const selectedAssistantValues = selectedAssistants.map(
    (assistant) => assistant.value
  );
  const selectedCategoryValues = selectedCategories.map(
    (category) => category.value
  );
  const selectedAnswerTypeValues = selectedAnswerTypes.map(
    (answerType) => answerType.value
  );

  // Filter answer type for usage in topics and categories
  const filteredAnswerType = getFilteredAnswerType(
    topics || [],
    selectedAssistantValues,
    selectedCategoryValues,
    selectedAnswerTypeValues
  );

  // add a total sum property which adds all the numAnswered, numNotAnswered, and numNotAllowed into a totalSum property on answerTypeByAssistantCategoryFiltered
  filteredAnswerType.forEach((entry) => {
    entry.totalSum =
      entry.numAnswered + entry.numNotAnswered + entry.numNotAllowed;
  });

  // Format and sort categories
  const formattedCategories: FormattedStats =
    getFormattedCategories(filteredAnswerType);
  const sortedCategoriesMap = getSortedCategoriesMap(formattedCategories);

  // Format and sort topics
  const topicArrayWithSums = getTopicArrayWithSums(filteredAnswerType);

  // Calculate sums for the category bars
  const maxCategorySum = getMaxCategorySum(formattedCategories);

  const selectedTopicAnswerRate = getSelectedTopicAnswerRate(
    topics,
    selectedTopic
  );

  const selectedConversationTimeFormatted = getFormattedTime(
    selectedConversation.timestamp || ""
  );

  const toggleSheet = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  useEffect(() => {
    setSelectedTopic(defaultSelectedTopic);
  }, [selectedAssistants, selectedCategories, selectedAnswerTypes]);

  return (
    <div className="pt-4 bg-background text-foreground min-h-[calc(100%-56px)] w-full flex flex-col gap-4">
      <div className="flex-col">
        <h2 className="text-3xl">Evaluations</h2>
        <p className="text-muted-foreground">
          Explore trending categories based on user interactions with
          assistants. Select a category in the Trends Breakdown to dive into
          specific trending topics and view related conversations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <MultipleSelectors
          label="Assistants"
          options={assistantOptionsSorted}
          selected={selectedAssistants}
          setSelected={setSelectedAssistants}
          dropdownRef={assistantsDropddownRef}
        />
        <MultipleSelectors
          label="Categories"
          options={categoryOptionsSorted}
          selected={selectedCategories}
          setSelected={setSelectedCategories}
          dropdownRef={categoriesDropddownRef}
        />
        <MultipleSelectors
          label="Answer Types"
          options={answerOptions}
          selected={selectedAnswerTypes}
          setSelected={setSelectedAnswerTypes}
          dropdownRef={answerTypesDropddownRef}
        />
      </div>

      {topics.loading ? (
        <Spinner />
      ) : !(topicArrayWithSums.length > 0) ? (
        <div className="bg-muted p-6 md:p-12 flex flex-col gap-2 md:gap-2 items-center justify-center">
          <div className="hidden md:flex">
            <TrendsEmpty />
          </div>
          <h4 className="text-xl">No Data Available</h4>
          <p className="text-sm text-center">
            Adjust the date range or filters. No trends may indicate the
            assistant hasn't been used yet.
          </p>
        </div>
      ) : (
        topicArrayWithSums.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
            <AnswerRateSection filteredAnswerType={filteredAnswerType} />
            <TopicSection topicArrayWithSums={topicArrayWithSums} />
          </div>
        )
      )}
      {topics && topicArrayWithSums.length > 0 && (
        <h2 className="text-2xl">Trends Breakdown</h2>
      )}
      <div className="flex flex-col xl:flex-row pb-8 gap-4 xl:gap-4">
        {topics && topicArrayWithSums.length > 0 && (
          <CategoryTopicsSection
            sortedCategoriesMap={sortedCategoriesMap}
            maxCategorySum={maxCategorySum}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            setSelectedConversation={setSelectedConversation}
          />
        )}
        {topicsData.loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          selectedTopic.topicId && (
            <SelectedTopicSection
              selectedTopic={selectedTopic}
              topicsData={topicsData}
              selectedTopicAnswerRate={selectedTopicAnswerRate}
              topicTableColumns={topicTableColumns}
              setSelectedConversation={setSelectedConversation}
              toggleSheet={toggleSheet}
            />
          )
        )}
      </div>
      <Sheet open={isSheetOpen} onOpenChange={toggleSheet}>
        <SheetContent>
          {conversationsData.loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            selectedConversation.conversationId &&
            selectedConversation.messageId && (
              <ConversationSheetView
                selectedTopic={selectedTopic}
                selectedConversation={selectedConversation}
                selectedTopicAnswerRate={selectedTopicAnswerRate}
                selectedConversationTimeFormatted={
                  selectedConversationTimeFormatted
                }
                topicsData={topicsData}
                conversationsData={conversationsData}
              />
            )
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
