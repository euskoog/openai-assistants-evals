import { endOfDay, format, startOfDay } from "date-fns";
import type { CategoryStats, FormattedStats, SelectedTopic } from "./types";

export const getFormattedCategories = (
  filteredAnswerType: any
): FormattedStats => {
  const formattedCategories: FormattedStats = {};

  filteredAnswerType.forEach((item) => {
    const {
      categoryName,
      categoryId,
      numAnswered,
      numNotAnswered,
      numNotAllowed,
      topicId,
      topicName,
      assistantId,
    } = item;

    // For categories
    if (!formattedCategories[categoryName]) {
      formattedCategories[categoryName] = {
        numAnswered: 0,
        numNotAnswered: 0,
        numNotAllowed: 0,
        totalSum: 0,
        topics: {},
      };
    }

    formattedCategories[categoryName].numAnswered += numAnswered;
    formattedCategories[categoryName].numNotAnswered += numNotAnswered;
    formattedCategories[categoryName].numNotAllowed += numNotAllowed;

    // For topics
    if (!formattedCategories[categoryName].topics[topicName]) {
      formattedCategories[categoryName].topics[topicName] = {
        topicId,
        categoryName,
        categoryId,
        assistantIds: [],
        numAnswered: 0,
        numNotAnswered: 0,
        numNotAllowed: 0,
        totalSum: 0,
      };
    }

    formattedCategories[categoryName].topics[topicName].numAnswered +=
      numAnswered;
    formattedCategories[categoryName].topics[topicName].numNotAnswered +=
      numNotAnswered;
    formattedCategories[categoryName].topics[topicName].numNotAllowed +=
      numNotAllowed;

    // Calculate total sum for categories and topics
    const totalSum = numAnswered + numNotAnswered + numNotAllowed;
    formattedCategories[categoryName].totalSum += totalSum;
    formattedCategories[categoryName].topics[topicName].totalSum += totalSum;

    if (
      formattedCategories[categoryName].topics[topicName].assistantIds.indexOf(
        assistantId
      ) === -1
    ) {
      formattedCategories[categoryName].topics[topicName].assistantIds.push(
        assistantId
      );
    }
  });

  return formattedCategories;
};

export const getSortedCategoriesMap = (
  formattedCategories: FormattedStats
): Record<string, CategoryStats> => {
  // Convert formattedCategories map to an array of key-value pairs and sort it by totalSum property
  const sortedCategoriesArray = Object.entries(formattedCategories).sort(
    ([, categoryA], [, categoryB]) => {
      const totalSumA = categoryA.totalSum;
      const totalSumB = categoryB.totalSum;
      return totalSumB - totalSumA; // Sort in descending order
    }
  );

  // Construct a new map from the sorted array
  const sortedCategoriesMap: Record<string, CategoryStats> = {};
  sortedCategoriesArray.forEach(([categoryName, categoryStats]) => {
    sortedCategoriesMap[categoryName] = categoryStats;
  });

  return sortedCategoriesMap;
};

export const getMaxCategorySum = (
  formattedCategories: Record<string, CategoryStats>
) => {
  let maxCategorySum = 0;
  Object.entries(formattedCategories).forEach(([, categoryStats]) => {
    maxCategorySum = Math.max(maxCategorySum, categoryStats.totalSum);
  });
  return maxCategorySum;
};

export const getTopicArrayWithSums = (filteredAnswerType: any) => {
  // create topic array sorted by totalSum
  const topicArray = filteredAnswerType
    .sort((a, b) => b.totalSum - a.totalSum)
    .map((entry) => ({
      topicName: entry.topicName,
      count: entry.totalSum,
    }));

  // add sums of topics with the same name
  const topicArrayWithSums = topicArray.reduce((acc, entry) => {
    const existingEntry = acc.find(
      (item) => item.topicName === entry.topicName
    );
    if (existingEntry) {
      existingEntry.count += entry.count;
    } else {
      if (entry.count > 0) acc.push(entry);
    }
    return acc;
  }, []);

  return topicArrayWithSums;
};

