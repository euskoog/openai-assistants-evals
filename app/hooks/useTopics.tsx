import { useQueries } from "react-query";
import { topicMessagesQuery } from "~/lib/evals/api";

export const useTopics = (
  assistantIds: string[],
  topicId: string,
  categoryId: string,
  answerTypes: string[]
) => {
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
      }
    ),
  ];

  const analyticsQueries = useQueries(queryFunctions);

  const data: Record<
    string,
    { data: any[]; status: string; loading: boolean }
  > = {};

  if (!assistantIds || !topicId) {
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
