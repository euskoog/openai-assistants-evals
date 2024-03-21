import { useQueries } from "react-query";
import { topicMessagesQuery } from "~/lib/evals/api";
import { getAdjustedDateRange } from "~/lib/evals/utils";

export const useTopics = (
  assistantIds: string[],
  topicId: string,
  dateRange: {
    startDate: string;
    endDate: string;
  },
  categoryId: string,
  answerTypes: string[]
) => {
  const adjustedDateRange = getAdjustedDateRange(dateRange);

  const answerTypesArray =
    answerTypes.length > 0
      ? answerTypes
      : ["Answered", "Not Answered", "Not Allowed"];

  // all queries
  const queryFunctions = [
    topicMessagesQuery(
      {
        assistant_ids: assistantIds || [],
        answer_types: answerTypesArray,
      },
      {
        topicId: topicId,
        categoryId: categoryId,
        fromDate: adjustedDateRange.startDate,
        toDate: adjustedDateRange.endDate,
      }
    ),
  ];

  const analyticsQueries = useQueries(queryFunctions);

  const data: Record<
    string,
    { data: any[]; status: string; loading: boolean }
  > = {};

  if (!assistantIds || !topicId || !dateRange.startDate || !dateRange.endDate) {
    return {
      data: { topicMessages: { data: [], loading: false, status: "noData" } },
    };
  }

  analyticsQueries.forEach((query, index) => {
    data[queryFunctions[index]["queryKey"][0]] = {
      data: query.data,
      status: query.status,
      loading: query.isLoading,
    };
  });

  return {
    data,
  };
};
