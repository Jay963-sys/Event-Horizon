import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import TicketSelection from "@/components/TicketSelection";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sections: true,
      tickets: {
        select: { row: true, col: true, sectionId: true },
      },
    },
  });

  if (!event) return notFound();

  const reservedSection = event.sections.find((s) => s.isReserved);

  const rows = reservedSection?.rows || 10;
  const cols = reservedSection?.cols || 10;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* 🖼️ HERO BANNER */}
      <div className="relative w-full h-64 md:h-96 bg-slate-900 overflow-hidden">
        {event.imageUrl ? (
          <>
            <img
              src={event.imageUrl}
              alt={event.name}
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        {/* Content overlaid on the banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-5xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-blue-600/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-blue-500/20 mb-4">
            {format(event.date, "MMMM d, yyyy")}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
            {event.name}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 text-slate-200 text-sm font-medium">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> {event.location}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />{" "}
              {format(event.date, "h:mm a")} (Doors open 1h early)
            </span>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Select your seats
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Click on the available seats below to proceed with your booking.
            </p>
          </div>

          <div className="overflow-x-auto">
            <TicketSelection
              eventId={event.id}
              sections={event.sections.map((s) => ({
                ...s,
                price: Number(s.price),
              }))}
              tickets={event.tickets}
            />
          </div>
        </div>

        {/* Description Section */}
        {event.description && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              About this Event
            </h3>
            <p className="text-slate-600 leading-relaxed bg-white p-6 rounded-xl border border-slate-200">
              {event.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
