import type { MetaFunction, LinksFunction, LoaderArgs } from "@vercel/remix";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import styles from "./globals.css";
import {
  ThemeProvider,
  useTheme,
  PreventFlashOnWrongTheme,
} from "remix-themes";
import { themeSessionResolver } from "./session.server";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/evals/api";
import { Toaster } from "./components/ui/toaster";
import AppLayout from "./components/layout";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const { getTheme } = await themeSessionResolver(request);

  return {
    layout: pathname.includes("/chat") ? "none" : "expanded",
    host: request.headers.get("x-forwarded-host"),
    theme: getTheme(),
  };
}

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

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

function App() {
  const data = useLoaderData();
  const [theme] = useTheme();
  console.log("theme", theme);

  return (
    <html lang="en" data-theme={theme ?? ""} className="h-[calc(100dvh)] ">
      <>
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          />

          <Meta />
          <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
          <Links />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-background h-[calc(100dvh)] w-screen m-0 p-0 text-foreground ">
          <TooltipProvider>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </TooltipProvider>
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </>
      <Toaster />
    </html>
  );
}

// Wrap your app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithProviders() {
  const data = useLoaderData();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-screen w-screen m-0 p-0 bg-background text-foreground">
        <div>
          <h1>Oh no!</h1>
          <p>Something went wrong.</p>
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
