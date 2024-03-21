import { useQueries } from "react-query";
import { conversationMessagesQuery } from "~/lib/evals/api";

export const useConversations = (conversationId: string) => {
  // all queries
  const queryFunctions = [
    conversationMessagesQuery({
      conversationId: conversationId,
    }),
  ];

  const analyticsQueries = useQueries(queryFunctions);

  const data: Record<
    string,
    { data: any[]; status: string; loading: boolean }
  > = {};

  if (!conversationId) {
    return {
      data: {
        conversationMessages: { data: [], loading: false, status: "noData" },
      },
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
