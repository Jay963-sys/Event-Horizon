"use server";

import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { TicketStatus } from "@prisma/client";

export async function initiatePayment(
  eventId: string,
  sectionId: string,
  quantity: number,
  seats: { row: number; col: number }[] = [],
) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized");

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) throw new Error("Section not found");

  const amountInNaira = Number(section.price) * quantity;
  const amountInKobo = amountInNaira * 100;
  const email = user.emailAddresses[0].emailAddress;
  const userName = `${user.firstName} ${user.lastName}`;

  if (amountInKobo === 0) {
    await prisma.ticket.createMany({
      data: (seats.length > 0
        ? seats
        : Array(quantity).fill({ row: null, col: null })
      ).map((seat) => ({
        eventId,
        sectionId,
        userId,
        userEmail: email,
        userName,
        row: seat.row ? Number(seat.row) : null,
        col: seat.col ? Number(seat.col) : null,
        status: TicketStatus.PAID,
      })),
    });

    return "/tickets";
  }

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        metadata: {
          eventId,
          sectionId,
          seats,
          userId,
          userName,
        },
      }),
    },
  );

  const data = await response.json();

  if (!data.status) {
    throw new Error("Payment initialization failed");
  }

  return data.data.authorization_url;
}
