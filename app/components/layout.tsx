import { SiteHeader } from "./ui/site-header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 max-w-[2000px] container items-center overflow-x-hidden">
        {children}
      </main>
    </>
  );
}
