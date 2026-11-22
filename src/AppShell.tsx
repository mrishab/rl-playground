import { Outlet } from "react-router-dom";
import { SiteHeader } from "./components/site-header";
import { BugReportBubble } from "./components/feedback/BugReportBubble";

export function AppShell() {
  return (
    <div className="flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-hidden bg-background">
      <SiteHeader />
      <main className="flex-1 overflow-y-auto bg-background flex flex-col overscroll-contain pb-16 sm:pb-20">
        <Outlet />
      </main>
      <BugReportBubble />
    </div>
  );
}
