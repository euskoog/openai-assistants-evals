import { useEffect, useRef, useState } from "react";

import { addDays, startOfDay, endOfDay } from "date-fns";
import { AnswerRateTooltip } from "~/components/AnswerRateTooltip";
import { CategoryRow } from "~/components/CategoryRow";
import { AnswerRateBarChart } from "~/components/Charts";
import MultipleSelector from "~/components/ui/multipleSelect";
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
  formatCount,
  getFilteredAnswerType,
  getFormattedCategories,
  getFormattedTime,
  getMaxCategorySum,
  getSelectedTopicAnswerRate,
  getSortedCategoriesMap,
  getTopicArrayWithSums,
  getUniqueCategories,
} from "~/lib/evals/utils";
import { cn } from "~/lib/utils";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { DataTable } from "~/components/ui/dataTable";
import { AvatarWrapper, roleAttributes } from "~/components/ui/chatMessage";
import { AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useConversations } from "~/hooks/useConversation";
import { useTopics } from "~/hooks/useTopics";
import { topicTableColumns } from "~/components/columns";
import { Sheet, SheetContent } from "~/components/ui/sheet";

export const loader = async ({ request }: LoaderArgs) => {
  const assistants = (await Api.AssistantsService.listAssistants()).data || [];
  const assistantIds: string[] = assistants.map((assistant) => assistant.id);

  const fromDate: string = "2024-03-13T17:30:26.661426";
  const toDate: string = "2024-03-20T17:30:26.661443";

  const categories = (await Api.AnalyticsService.getCategories()).data || [];
  const topics =
    (await Api.AnalyticsService.getTopicsCount(fromDate, toDate, assistantIds))
      .data || [];

  return {
    assistants: assistants,
    categories: categories,
    topics: topics,
  };
};

