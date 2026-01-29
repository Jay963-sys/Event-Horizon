"use client";

import { useState, useTransition } from "react";
import { cancelTicket } from "@/app/actions/cancelTicket";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CancelTicketButton({ ticketId }: { ticketId: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = async () => {
    startTransition(async () => {
      try {
        await cancelTicket(ticketId);
        router.refresh(); // Ensure the UI updates immediately
      } catch (error) {
        alert("Failed to cancel ticket");
      }
    });
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 mt-4 bg-red-50 p-2 rounded-lg border border-red-100">
        <span className="text-xs font-medium text-red-800">Are you sure?</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsConfirming(false)}
            className="px-2 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded"
            disabled={isPending}
          >
            No
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded flex items-center gap-1"
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            Yes
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      Cancel Ticket
    </button>
  );
}
