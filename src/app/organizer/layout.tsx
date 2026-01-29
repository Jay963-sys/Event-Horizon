import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Plus,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <span className="text-xl font-black text-slate-900 tracking-tight">
            EventHorizon <span className="text-blue-600">Pro</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/organizer"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            <LayoutDashboard className="w-4 h-4" />
            Events
          </Link>
          <Link
            href="/organizer/analytics"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            href="/organizer/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft className="w-3 h-3" /> Back to Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">{children}</main>
    </div>
  );
}
