import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight, Calendar, Sparkles, Users, Zap } from "lucide-react";
import EventCard from "@/components/EventCard";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default async function HomePage() {
  const events = await prisma.event.findMany({
    take: 3,
    orderBy: { date: "asc" },
    include: {
      _count: { select: { tickets: true } },
    },
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-amber-50 opacity-60 animate-gradient"></div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Eyebrow with shimmer */}
          <span className="block mb-6 text-xs font-medium tracking-widest uppercase text-slate-400 animate-fade-in">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-violet-500 animate-pulse" />
              Lagos | Accra | London | New York
            </span>
          </span>

          {/* Headline with gradient */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.95] mb-10 animate-slide-up">
            Your Next <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-amber-600 bg-clip-text text-transparent animate-gradient-x">
              Experience
            </span>
          </h1>

          {/* Search Form with focus animation */}
          <div className="max-w-2xl mt-6 animate-slide-up animation-delay-200">
            <form action="/events" className="relative group">
              <input
                name="search"
                type="text"
                placeholder="Search events"
                className="w-full px-6 py-6 text-lg border border-slate-300 bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400 hover:border-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 bg-slate-50 relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/20 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between gap-8 mb-14">
            <div className="animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-light mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Upcoming
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
                {events.length} {events.length === 1 ? "event" : "events"}{" "}
                available
              </p>
            </div>
            <Link
              href="/events"
              className="text-sm font-medium text-slate-900 hover:text-violet-600 transition-colors group flex items-center gap-2 animate-fade-in animation-delay-200"
            >
              View all
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State with animation */
            <div className="py-28 px-6 text-center border border-slate-200 border-dashed bg-white hover:border-violet-300 transition-all duration-300 group animate-fade-in">
              <Calendar className="w-12 h-12 text-slate-300 group-hover:text-violet-400 mx-auto mb-6 transition-colors animate-bounce-slow" />
              <h3 className="text-2xl font-light mb-3">No events yet</h3>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 hover:shadow-lg">
                    Create Event
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/organizer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 hover:shadow-lg"
                >
                  Create Event
                </Link>
              </SignedIn>
            </div>
          )}
        </div>
      </section>

      {/* Organizer Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Animated background accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50 to-transparent opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div className="animate-slide-up">
              <span className="block mb-6 text-xs font-medium tracking-widest uppercase text-slate-400 flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" />
                For Organizers
              </span>
              <h2 className="text-5xl md:text-6xl font-light leading-tight mb-6">
                Host with <br />
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  confidence
                </span>
              </h2>
              <p className="max-w-lg text-xl text-slate-600 mb-10 leading-relaxed">
                Professional tools for managing events, tracking sales, and
                creating memorable experiences.
              </p>

              <div className="flex gap-4">
                {/* "Get Started" Logic */}
                <SignedOut>
                  <SignInButton mode="modal" forceRedirectUrl="/organizer">
                    <button className="inline-block px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm font-medium hover:from-slate-800 hover:to-slate-600 transition-all transform hover:scale-105 active:scale-95 hover:shadow-lg">
                      Get Started
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/organizer"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm font-medium hover:from-slate-800 hover:to-slate-600 transition-all transform hover:scale-105 active:scale-95 hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </SignedIn>

                {/* "Learn More" Logic */}
                <Link
                  href="/organizer"
                  className="inline-block px-8 py-4 border-2 border-slate-900 text-slate-900 text-sm font-medium hover:bg-slate-900 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right stats */}
            <div className="space-y-14">
              <div className="border-l-2 border-violet-500 pl-8 animate-slide-up animation-delay-200 hover:border-violet-600 transition-colors group">
                <p className="text-5xl font-light mb-1 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  100%
                </p>
                <p className="text-base text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-500" />
                  Revenue control
                </p>
              </div>
              <div className="border-l-2 border-amber-400 pl-8 animate-slide-up animation-delay-400 hover:border-amber-500 transition-colors group">
                <p className="text-5xl font-light mb-1 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  ∞
                </p>
                <p className="text-base text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Capacity
                </p>
              </div>
              <div className="border-l-2 border-pink-400 pl-8 animate-slide-up animation-delay-600 hover:border-pink-500 transition-colors group">
                <p className="text-5xl font-light mb-1 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Instant
                </p>
                <p className="text-base text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pink-500" />
                  Ticket generation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
