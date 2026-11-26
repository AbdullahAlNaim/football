import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <TopNav />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pt-4 pb-28 sm:px-6 lg:pb-10">
        <SideNav />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
