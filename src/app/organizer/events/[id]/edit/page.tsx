import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import EditEventForm from "@/components/EditEventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params;

  // 1. Fetch the event
  const event = await prisma.event.findFirst({
    where: { id, organizerId: userId },
    include: { sections: true },
  });

  if (!event) return notFound();

  // 2. 👇 FIX: Convert Prisma "Decimal" to standard JavaScript "Number"
  const plainEvent = {
    ...event,
    sections: event.sections.map((section) => ({
      ...section,
      price: Number(section.price), // This converts "Decimal(100)" -> 100
    })),
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit Event</h1>
        <p className="text-slate-500">Update details for {event.name}.</p>
      </div>

      {/* 3. Pass the "sanitized" event to the form */}
      <EditEventForm event={plainEvent} />
    </div>
  );
}
