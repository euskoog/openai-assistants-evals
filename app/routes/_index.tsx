import type { MetaFunction } from "@vercel/remix";
import { NavLink } from "@remix-run/react";

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
    <div className="flex flex-col gap-6 md:px-16 pb-8 md:pb-16">
      <h1 className="py-24 text-4xl font-bold text-center">
        Creating a Testing and Evaluation Suite for OpenAI Assistants.
      </h1>
      <div className="text-lg">
        <p className="md:px-4">
          At the time of writing this, OpenAI does not provide a way to evaluate
          the performance of their models. And to be honest, that makes sense,
          as the models are trained on a wide range of data and it would be hard
          to create a one-size-fits-all evaluation suite. In addition to that,
          OpenAI's newest API feature,
          <a>
            <a
              href="https://platform.openai.com/docs/assistants"
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              OpenAI Assistants
            </a>
          </a>
          , allows users to use specific models in a scalable format with custom
          instructions per assistant.
          <br />
          <br />
          The introduction of these assistants has made it easier for people to
          create and deploy their own custom implementations of these models,
          but it has also made it harder to scale performance evaluation on
          individual instances.
          <br />
          <br />
          Let's break down how we can approach this problem:
          <ul className="list-disc pl-8 text-primary">
            <br />
            <li>
              <p className="text-foreground">
                <strong>Criteria:</strong> What should I evaluate my assistants
                against?
              </p>
            </li>
            <br />
            <li>
              <p className="text-foreground">
                <strong>Objective:</strong> What is my assistant's end goal?
                What constitues a "successful" response?
              </p>
            </li>
            <br />
            <li>
              <p className="text-foreground">
                <strong>Process:</strong> How should I go about testing?
              </p>
            </li>
            <br />
            <li>
              <p className="text-foreground">
                <strong>Analysis:</strong> What should I look for within my
                data?
              </p>
            </li>
          </ul>
          <br />
          By the end of this guide, you can be well on your way to creating a{" "}
          <NavLink to="/evals" className="text-primary">
            evaluation system like this:
          </NavLink>
          <br />
          <br />
          <img
            src="eval_dashboard.png"
            alt="Evaluation System"
            className="w-full"
          />
          <br />
          All of these steps are subjective when it comes to evaluating your
          system. Feel free to omit or add as you see fit.
        </p>
      </div>
      <div className="text-lg flex flex-col gap-4">
        <h2 className="md:px-4 pt-4 text-4xl font-bold">Criteria</h2>
        <p className="md:px-4">
          Let's talk about what we're looking for. For this implementation,
          we're going to keep things <u>strictly to semantics</u>. I have broken
          down my criteria into the following categories:
          <ul className="list-disc pl-8 text-primary">
            <br />
            <li>
              <p className="text-foreground">
                <strong>Classification:</strong> An enum response (
                <code className="rounded-md bg-muted p-1">"Answered"</code>,{" "}
                <code className="rounded-md bg-muted p-1">"Not Answered"</code>,
                or{" "}
                <code className="rounded-md text-md bg-muted p-1">
                  "Not Allowed"
                </code>
                ) indicating whether or not the assistant provided a relevant
                answer within its instructions.
              </p>
            </li>
            <br />
            <li>
              <p className="text-foreground">
                <strong>Sentiment:</strong> The sentiment of the user query,
                using{" "}
                <a
                  href="https://textblob.readthedocs.io/en/dev/"
                  className="text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TextBlob
                </a>
                .
              </p>
            </li>
            <br />
            <li>
              <p className="text-foreground">
                <strong>Category:</strong> The best fitting category for the
                user query, chosen from an existing list of categories.
                <ul className="list-disc pl-8 text-primary">
                  <li>"What can you help me with?" -{">"} Category: "About"</li>
                </ul>
              </p>
            </li>
            <br />
            <li>
              <p className="text-foreground">
                <strong>Topic:</strong> A more specific topic within the
                category, chosen from an existing list of topics or generated
                from conversational context.
                <ul className="list-disc pl-8 text-primary">
                  <li>
                    "Where do I edit my avatar?" -{">"} Category: "Profile",
                    Topic: "Avatar"
                  </li>
                </ul>
              </p>
            </li>
          </ul>
          <br />
          Looking at all of the criteria at a high level, we can start to see
          how different pieces fit with each other.
          <br />
          <br />
          <span className="font-bold">Classification</span> is an evaluation of
          both the user query and the assistant's response, and delivers a
          concrete metric for filtering on "pure" performance. This piece is
          essential in the evaluation suite.
          <br />
          <br />
          <span className="font-bold">Sentiment</span> is less effective as a
          contextualized metric, but is useful for understanding intensities
          from the spectrum of a user's emotional state. This can be used to
          quickly identify intense frustration or satisfaction.
          <br />
          <br />
          <span className="font-bold">Category</span> and{" "}
          <span className="font-bold">Topic</span> are more about understanding
          the user's intent. The goal here is to refine what users are looking
          for when they interact with assistants. This can be used to identify
          patterns and trends through usage, and can be paired with
          Classification to provide a more detailed analysis.
        </p>
      </div>
      <div className="text-lg flex flex-col gap-4">
        <h2 className="md:px-4 pt-4 text-4xl font-bold">Objective</h2>
        <p className="md:px-4">TODO</p>
      </div>
      <div className="text-lg flex flex-col gap-4">
        <h2 className="md:px-4 pt-4 text-4xl font-bold">Process</h2>
        <p className="md:px-4">TODO</p>
      </div>
      <div className="text-lg flex flex-col gap-4">
        <h2 className="md:px-4 pt-4 text-4xl font-bold">Analysis</h2>
        <p className="md:px-4">TODO</p>
      </div>
    </div>
  );
}
