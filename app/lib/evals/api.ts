import type { DefaultOptions } from "react-query";
import { QueryClient } from "react-query";
import { Api } from "../api";
import type { Body_analytics_get_topic_messages } from "../client";

export const QUERY_STALE_TIME = {
  TEN_MINUTES: 10 * 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TWO_MINUTES: 2 * 60 * 1000,
  INFINITY: Infinity,
  NONE: 0,
};

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    useErrorBoundary: true,
    staleTime: QUERY_STALE_TIME.TWO_MINUTES,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export const topicCountQuery = (
  formData: Array<string>,
  params?: ReturnType<any>
) => {
  return {
    queryKey: ["topicCount", params],
    queryFn: (): Promise<any> =>
      Api.AnalyticsService.getTopicsCount(formData).then((response) => {
        return response.data;
      }),

    staleTime: QUERY_STALE_TIME.TEN_MINUTES,
    enabled: params?.enabled !== undefined ? params.enabled : true,
  };
};

export const topicMessagesQuery = (
  formData: Body_analytics_get_topic_messages,
  params?: ReturnType<any>
) => {
  return {
    queryKey: ["topicMessages", params, formData],
    queryFn: (): Promise<any> =>
      Api.AnalyticsService.getTopicMessages(
        params.topicId,
        params.categoryId,
        formData
      ).then((response) => {
        return response.data;
      }),

    staleTime: QUERY_STALE_TIME.TEN_MINUTES,
    enabled: params?.enabled !== undefined ? params.enabled : true,
  };
};

export const conversationMessagesQuery = (params?: ReturnType<any>) => {
  return {
    queryKey: ["conversationMessages", params],
    queryFn: (): Promise<any> =>
      Api.AnalyticsService.getConversation(params.conversationId).then(
        (response) => {
          return response.data;
        }
      ),

    staleTime: QUERY_STALE_TIME.TEN_MINUTES,
    enabled: params?.enabled !== undefined ? params.enabled : true,
  };
};
