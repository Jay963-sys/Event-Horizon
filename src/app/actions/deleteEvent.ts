"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteEvent(eventId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.organizerId !== userId) {
    throw new Error("You do not have permission to delete this event.");
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  revalidatePath("/organizer");
  redirect("/organizer");
}
