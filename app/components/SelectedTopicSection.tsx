import type { SelectedTopic } from "~/lib/evals/types";
import { DataTable } from "./ui/dataTable";

export const SelectedTopicSection = ({
  selectedTopic,
  topicsData,
  selectedTopicAnswerRate,
  topicTableColumns,
  setSelectedConversation,
  toggleSheet,
}: {
  selectedTopic: SelectedTopic;
  topicsData: any;
  selectedTopicAnswerRate: any;
  topicTableColumns: any;
  setSelectedConversation: any;
  toggleSheet: any;
}) => {
  return (
    <div className="flex h-full w-full flex-col self-stretch border border-border rounded-md">
      <div className="flex flex-row justify-between p-4 align-baseline items-center self-stretch">
        <div>
          <p>{selectedTopic.topicName}</p>
          <p className="text-muted-foreground">
            {topicsData.data ? topicsData.data.length : 0} messages
          </p>
        </div>
        <div className="text-right">
          <p> Answer Rate</p>
          <p className="text-muted-foreground">
            {selectedTopicAnswerRate.toFixed(1)}%
          </p>
        </div>
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
  );
};
