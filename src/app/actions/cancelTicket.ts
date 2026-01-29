"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function cancelTicket(ticketId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. Verify Ownership
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.userId !== userId) {
    throw new Error("You do not have permission to cancel this ticket.");
  }

  // 2. Delete the ticket
  await prisma.ticket.delete({
    where: { id: ticketId },
  });

  // 3. Refresh the page so the ticket disappears
  revalidatePath("/tickets");
  revalidatePath(`/events/${ticket.eventId}`); // Also update event capacity
}
