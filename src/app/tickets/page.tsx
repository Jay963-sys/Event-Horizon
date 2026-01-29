import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TicketCard from "@/components/TicketCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MyTicketsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const tickets = await prisma.ticket.findMany({
    where: { userId },
    include: { event: true },
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
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Book more seats
          </Link>
        </div>

        {/* Empty State */}
        {tickets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500 mb-4">
              You haven't booked any tickets yet.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
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
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
