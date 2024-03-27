export const TopicSection = ({ topicArrayWithSums }) => {
  return (
    <div className="w-full bg-muted border-[1px] border-border p-4 gap-2 flex flex-col items-left rounded-md">
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
  );
};
