import { useState, useEffect, useMemo } from "react";
import type { Option } from "~/components/ui/multipleSelect";

export const useCategoriesData = (categories, selectedAssistants) => {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

  // Assuming categories can be filtered based on selected assistants.
  // If categories do not depend on assistants, you can remove this filtering logic.
  const filteredCategories = useMemo(() => {
    if (!selectedAssistants.length) {
      return categories;
    }
    return categories.filter((category) =>
      selectedAssistants.includes(category.assistantId)
    );
  }, [categories, selectedAssistants]);

  // Sorting categories alphabetically for display in the dropdown.
  const categoryOptionsSorted = useMemo(() => {
    return filteredCategories
      .map((category) => ({
        value: category.id,
        label: category.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredCategories]);

  // This effect resets the selected categories when the available categories change,
  // such as when changing selected assistants. You might want to handle this differently
  // depending on your application's needs.
  useEffect(() => {
    setSelectedCategories([]);
  }, [filteredCategories]);

  return { selectedCategories, setSelectedCategories, categoryOptionsSorted };
};
