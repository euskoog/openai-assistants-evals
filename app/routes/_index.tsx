import { NavLink } from "@remix-run/react";
import type { MetaFunction } from "@vercel/remix";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  categorize,
  getClassification,
  getTopic,
} from "~/components/codeSnippets";
import { oneDark } from "~/components/codeStyles";
import { BlogCard } from "~/components/ui/blogCard";

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
        <p className="md:px-4">
          Let's focus in on Classification for a second. How do we come to a
          conclusion on what is "Answered", "Not Answered", or "Not Allowed"?
          <br />
          <br />
          Obviously this answer is going to vary depending on the assistant's
          instructions, but we can create a general guideline for what we're
          looking for. Currently I use the following template for my assistants:
        </p>
        <SyntaxHighlighter
          className="text-sm"
          language="python"
          style={oneDark}
        >
          {getClassification}
        </SyntaxHighlighter>
        <p className="md:px-4">
          Notice the subtle differences between the three classification
          options. Each option is concise and lightweight, providing a clear
          path for the evaluator to follow. With just these simple options we
          unlock the ability to quickly evaluate performance per assistant.
          <br />
        </p>
        <BlogCard
          content="If you are evaluating multiple assistants in an 
        enterprise setting, it might be wise to add more domain knowledge 
        and strict boundaries to this process."
        />
        <p className="md:px-4">
          Let's add context for the Categorization and Topic selection process
          as well.
          <br />
          <br />
          The Category and Topic processes are built around a similar structure
          to Classification, but they also can reference previous messages from
          the conversation. This helps for situations when a user asks questions
          like:
          <br />
          <br />
          1. "What's the weather like in Tampa Bay?"
          <br />
          2. "How about in New York?"
          <br />
          <br />
          Without context from the previous message, the assistant might
          categorize the messages as:
          <br />
          <br />
          <span className="text-primary">1. "Weather"</span>
          <br />
          <span className="text-accent">2. "Location"</span>
          <br />
          <br />
          But with context, the assistant can understand that the user is asking
          for the weather in two different locations, returning:
          <br />
          <br />
          <span className="text-primary">1. "Weather"</span>
          <br />
          <span className="text-primary">2. "Location"</span>
          <br />
          <br />
          Let's see these prompts in action!
        </p>
        <h2 className="md:px-4 pt-4 text-3xl font-bold">Categorize:</h2>
        <p className="md:px-4">
          When selecting a category, we pick from a list of predetermined
          categories. I use these defaults for all of my assistant
          categorization:
          <ul className="list-disc pl-8 text-primary">
            <br />
            <li>
              <p className="text-foreground">
                <strong>About:</strong> Used when the user is asking about the
                assistant's capabilities/features or the assistant's domain.
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Communication:</strong> Used when the user is asking to
                communicate with a human or something other than the assistant.
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Feedback:</strong> Used when the user is providing
                feedback about the assistant or a result.
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Help:</strong> Used when the user is asking for help
                using the assistant or its capabilities/features. Also useful
                for when a user is trying to troubleshoot.
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Resources:</strong> Used when the user is asking for a
                resource or link.
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Salutations:</strong>Used when the user is greeting the
                assistant or saying goodbye.
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Settings:</strong>Used when the user is asking to change
                a setting or preference.
              </p>
            </li>

            <li>
              <p className="text-foreground">
                <strong>Other:</strong>Used when the user's query does not fit
                into any of the above categories.
              </p>
            </li>
            <br />
          </ul>
        </p>
        <SyntaxHighlighter
          className="text-sm"
          language="python"
          style={oneDark}
        >
          {categorize}
        </SyntaxHighlighter>
        <h2 className="md:px-4 pt-4 text-3xl font-bold">Topic Assignment:</h2>
        <p className="md:px-4">
          First, let's clear something up. For each category that we have stored
          in the database, we also have a list of topics that are relevant to
          that category. These topics are appended to if a new topic is
          generated from a query.
          <br />
          <br />
          We keep each topic as concise as possible and we store them as a{" "}
          <code className="rounded-md bg-muted p-1">CategoryTopic</code>, so
          that we can easily reference them in the future.
          <br />
          <br />
          Let's take a look at the Topic Assignment prompt:
        </p>
        <SyntaxHighlighter
          className="text-sm"
          language="python"
          style={oneDark}
        >
          {getTopic}
        </SyntaxHighlighter>
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
