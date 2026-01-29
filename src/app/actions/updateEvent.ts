"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Same schema as create, but we relax some constraints for updates if needed
const eventSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  location: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
  // We don't update sections via this action in this simplified version
  // Sections management is complex (adding/removing vs updating).
  // For MVP, we will only update the main event details here.
});

export async function updateEvent(
  eventId: string,
  prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    imageUrl: formData.get("imageUrl"),
  };

  const result = eventSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  try {
    // Check ownership
    const existing = await prisma.event.findFirst({
      where: { id: eventId, organizerId: userId },
    });
    if (!existing) return { error: "Event not found or unauthorized" };

    await prisma.event.update({
      where: { id: eventId },
      data: {
        name: data.name,
        description: data.description || "",
        date: new Date(data.date),
        location: data.location,
        imageUrl: data.imageUrl || null,
      },
    });
  } catch (error) {
    return { error: "Failed to update event." };
  }

  redirect(`/organizer/events/${eventId}`);
  return null;
}
