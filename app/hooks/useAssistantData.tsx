// hooks/useAssistantData.js
import { useState, useMemo } from "react";
import type { Option } from "~/components/ui/multipleSelect";

export const useAssistantData = (assistants) => {
  const [selectedAssistants, setSelectedAssistants] = useState<Option[]>([]);

  const assistantOptionsSorted = useMemo(() => {
    return assistants
      .map((assistant) => ({
        value: assistant.id,
        label: assistant.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [assistants]);

  return { selectedAssistants, setSelectedAssistants, assistantOptionsSorted };
};
