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
          <ul className="list-decimal pl-8 text-primary">
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
          <img src="dashboard.png" alt="Evaluation System" className="w-full" />
          <br />
          All of these steps are subjective when it comes to evaluating your
          system. Feel free to omit or add as you see fit.
          <br />
          <br />
        </p>
        <BlogCard
          content="All data used in this guide and dashboard is fetched from my 
          OpenAI-Assistants-Link project. ALL DATA IS MY OWN. If you want to use your own data, I 
          would recommend following my guide for setting up the API. See 'API'
          in the header for more information."
        />
      </div>
      <div className="text-lg flex flex-col gap-4">
        <h2 className="md:px-4 pt-4 text-4xl font-bold">1. Criteria</h2>
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
        <h2 className="md:px-4 pt-4 text-4xl font-bold">2. Objective</h2>
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
          <span className="text-primary">2. "Weather"</span>
          <br />
          <br />
          Let's see these prompts in action!
        </p>
        <h2 className="md:px-4 pt-4 text-2xl font-bold">Categorize:</h2>
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
                <strong>Salutations:</strong> Used when the user is greeting the
                assistant or saying goodbye.
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Settings:</strong> Used when the user is asking to
                change a setting or preference.
              </p>
            </li>

            <li>
              <p className="text-foreground">
                <strong>Other:</strong> Used when the user's query does not fit
                into any of the above categories.
              </p>
            </li>
            <br />
          </ul>
        </p>
        <BlogCard
          content="If you want to get the most out of this process, 
        I would recommend having custom categories for each assistant to 
        figure out what works best for your use case- these defaults will
        only tell you so much."
        />
        <SyntaxHighlighter
          className="text-sm"
          language="python"
          style={oneDark}
        >
          {categorize}
        </SyntaxHighlighter>
        <h2 className="md:px-4 pt-4 text-2xl font-bold">Topic Assignment:</h2>
        <p className="md:px-4">
          First, let's clear something up. For each category that we have stored
          in the database, we also have a list of topics that are relevant to
          that category. Every time we run topic assignment, we pull from this
          list of topics to assign a topic to the query. If the generated topic
          is not in the list, we can create a new one and add it to the
          database.
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
        <h2 className="md:px-4 pt-4 text-4xl font-bold">3. Process</h2>
        <p className="md:px-4">
          My testing process is treated as a{" "}
          <a
            href="https://fastapi.tiangolo.com/tutorial/background-tasks/"
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            FastAPI Background Task
          </a>
          , which updates a conversation after a chat message has been fully
          processed. My testing task is broken down into this order:
          <ul className="list-decimal pl-8 text-primary">
            <br />
            <li>
              <p className="text-foreground">
                <strong>Classification:</strong> (assistant instructions, user
                query, assistant response)
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Sentiment:</strong> (user query only)
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Categorization:</strong> (user query, existing
                categories, previous messages)
              </p>
            </li>
            <li>
              <p className="text-foreground">
                <strong>Topic Assignment:</strong> (user query, assigned
                category, previous messages)
              </p>
            </li>
          </ul>
          <br />
          After each step is completed, we update a{" "}
          <code className="rounded-md bg-muted p-1">Message</code> table with
          relevant messages from the conversation, and we add the test results
          as a metadata property. Using a JSON metadata property allows us to
          add and remove different test results as needed.
          <br />
          <br />
          When we go to load the data for the evaluation dashboard, we can
          quickly parse the metadata property and display the results in a
          user-friendly format. Getting the classification from a user query is
          as simple as:{" "}
          <code className="rounded-md bg-muted p-1">
            message.metadata["classification"]
          </code>
          <br />
          <br />
          This is a high-level approach, and there is a lot of opportunity for
          customization. Say for example, you have a robust RAG system for
          retreiving documents for assistant usage and you want to evaluate
          performance based on that. You could add a{" "}
          <code className="rounded-md bg-muted p-1">
            DocumentRetrieval
          </code>{" "}
          class to the process and evaluate the assistant's performance based on
          whatever metrics you see fit. Then, you could add those results to the
          message metadata property.
          <br />
          <br />
          We can even take it a step further! If you have a larger set of
          testing criteria, you could create a separate table for each test
          result, possibly named{" "}
          <code className="rounded-md bg-muted p-1">Evaluation</code>, and link
          it back to the message. This would allow you to have a more granular
          view of the assistant's performance and you wouldn't have to maintain
          an arbitrary metadata object for each message.
          <br />
          <br />
          To be honest, if I had a larger use case or more cases to test, I
          would definitely go with the latter option, as it would make the
          entire process scalable and maintainable. I can only imagine that
          enterprise-level systems would need this level of granularity.
          <br />
          <br />
          If you are looking for more information on what to add to your custom
          evaluation suite, I would recommend checking out these resources:
          <ul className="list-disc pl-8 text-primary">
            <br />
            <li>
              <a
                href="https://www.vellum.ai/blog/how-to-evaluate-your-rag-system"
                className="text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                How to Evaluate Your RAG System
              </a>
            </li>
            <li>
              <a
                href="https://amagastya.medium.com/decoding-llm-performance-a-guide-to-evaluating-llm-applications-e8d7939cafce"
                className="text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Evaluating LLM Applications
              </a>
            </li>
          </ul>
        </p>
      </div>
      <div className="text-lg flex flex-col gap-4">
        <h2 className="md:px-4 pt-4 text-4xl font-bold">4. Analysis</h2>
        <p className="md:px-4">
          Now that we have our data, let's visualize it. We can start off with
          basic views that we can manage for all/some of our assistants.
          <br />
          <br />
          On the evals page, we can see a high-level view of our "Answer Rate"
          and the "Top 10 Trending Topics".
          <br />
          <br />
          <img src="overall.png" alt="Evaluation System" className="w-full" />
          <br />
          <br />
          These views are great for quickly identifying trends and patterns in
          both assistants and categories. For example, if I want to see the
          trending topics in my "OpenAI Weather" assistant for my "Weather"
          category, only when the classification is "Not Answered", I can
          quickly filter the data and see what's going on.
          <br />
          <br />
          Now let's move on to the Trends Breakdown section. This section allows
          us to dive into category-specific data for each assistant. We can see
          how each category is performing and what topics are trending (by
          count) within that category.
          <br />
          <br />
          <img src="trends.png" alt="Evaluation System" className="w-full" />
          <br />
          <br />
          Now that we have stepped into a category, we can view the composition
          of said trending topics. By clicking on a topic in the Trends
          Breakdown section, we can see a table of the messages for that topic,
          specific to all the filters present.
          <br />
          <br />
          <img
            src="topic-messages.png"
            alt="Evaluation System"
            className="w-full"
          />
          <br />
          <br />
          By clicking on a message, we are able to take an even BIGGER step into
          the data, by viewing the conversation where that message originated.
          This allows us to see the context of the message and how it was
          processed by the assistant.
          <br />
          <br />
          <img
            src="conversation.png"
            alt="Evaluation System"
            className="w-full"
          />
          <br />
          <br />
        </p>
        <div className="text-lg flex flex-col gap-4">
          <h2 className="md:px-4 pt-4 text-4xl font-bold">Final Notes</h2>
          <p className="md:px-4">
            Setting up an evaluation suite for your OpenAI assistants can be a
            daunting task, but with the right tools and a clear objective, you
            can create a system that works for you. I have found that the
            process of evaluating my assistants has helped me understand the
            strengths and weaknesses of my instructions and implementations, and
            has given me a clear path for improvement.
            <br />
            <br />
            If you are looking to create a similar evaluation suite, I would
            recommend starting with the basics and building from there. Feel
            free to reference my{" "}
            <a
              href="https://github.com/euskoog/openai-assistants-link"
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Assistants Link API
            </a>{" "}
            to learn how to connect assistants and my{" "}
            <a
              href="https://github.com/euskoog/openai-assistants-evals"
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Assistant Evals Repo
            </a>{" "}
            to learn how to create a dashboard like the one{" "}
            <NavLink className="text-primary" to="/evals">
              here
            </NavLink>
            .
            <br />
            <br />
            Thanks!
          </p>
        </div>
      </div>
    </div>
  );
}
