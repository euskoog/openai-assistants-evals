export interface ChartInputData {
  [assistantId: string]: {
    [date: string]: number;
  };
}

export interface FilteredChartData {
  date: any;
  [assistantId: string]: number;
}

export type TopicStats = {
  topicId: string;
  assistantIds: string[];
  numAnswered: number;
  numNotAnswered: number;
  numNotAllowed: number;
  categoryName: string;
  categoryId: string;
  totalSum: number;
};

export interface TopicsWithColor extends TopicStats {
  color: string;
  topicName: string;
  key?: string;
}

export type CategoryStats = {
  numAnswered: number;
  numNotAnswered: number;
  numNotAllowed: number;
  totalSum: number;
  topics: Record<string, TopicStats>;
};

export type SelectedTopic = {
  topicId: string;
  topicName: string;
  assistantIds: string[];
  categoryName: string;
  categoryId: string;
};

export type AnswerTypeRaw = "answered" | "notAnswered" | "notAllowed";
export type AnswerTypePretty = "Answered" | "Not Answered" | "Not Allowed";

export type SetSelectedTopic = (selectedTopic: SelectedTopic) => void;

export type SelectedConversation = {
  conversationId: string;
  messageId: string;
  classification?: AnswerTypePretty;
  sentiment: string;
  timestamp?: string;
};

export type SetSelectedConversation = (
  selectedConversation: SelectedConversation
) => void;

export type FormattedStats = Record<string, CategoryStats>;

export const defaultSelectedTopic: SelectedTopic = {
  topicId: "",
  topicName: "",
  assistantIds: [],
  categoryName: "",
  categoryId: "",
};

export const defaultSelectedConversation: SelectedConversation = {
  conversationId: "",
  messageId: "",
  classification: "Answered",
  sentiment: "0",
  timestamp: "",
};
