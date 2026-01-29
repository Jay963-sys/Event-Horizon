import { format } from "date-fns";
import { MapPin, Calendar, User, Download } from "lucide-react";
import CancelTicketButton from "@/components/CancelTicketButton";

interface TicketProps {
  id: string;
  eventName: string;
  date: Date;
  location: string;
  row: number | null;
  col: number | null;
  userName: string | null;
}

function getRowLabel(index: number | null) {
  if (index === null) return "-";
  return String.fromCharCode(65 + index);
}

export default function TicketCard({ ticket }: { ticket: TicketProps }) {
  return (
    <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-lg border border-slate-200 md:flex-row">
      {/* ... Left Side Content (Same as before) ... */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6 relative">
        {/* ... (Keep your Header, Date, Location, User info here) ... */}

        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            {ticket.eventName}
          </h2>
          {/* ... etc ... */}
        </div>

        {/* 👇 UPDATED BUTTON: Simple Link to API */}
        <div className="mt-4">
          <a
            href={`/api/tickets/${ticket.id}/pdf`} // Points to our new route
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF Ticket
          </a>
          {/* 👇 NEW: Cancel Button */}
          <div className="sm:ml-auto">
            <CancelTicketButton ticketId={ticket.id} />
          </div>
        </div>
      </div>

      {/* Right Side Stub (Same as before) */}
      <div className="bg-slate-900 p-6 md:w-48 flex flex-col items-center justify-center text-white border-l-2 border-dashed border-slate-600 relative">
        <div className="text-center space-y-4">
          <div>
            <p className="text-xs text-slate-400 uppercase">Row</p>
            <p className="text-3xl font-bold">{getRowLabel(ticket.row)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase">Seat</p>
            <p className="text-3xl font-bold">
              {ticket.col !== null ? ticket.col + 1 : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