export default function Index() {
  const { assistants, categories, topics } = useLoaderData<typeof loader>();

  const assistantsDropddownRef = useRef<HTMLDivElement>(null);
  const categoriesDropddownRef = useRef<HTMLDivElement>(null);
  const answerTypesDropddownRef = useRef<HTMLDivElement>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAssistants, setSelectedAssistants] = useState<Option[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedAnswerTypes, setSelectedAnswerTypes] = useState<Option[]>([]);
  const [selectedTopic, setSelectedTopic] =
    useState<SelectedTopic>(defaultSelectedTopic);
  const [selectedConversation, setSelectedConversation] =
    useState<SelectedConversation>(defaultSelectedConversation);

  const toggleSheet = () => {
    // setSelectedConversation(defaultSelectedConversation);
    setIsSheetOpen(!isSheetOpen);
  };

  const date = {
    from: startOfDay(addDays(new Date(), -14)),
    to: endOfDay(new Date()),
  };

  const useTopicsData = useTopics(
    selectedTopic["assistantIds"],
    selectedTopic.topicId,
    {
      startDate: date?.from?.toISOString() || "",
      endDate: date?.to?.toISOString() || "",
    },
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

  // Sort the select options alphabetically
  const assistantOptions: Option[] = assistants.map((assistant) => {
    return { value: assistant.id, label: assistant.name };
  });
  const uniqueCategoriesList = getUniqueCategories(
    selectedAssistantValues,
    categories
  );

  const categoryOptions: Option[] = uniqueCategoriesList.map((category) => {
    return { value: category.id, label: category.name };
  });
  const categoryOptionsSorted = categoryOptions.sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const assistantOptionsSorted = assistantOptions.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const answerOptions: Option[] = [
    { value: "answered", label: "Answered" },
    { value: "notAnswered", label: "Not Answered" },
    { value: "notAllowed", label: "Not Allowed" },
  ];

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

  useEffect(() => {
    setSelectedTopic(defaultSelectedTopic);
    setSelectedConversation(defaultSelectedConversation);
  }, [selectedAssistants, selectedCategories, selectedAnswerTypes]);

  return (
    <div className="pt-8 bg-background text-foreground min-h-screen w-full flex flex-col gap-4">
      <div className="flex-col">
        <h2 className="text-3xl">Evaluations</h2>
        <p className="text-muted-foreground">
          These are trending categories based on users interactions with an
          assistant(s). Click a category in the Trends Breakdown chart to drill
          down to a trending topic and access conversations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="flex flex-col gap-[6px] w-full md:w-[240px]">
          <label className="text-foreground text-sm">Assistants</label>
          <div>
            <MultipleSelector
              defaultOptions={assistantOptionsSorted}
              className="w-full md:w-[240px]"
              placeholder="Select an Assistant..."
              selected={selectedAssistants}
              setSelected={setSelectedAssistants}
              allSelectLabel="All Assistants"
              dropdownRef={assistantsDropddownRef}
              emptyIndicator={
                <p className="text-center text-md leading-50">
                  No assistants found.
                </p>
              }
              groupBy="group"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[6px] w-full md:w-[240px]">
          <label className="text-foreground text-sm">Categories</label>
          <div>
            <MultipleSelector
              defaultOptions={categoryOptionsSorted}
              options={categoryOptionsSorted}
              className="w-full md:w-[240px]"
              placeholder="Select a category..."
              selected={selectedCategories}
              setSelected={setSelectedCategories}
              allSelectLabel="All Categories"
              dropdownRef={categoriesDropddownRef}
              emptyIndicator={
                <p className="text-center text-md leading-50">
                  No categories found.
                </p>
              }
              groupBy="group"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[6px] w-full md:w-[240px]">
          <label className="text-foreground text-sm">Answer Type</label>
          <div>
            <MultipleSelector
              defaultOptions={answerOptions}
              className="w-full md:w-[240px]"
              placeholder="Select an answer type..."
              selected={selectedAnswerTypes}
              setSelected={setSelectedAnswerTypes}
              allSelectLabel="All Answer Types"
              dropdownRef={answerTypesDropddownRef}
              emptyIndicator={
                <p className="text-center text-md leading-50">
                  No answer types found.
                </p>
              }
              groupBy="group"
            />
          </div>
        </div>
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
            <div className="w-full bg-muted border-[1px] border-border p-4 gap-2 flex flex-col items-left">
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
                    countAnswered > 0
                      ? "flex flex-row gap-1 items-center"
                      : "hidden"
                  )}
                >
                  <div className="w-4 h-5 bg-answered flex-shrink-0" />
                  <p className="text-muted-foreground text-sm">
                    Answered: {formatCount(countAnswered)}
                  </p>
                </div>
                <div
                  className={cn(
                    countNotAnswered > 0
                      ? "flex flex-row gap-1 items-center"
                      : "hidden"
                  )}
                >
                  <div className="w-4 h-5 bg-not-answered flex-shrink-0" />
                  <p className="text-muted-foreground text-sm">
                    Not Answered: {formatCount(countNotAnswered)}
                  </p>
                </div>
                <div
                  className={cn(
                    countNotAllowed > 0
                      ? "flex flex-row gap-1 items-center"
                      : "hidden"
                  )}
                >
                  <div className="w-4 h-5 bg-not-allowed flex-shrink-0" />
                  <p className="text-muted-foreground text-sm">
                    Not Allowed: {formatCount(countNotAllowed)}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-muted border-[1px] border-border p-4 gap-2 flex flex-col items-left">
              <p className="text-md text-muted-foreground">
                What are users asking? (Top 10 Topics)
              </p>

              <div className="flex flex-wrap gap-2">
                {topicArrayWithSums.slice(0, 10).map((topic, index) => (
                  <div
                    key={index}
                    className={`border-[1px] rounded-sm border-border px-3 py-1.5 md:px-5 md:py-3 bg-topic-${
                      index + 1
                    } ${index < 5 ? "text-background" : ""} `}
                  >
                    {topic.topicName}
                  </div>
                ))}
              </div>
              <div
                id="topicKeyWrapper"
                className="flex flex-row gap-4 justify-end items-center"
              >
                <p className="text-muted-foreground text-center text-sm">
                  Higher Frequency
                </p>
                <div className="flex flex-row">
                  <div className="w-4 h-5 bg-topic-1 flex-shrink-0" />
                  <div className="w-4 h-5 bg-topic-2 flex-shrink-0 hidden md:flex" />
                  <div className="w-4 h-5 bg-topic-3 flex-shrink-0" />
                  <div className="w-4 h-5 bg-topic-4 flex-shrink-0 hidden md:flex" />
                  <div className="w-4 h-5 bg-topic-5 flex-shrink-0" />
                  <div className="w-4 h-5 bg-topic-6 flex-shrink-0 hidden md:flex" />
                  <div className="w-4 h-5 bg-topic-7 flex-shrink-0" />
                  <div className="w-4 h-5 bg-topic-8 flex-shrink-0 hidden md:flex" />
                  <div className="w-4 h-5 bg-topic-9 flex-shrink-0" />
                  <div className="w-4 h-5 bg-topic-10 flex-shrink-0" />
                </div>
                <p className="text-muted-foreground text-center text-sm">
                  Lower Frequency
                </p>
              </div>
            </div>
          </div>
        )
      )}
      {topics && topicArrayWithSums.length > 0 && (
        <h2 className="text-2xl">Trends Breakdown</h2>
      )}
      <div className="flex pb-8 xl:pb-0 flex-col xl:flex-row gap-0 xl:gap-4">
        {topics && topicArrayWithSums.length > 0 && (
          <div className="flex flex-col pb-16 gap-4 w-full">
            {!selectedTopic.topicId && (
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
              {Object.entries(sortedCategoriesMap).map(
                (category, index) =>
                  category[1].totalSum > 0 && (
                    <CategoryRow
                      key={index}
                      maxCount={maxCategorySum}
                      selected={selectedTopic}
                      setSelected={setSelectedTopic}
                      setConversation={setSelectedConversation}
                      formattedCategory={category}
                    />
                  )
              )}
            </div>
          </div>
        )}
        {topicsData.loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          selectedTopic.topicId && (
            <div className="flex h-full w-full flex-col self-stretch border border-border rounded-md">
              <div className="flex flex-row justify-between p-4 align-baseline items-baseline self-stretch">
                <p className="text-foreground font-semibold text-lg leading-7">
                  {selectedTopic.topicName}:{" "}
                  {topicsData.data ? topicsData.data.length : 0} messages
                </p>
                <p className="text-sm">
                  {" "}
                  Answer Rate: {selectedTopicAnswerRate.toFixed(1)}%
                </p>
              </div>

              <DataTable
                tableRowOnClick={(row: any) => {
                  setSelectedConversation({
                    conversationId: row.conversationId,
                    messageId: row.id,
                    classification: row.classification,
                    sentiment: row.sentiment,
                    timestamp: row.timestamp,
                  });
                  toggleSheet();
                }}
                usePadding
                columns={topicTableColumns}
                data={topicsData.data}
                noResultsMessage={"No messages found."}
              />
            </div>
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
              <div className="flex h-full flex-col self-stretch w-full">
                <div className="flex flex-row justify-between p-4 align-baseline items-baseline self-stretch">
                  <p className="text-foreground font-semibold text-lg leading-7">
                    {selectedTopic.topicName}:{" "}
                    {topicsData.data ? topicsData.data.length : 0} messages
                  </p>
                  <p className="text-sm">
                    {" "}
                    Answer Rate: {selectedTopicAnswerRate.toFixed(1)}%
                  </p>
                </div>
                <div className="flex flex-row items-center gap-4 px-4 py-2 w-full ">
                  <div className="flex flex-row gap-2 items-center overflow-hidden w-full self-stretch">
                    <div className=" flex flex-col items-start justify-center self-stretch">
                      <p className="text-xs">Classification:</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {selectedConversation.classification}
                      </p>
                    </div>
                    <div className=" flex flex-col items-start justify-center self-stretch">
                      <p className="text-xs ">Sentiment:</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {parseFloat(selectedConversation.sentiment) > 0.4
                          ? "Positive"
                          : parseFloat(selectedConversation.sentiment) < -0.4
                          ? "Negative"
                          : "Neutral"}
                      </p>
                    </div>
                    <div className="flex flex-col items-start justify-center self-stretch">
                      <p className="text-xs">Time (UTC):</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {selectedConversationTimeFormatted}
                      </p>
                    </div>
                    <div className="flex flex-col items-start justify-center self-stretch">
                      <p className="text-xs">Assistant:</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {conversationsData.data["assistant"]["name"]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-center max-h-[100dvh] overflow-auto p-1">
                  {conversationsData.data["message"].map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex flex-row gap-4 items-center rounded-sm p-4 w-full text-foreground",
                        message.role === "ASSISTANT" && "bg-card",
                        message.id === selectedConversation.messageId &&
                          "bg-secondary shadow-[0px_0px_15px_0px] shadow-primary border border-primary text-secondary-foreground"
                      )}
                    >
                      <AvatarWrapper variant={message.role}>
                        <AvatarImage
                          src={
                            roleAttributes[
                              message.role.toLowerCase() as "user" | "assistant"
                            ].imgSrc
                          }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </AvatarWrapper>
                      <p className="text-md">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
