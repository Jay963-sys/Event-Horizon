"use server";

import { prisma } from "@/lib/db";
import { TicketStatus } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface BookingRequest {
  row?: number; // Optional (undefined for General Admission)
  col?: number;
}

export async function bookSeats(
  eventId: string,
  sectionId: string,
  requests: BookingRequest[],
) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized");

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get Section Info
      const section = await tx.section.findUnique({
        where: { id: sectionId },
        include: { _count: { select: { tickets: true } } }, // Get current sold count
      });

      if (!section) throw new Error("Section not found");

      // 2. CAPACITY CHECK (Global for Section)
      if (section._count.tickets + requests.length > section.capacity) {
        throw new Error("Not enough tickets available in this section!");
      }

      // 3. SPECIFIC SEAT CHECK (Only for Reserved)
      if (section.isReserved) {
        for (const req of requests) {
          if (req.row === undefined || req.col === undefined) {
            throw new Error("Row/Col required for reserved seating");
          }

          const existing = await tx.ticket.findFirst({
            where: {
              sectionId,
              row: req.row,
              col: req.col,
            },
          });

          if (existing) {
            throw new Error(`Seat ${req.row}-${req.col} is already taken!`);
          }
        }
      }

      // 4. Create the tickets
      await tx.ticket.createMany({
        data: requests.map((req) => ({
          eventId,
          sectionId,
          userId,
          userEmail: user.emailAddresses[0].emailAddress,
          userName: user.firstName + " " + user.lastName,
          row: section.isReserved ? req.row : null,
          col: section.isReserved ? req.col : null,
          status: TicketStatus.PAID,
        })),
      });
    });
  } catch (error: any) {
    console.error("Booking failed:", error);
    throw new Error(error.message || "Booking failed");
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/tickets");
}
