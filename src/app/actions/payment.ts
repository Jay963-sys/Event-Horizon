"use server";

import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
  const seatMetadata =
    seats.length > 0 ? seats : Array(quantity).fill({ row: null, col: null });

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
          seats: seatMetadata,
          userId,
          userName: `${user.firstName} ${user.lastName}`,
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
