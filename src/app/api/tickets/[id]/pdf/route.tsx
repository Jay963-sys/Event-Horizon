import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { TicketDocument } from "@/components/TicketPDF";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!ticket) {
    return new NextResponse("Ticket not found", { status: 404 });
  }

  if (ticket.userId !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ticketData = {
    id: ticket.id,
    eventName: ticket.event.name,
    date: ticket.event.date,
    location: ticket.event.location,
    // 👇 FIX: Do NOT default to 0. Pass null if it is null.
    row: ticket.row === null ? null : ticket.row,
    col: ticket.col === null ? null : ticket.col,
    userName: ticket.userName,
  };

  try {
    const pdfBuffer = await renderToBuffer(
      <TicketDocument ticket={ticketData} />,
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${ticket.event.name}-Ticket.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
