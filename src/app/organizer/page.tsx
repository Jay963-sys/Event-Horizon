import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

export default async function OrganizerDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const events = await prisma.event.findMany({
    where: { organizerId: userId },
    include: {
      _count: { select: { tickets: true } },
      sections: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Events</h1>
          <p className="text-slate-500 mt-1">
            Manage your listings and track sales.
          </p>
        </div>
        <Link
          href="/organizer/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Plus className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No events yet
          </h3>
          <p className="text-slate-500 max-w-sm mt-2 mb-6">
            You haven't created any events. Launch your first event to start
            selling tickets.
          </p>
          <Link
            href="/organizer/new"
            className="text-blue-600 font-medium hover:underline"
          >
            Create your first event &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/organizer/events/${event.id}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600">
                  {event.name}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(event.date, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Users className="w-4 h-4" />
                  {event._count.tickets} sold
                </span>
                <span className="text-slate-400">
                  {event.sections.length} sections
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
