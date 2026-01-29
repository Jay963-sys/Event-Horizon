"use client";

import { useState, useTransition } from "react";
import { deleteEvent } from "@/app/actions/deleteEvent"; // Import your server action
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteEvent(eventId);
    });
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-1 pr-2 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-2 text-xs font-semibold text-red-700 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Are you sure?
        </div>

        <button
          onClick={() => setIsConfirming(false)}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-colors"
          disabled={isPending}
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors flex items-center gap-1"
        >
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          Yes, Delete
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all flex items-center gap-2 group"
    >
      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      Delete Event
    </button>
  );
}
