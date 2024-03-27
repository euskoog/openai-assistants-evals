import { cn } from "~/lib/utils";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { AvatarWrapper, roleAttributes } from "./ui/chatMessage";
import type { SelectedConversation, SelectedTopic } from "~/lib/evals/types";

export const ConversationSheetView = ({
  selectedTopic,
  selectedConversation,
  selectedTopicAnswerRate,
  selectedConversationTimeFormatted,
  topicsData,
  conversationsData,
}: {
  selectedTopic: SelectedTopic;
  selectedConversation: SelectedConversation;
  selectedTopicAnswerRate: any;
  selectedConversationTimeFormatted: string;
  topicsData: any;
  conversationsData: any;
}) => {
  return (
    <div className="flex h-full flex-col self-stretch w-full">
      <div className="flex flex-row justify-between gap-2 p-2 align-baseline items-center self-stretch">
        <div>
          <p>{selectedTopic.topicName}</p>
          <p className="text-muted-foreground">
            {topicsData.data ? topicsData.data.length : 0} messages
          </p>
        </div>
        <div className="text-right">
          <p>Answer Rate</p>
          <p className="text-muted-foreground">
            {selectedTopicAnswerRate.toFixed(1)}%
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4 p-2 w-full ">
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
  );
};
