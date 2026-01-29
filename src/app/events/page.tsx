import { prisma } from "@/lib/prisma";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Upcoming Events
          </h1>
          <p className="mt-2 text-slate-500">
            Select an event to reserve your seat.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            No upcoming events found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
