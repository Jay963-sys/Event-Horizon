import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TicketCard from "@/components/TicketCard";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";

export default async function MyTicketsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const tickets = await prisma.ticket.findMany({
    where: {
      userId,
      status: "PAID",
    },
    include: {
      event: true,
      section: true,
    },
    orderBy: { event: { date: "asc" } },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              My Tickets
            </h1>
            <p className="text-slate-500">
              Access your passes for upcoming events.
            </p>
          </div>
          <Link
            href="/events"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            Book more seats
          </Link>
        </div>

        {/* Empty State */}
        {tickets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No tickets yet
            </h3>
            <p className="text-slate-500 mb-6">
              You haven't booked any tickets yet.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-bold hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Events
            </Link>
          </div>
        )}

        {/* Ticket List */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={{
                id: ticket.id,
                eventName: ticket.event.name,
                date: ticket.event.date,
                location: ticket.event.location,
                row: ticket.row,
                col: ticket.col,
                userName: ticket.userName,
                sectionName: ticket.section.name,
                price: Number(ticket.section.price),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
