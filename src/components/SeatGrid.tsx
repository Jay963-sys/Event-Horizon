"use client";

import { useState } from "react";
import { initiatePayment } from "@/app/actions/payment";
import { Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";

interface TakenSeat {
  row: number;
  col: number;
}
interface SeatGridProps {
  eventId: string;
  sectionId: string;
  totalRows: number;
  totalCols: number;
  takenSeats: TakenSeat[];
}

export default function SeatGrid({
  eventId,
  sectionId,
  totalRows,
  totalCols,
  takenSeats,
}: SeatGridProps) {
  const [selectedSeats, setSelectedSeats] = useState<
    { row: number; col: number }[]
  >([]);
  const [isBooking, setIsBooking] = useState(false);

  const { isSignedIn } = useUser();
  const clerk = useClerk();

  const isTaken = (r: number, c: number) =>
    takenSeats.some((t) => t.row === r && t.col === c);
  const isSelected = (r: number, c: number) =>
    selectedSeats.some((s) => s.row === r && s.col === c);

  const toggleSeat = (r: number, c: number) => {
    if (isTaken(r, c)) return;
    if (isSelected(r, c)) {
      setSelectedSeats((prev) =>
        prev.filter((s) => s.row !== r || s.col !== c),
      );
    } else {
      setSelectedSeats((prev) => [...prev, { row: r, col: c }]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;

    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }

    setIsBooking(true);
    try {
      const url = await initiatePayment(
        eventId,
        sectionId,
        selectedSeats.length,
        selectedSeats,
      );
      if (url) window.location.href = url;
    } catch (error: any) {
      alert(error.message || "Failed to book seats.");
      setIsBooking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-500">
      {/* ... (Keep UI rendering exactly the same) ... */}

      {/* ... Grid ... */}
      <div
        className="grid gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-auto max-w-full"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, minmax(2rem, 1fr))`,
        }}
      >
        {Array.from({ length: totalRows }).map((_, rowIndex) =>
          Array.from({ length: totalCols }).map((_, colIndex) => {
            const taken = isTaken(rowIndex, colIndex);
            const selected = isSelected(rowIndex, colIndex);
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => toggleSeat(rowIndex, colIndex)}
                disabled={taken || isBooking}
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-200 text-xs font-bold relative group",
                  taken
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
                    : selected
                      ? "bg-slate-900 text-white shadow-md scale-105 border border-slate-900"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600",
                )}
              >
                {taken ? (
                  <User className="w-4 h-4" />
                ) : selected ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="opacity-0 group-hover:opacity-100">
                    {colIndex + 1}
                  </span>
                )}
              </button>
            );
          }),
        )}
      </div>

      {/* ... Button ... */}
      {selectedSeats.length > 0 && (
        <button
          onClick={handleBooking}
          disabled={isBooking}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          {isBooking
            ? "Processing..."
            : `Confirm ${selectedSeats.length} Seat(s)`}
        </button>
      )}
    </div>
  );
}
