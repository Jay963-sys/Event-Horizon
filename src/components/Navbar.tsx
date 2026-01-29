import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Ticket } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-transparent">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 text-base font-medium tracking-tight text-slate-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-200">
              <Ticket className="h-4 w-4" />
            </div>
            <span>EventHorizon</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-8">
            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
              <Link
                href="/events"
                className="hover:text-slate-900 transition-colors"
              >
                Browse Events
              </Link>
              <Link
                href="/organizer"
                className="hover:text-slate-900 transition-colors"
              >
                Host an Event
              </Link>
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200" />

            {/* Auth */}
            <div className="flex items-center gap-4">
              <SignedIn>
                <Link
                  href="/tickets"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  My Tickets
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    Sign in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="hidden sm:inline-flex px-6 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
