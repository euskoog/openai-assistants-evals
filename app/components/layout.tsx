import { cn } from "~/lib/utils";
import { SiteHeader } from "./ui/site-header";

interface AppLayoutProps {
  size: "expanded" | "compact";
  children: React.ReactNode;
}

export default function AppLayout({ size, children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader size={size} />
      <main
        className={cn(
          "flex-1 container items-center overflow-x-hidden",
          size === "compact" ? "max-w-[1000px]" : "max-w-[2000px]"
        )}
      >
        {children}
      </main>
    </>
  );
}
