import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { TicketStatus } from "@prisma/client"; // Ensure this import is correct

interface PaystackMetadata {
  eventId: string;
  sectionId: string;
  seats: { row: number; col: number }[];
  userId: string;
  userName: string;
}

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference: string }>;
}) {
  const { reference } = await searchParams;

  if (!reference) return redirect("/");

  // 1. Verify Transaction
  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const data = await verifyRes.json();

  if (!data.status || data.data.status !== "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <XCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-slate-900">Payment Failed</h1>
        <p className="text-slate-500">We could not verify your payment.</p>
        <Link href="/events" className="text-blue-600 hover:underline">
          Return to Events
        </Link>
      </div>
    );
  }

  const metadata = data.data.metadata as PaystackMetadata;
  const { eventId, sectionId, seats, userId, userName } = metadata;

  // 2. Try to Book Tickets (With Error Reporting)
  let errorMessage = "";

  try {
    await prisma.$transaction(async (tx) => {
      // Double check if tickets already exist for this ref to prevent dupes
      // Note: For MVP we skip strict idempotent check, but we catch unique constraint errors

      await tx.ticket.createMany({
        data: seats.map((seat) => ({
          eventId,
          sectionId,
          userId,
          userEmail: data.data.customer.email,
          userName,
          row: seat.row,
          col: seat.col,
          status: TicketStatus.PAID,
        })),
      });
    });
  } catch (error: any) {
    console.error("Booking Error:", error);
    errorMessage = error.message || "Unknown Database Error";
  }

  // 3. IF ERROR OCCURRED, SHOW IT
  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Payment Verified, but Ticket Creation Failed
        </h1>
        <p className="text-slate-600 max-w-md">
          We received your payment, but our database rejected the ticket
          creation.
        </p>
        <div className="bg-slate-900 text-red-400 p-4 rounded-lg font-mono text-xs text-left w-full max-w-lg overflow-auto">
          {errorMessage}
        </div>
        <p className="text-sm text-slate-500">
          Please take a screenshot of this page and contact support.
        </p>
      </div>
    );
  }

  // 4. SUCCESS
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">
          Payment Successful!
        </h1>
        <p className="text-slate-500">
          Your tickets have been sent to your email.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/tickets"
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
        >
          View My Tickets
        </Link>
        <Link
          href="/events"
          className="px-6 py-3 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all"
        >
          Buy More
        </Link>
      </div>
    </div>
  );
}
