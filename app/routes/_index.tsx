import type { MetaFunction } from "@vercel/remix";

export const meta: MetaFunction = () => {
  const title = `${"OpenAI Assistant Evals"}`;
  const description = `${"Evaluate your OpenAI assistants and export your results."}`;

  const titleElements = [
    { title: title },
    {
      property: "og:title",
      content: title,
    },
  ];

  const descriptionElements = [
    { description: description },
    {
      property: "og:description",
      content: description,
    },
  ];

  return [...titleElements, ...descriptionElements];
};

export default function Index() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="py-24 text-4xl font-bold text-center">
        Welcome to the OpenAI Assistant Evals dashboard.
      </h1>
    </div>
  );
}
