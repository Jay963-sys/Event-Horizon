"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, CreditCard, Ticket, Settings } from "lucide-react";
import { deleteEvent } from "@/app/actions/deleteEvent";
import DeleteEventButton from "@/components/DeleteEventButton";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params;

  const event = await prisma.event.findFirst({
    where: { id, organizerId: userId },
    include: {
      sections: {
        include: {
          _count: { select: { tickets: true } },
        },
      },
    },
  });

  if (!event) return notFound();

  // 2. Calculate Stats in Real-Time
  const totalTicketsSold = event.sections.reduce(
    (acc, section) => acc + section._count.tickets,
    0,
  );

  const totalCapacity = event.sections.reduce(
    (acc, section) => acc + section.capacity,
    0,
  );

  const totalRevenue = event.sections.reduce(
    (acc, section) => acc + section._count.tickets * Number(section.price),
    0,
  );

  const percentSold = Math.round((totalTicketsSold / totalCapacity) * 100) || 0;

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/organizer"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{event.name}</h1>
          <p className="text-slate-500">
            {new Date(event.date).toLocaleDateString()} • {event.location}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/events/${event.id}`}
            target="_blank"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            View Public Page
          </Link>
          <Link
            href={`/organizer/events/${event.id}/edit`}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Edit Event
          </Link>
        </div>
        {/* 👇 NEW: The Safer Delete Button */}
        <DeleteEventButton eventId={event.id} />
      </div>

      {/* 📊 High Level Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">
              Total Revenue
            </h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-green-600 font-medium mt-1">
            +0% from last week
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Tickets Sold</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ticket className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {totalTicketsSold}{" "}
            <span className="text-lg text-slate-400 font-medium">
              / {totalCapacity}
            </span>
          </p>
          <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${percentSold}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Attendees</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {totalTicketsSold}
          </p>
          <p className="text-xs text-slate-500 mt-1">Confirmed Check-ins: 0</p>
        </div>
      </div>

      {/* 🎟️ Section Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Ticket Sales by Section</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-medium">Section Name</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Sold</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {event.sections.map((section) => {
              const sectionSold = section._count.tickets;
              const sectionRevenue = sectionSold * Number(section.price);
              const isSoldOut = sectionSold >= section.capacity;

              return (
                <tr
                  key={section.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {section.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatCurrency(Number(section.price))}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {sectionSold} / {section.capacity}
                  </td>
                  <td className="px-6 py-4">
                    {isSoldOut ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Sold Out
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatCurrency(sectionRevenue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
