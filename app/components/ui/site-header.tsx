import { Theme, useTheme } from "remix-themes";
import { Github, Moon, Sun, TrendingUp } from "lucide-react";
import { NavLink, Link, useMatches } from "@remix-run/react";
import { GlobalLoadingIndicator } from "../GlobalLoadingIndicator";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [theme, setTheme] = useTheme();
  const matches = useMatches();

  const isAtRoot = (id: string) => {
    return matches.some((match) => match.id.includes(id));
  };

  const isCurrentRoute = (route: string) => {
    return matches.some((match) => match.pathname.includes(route));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <GlobalLoadingIndicator />
      <div className="container flex h-14 max-w-[2000px] items-center justify-between">
        <div className="flex flex-row gap-8">
          <NavLink
            className="hidden md:flex flex-row gap-2 items-center"
            to="/"
          >
            <h1 className="text-lg font-bold">OpenAI Assistant Evals</h1>
            <TrendingUp className="w-6 h-6 shrink-0" />
          </NavLink>
          <div className="flex flex-row gap-4">
            <NavLink
              to="/"
              className={cn(
                "hover:text-muted-foreground hover:underline text-input text-sm flex items-center gap-2",
                isAtRoot("/_index") && "text-foreground hover:text-foreground"
              )}
            >
              Home
            </NavLink>
            <NavLink
              to="/evals"
              className={cn(
                "hover:text-muted-foreground hover:underline text-input text-sm flex items-center gap-2",
                isCurrentRoute("/evals") &&
                  "text-foreground hover:text-foreground"
              )}
            >
              Evaluations
            </NavLink>
            <Link
              to="https://github.com/euskoog/openai-assistants-link"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hover:text-muted-foreground hover:underline text-input text-sm flex items-center gap-2"
              )}
            >
              API
            </Link>
          </div>
        </div>
        <div className="flex flex-row gap-0">
          <Link
            to={"https://github.com/euskoog/openai-assistants-evals"}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:bg-muted rounded-md p-2"
          >
            <Github className="h-[1.2rem] w-[1.2rem] shrink-0" />
          </Link>

          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded-md p-2"
            onClick={() =>
              setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
            }
          >
            <span className="relative inline-flex h-[1.2rem] w-[1.2rem]">
              {theme === Theme.DARK ? (
                <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              ) : (
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