export const getFilteredAnswerType = (
  topicCount: any,
  selectedAssistantValues: string[],
  selectedCategoryValues: string[],
  selectedAnswerTypeValues: string[]
) => {
  const filterAnswerTypeByAssistantCategory = (originalData) => {
    return originalData.filter(
      (entry) =>
        (selectedAssistantValues.length === 0 ||
          selectedAssistantValues.includes(entry.assistantId)) &&
        (selectedCategoryValues.length === 0 ||
          selectedCategoryValues.includes(entry.categoryId))
    );
  };

  const categoriesByAssistant = filterAnswerTypeByAssistantCategory(
    topicCount || []
  );

  const answerTypeByAssistantCategory = (originalData) => {
    return originalData.map((entry) => ({
      assistantId: entry.assistantId,
      categoryId: entry.categoryId,
      categoryName: entry.categoryName,
      topicId: entry.topicId,
      topicName: entry.topicName,
      numAnswered:
        selectedAnswerTypeValues.length === 0 ||
        selectedAnswerTypeValues.includes("answered")
          ? entry.numAnswered
          : 0,
      numNotAnswered:
        selectedAnswerTypeValues.length === 0 ||
        selectedAnswerTypeValues.includes("notAnswered")
          ? entry.numNotAnswered
          : 0,
      numNotAllowed:
        selectedAnswerTypeValues.length === 0 ||
        selectedAnswerTypeValues.includes("notAllowed")
          ? entry.numNotAllowed
          : 0,
    }));
  };

  const answerTypeByAssistantCategoryFiltered = answerTypeByAssistantCategory(
    categoriesByAssistant
  );

  return answerTypeByAssistantCategoryFiltered;
};

export const getUniqueCategories = (
  selectedAssistantValues: string[],
  categories: any
) => {
  const categoriesBySelectedAssistants = categories.filter(
    (category) =>
      selectedAssistantValues.length === 0 ||
      category.assistantId === null || // default categories are always null
      selectedAssistantValues.includes(category.assistantId)
  );

  const uniqueCategories = new Set();
  const uniqueCategoriesList: {
    id: string;
    name: string;
    assistantId?: string;
  }[] = [];

  categoriesBySelectedAssistants.forEach((obj) => {
    if (!uniqueCategories.has(obj.name)) {
      uniqueCategories.add(obj.name);
      uniqueCategoriesList.push(obj);
    }
  });

  return uniqueCategoriesList;
};

export const formatCount = (count: number) => {
  if (count >= 1000) return (count / 1000).toFixed(1) + "k";
  return count.toString();
};

export const getSelectedTopicAnswerRate = (
  topicCount: any,
  selectedTopic: SelectedTopic
) => {
  const selectedTopicFromTopicCount = topicCount.data?.find(
    (entry) =>
      entry.topicId === selectedTopic.topicId &&
      entry.categoryName === selectedTopic.categoryName
  );

  const selectedTopicAnswerRate =
    selectedTopicFromTopicCount &&
    selectedTopicFromTopicCount.numAnswered +
      selectedTopicFromTopicCount.numNotAnswered >
      0 &&
    (selectedTopicFromTopicCount.numAnswered /
      (selectedTopicFromTopicCount.numAnswered +
        selectedTopicFromTopicCount.numNotAnswered)) *
      100;

  return selectedTopicAnswerRate || 0;
};

export const getFormattedTime = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDateString = `${date.getDate()} ${date.toLocaleDateString(
    "en-US",
    {
      month: "long",
    }
  )} ${date.getFullYear()} ${
    date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()} ${
    date.getHours() > 12 ? "PM" : "AM"
  }`;

  return formattedDateString;
};

export const formattedValue = (inputValue: number, isFloat = false) => {
  if (isFloat) {
    return inputValue
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return inputValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getAdjustedDateRange = (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  let adjustedStartDate = "";
  let adjustedEndDate = "";

  if (dateRange && dateRange.startDate) {
    const startDate = startOfDay(new Date(dateRange.startDate));
    adjustedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS");

    if (dateRange.startDate !== "" && dateRange.endDate === "") {
      adjustedEndDate = adjustedStartDate; // If only start date is provided, set end date to start date
    } else {
      const endDate = endOfDay(new Date(dateRange.endDate));
      adjustedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSS");
    }
  }

  return { startDate: adjustedStartDate, endDate: adjustedEndDate };
};
