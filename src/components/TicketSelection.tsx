"use client";

import { useState } from "react";
import SeatGrid from "@/components/SeatGrid";
import { Users, Armchair, CheckCircle2 } from "lucide-react";
import { initiatePayment } from "@/app/actions/payment";
import { useUser, useClerk } from "@clerk/nextjs";

interface Section {
  id: string;
  name: string;
  price: number;
  isReserved: boolean;
  capacity: number;
  rows: number | null;
  cols: number | null;
}

interface Ticket {
  row: number | null;
  col: number | null;
  sectionId: string;
}

interface Props {
  eventId: string;
  sections: Section[];
  tickets: Ticket[];
}

export default function TicketSelection({ eventId, sections, tickets }: Props) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  // 👇 Get Auth State
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // Filter tickets for the specific section
  const sectionTickets = tickets
    .filter(
      (t) =>
        t.sectionId === selectedSectionId && t.row !== null && t.col !== null,
    )
    .map((t) => ({ row: t.row!, col: t.col! }));

  const handleGeneralBooking = async () => {
    if (!selectedSectionId) return;

    // 👇 CHECK AUTH: If not signed in, open the login modal
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }

    setIsBooking(true);
    try {
      const url = await initiatePayment(
        eventId,
        selectedSectionId,
        ticketCount,
        [],
      );
      if (url) window.location.href = url;
    } catch (error: any) {
      alert(error.message);
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Section Selector Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setSelectedSectionId(section.id);
              setTicketCount(1);
            }}
            className={`relative flex flex-col items-start p-6 rounded-xl border-2 transition-all ${
              selectedSectionId === section.id
                ? "border-blue-600 bg-blue-50/50 shadow-md"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {/* ... (Keep card content same as before) ... */}
            <div className="p-3 rounded-lg bg-white shadow-sm border border-slate-100 mb-4">
              {section.isReserved ? (
                <Armchair className="w-6 h-6 text-purple-600" />
              ) : (
                <Users className="w-6 h-6 text-green-600" />
              )}
            </div>
            <h3 className="font-bold text-lg text-slate-900">{section.name}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {section.isReserved ? "Reserved" : "General Admission"}
            </p>
            <p className="mt-auto text-xl font-black text-slate-900">
              ₦{section.price.toLocaleString()}
            </p>
          </button>
        ))}
      </div>

      {/* 2. The Booking Area */}
      {selectedSection && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            {selectedSection.isReserved ? (
              /* Reserved Flow */
              <SeatGrid
                eventId={eventId}
                sectionId={selectedSection.id}
                totalRows={selectedSection.rows || 10}
                totalCols={selectedSection.cols || 10}
                takenSeats={sectionTickets}
              />
            ) : (
              /* Open Flow: Quantity Input */
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                {/* ... (Quantity controls same as before) ... */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-12 h-12 rounded-xl border border-slate-200 text-2xl font-bold hover:bg-slate-50"
                  >
                    -
                  </button>
                  <span className="text-3xl font-black w-12 text-center">
                    {ticketCount}
                  </span>
                  <button
                    onClick={() =>
                      setTicketCount(Math.min(10, ticketCount + 1))
                    }
                    className="w-12 h-12 rounded-xl border border-slate-200 text-2xl font-bold hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleGeneralBooking}
                  disabled={isBooking}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 w-full max-w-xs disabled:opacity-50"
                >
                  {isBooking
                    ? "Processing..."
                    : `Pay ₦${(selectedSection.price * ticketCount).toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
