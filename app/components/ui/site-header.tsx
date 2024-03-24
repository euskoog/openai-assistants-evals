import { Theme, useTheme } from "remix-themes";
import {
  BarChart,
  BarChartHorizontal,
  BarChartHorizontalBig,
  Github,
  Layers,
  Moon,
  Sun,
  TrendingUp,
} from "lucide-react";
import { NavLink, Link, useMatches } from "@remix-run/react";
import { GlobalLoadingIndicator } from "../GlobalLoadingIndicator";
import { cn } from "@/lib/utils";

export function SiteHeader({ size }: { size: "expanded" | "compact" }) {
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
      <div
        className={cn(
          "container flex h-14 items-center justify-between",
          size === "compact" ? "max-w-[1000px]" : "max-w-[2000px]"
        )}
      >
        <div className="flex flex-row gap-10 text-primary">
          <NavLink
            className="hidden md:flex flex-row gap-2 items-center"
            to="/"
          >
            <Layers className="w-5 h-5 shrink-0 stroke-[1.5px]" />
            <h1 className="text-md font-semibold">OpenAI Assistant Evals</h1>
          </NavLink>
          <div className="flex flex-row gap-6">
            <NavLink
              to="/"
              className={cn(
                "hover:text-muted-foreground text-input text-sm flex items-center gap-2",
                isAtRoot("/_index") && "text-foreground hover:text-foreground"
              )}
            >
              Home
            </NavLink>
            <NavLink
              to="/evals"
              className={cn(
                "hover:text-muted-foreground text-input text-sm flex items-center gap-2",
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
                "hover:text-muted-foreground text-input text-sm flex items-center gap-2"
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
