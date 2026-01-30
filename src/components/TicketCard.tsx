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
  sectionName?: string;
  price?: number;
}

function getRowLabel(index: number | null) {
  if (index === null) return "-";
  return String.fromCharCode(65 + index);
}

export default function TicketCard({ ticket }: { ticket: TicketProps }) {
  return (
    <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-lg border border-slate-200 md:flex-row">
      {/* LEFT SIDE */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6 relative">
        {/* Event Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            {ticket.eventName}
          </h2>

          <div className="flex flex-col gap-2 text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              {format(ticket.date, "MMM d, yyyy • h:mm a")}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              {ticket.location}
            </div>
            {/* 👇 2. DISPLAY THE NEW DATA HERE */}
            {ticket.sectionName && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-900" />
                <span className="text-slate-900 font-bold">
                  {ticket.sectionName} Section
                  {ticket.price ? ` (₦${ticket.price})` : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <User className="w-4 h-4" /> {ticket.userName}
          </div>

          <div className="flex gap-3">
            <a
              href={`/api/tickets/${ticket.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Download className="w-4 h-4" /> PDF
            </a>
            <CancelTicketButton ticketId={ticket.id} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (STUB) */}
      <div className="bg-slate-900 p-6 md:w-48 flex flex-col items-center justify-center text-white border-l-2 border-dashed border-slate-600 relative">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full md:hidden" />

        <div className="text-center space-y-6">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Row
            </p>
            <p className="text-4xl font-black">{getRowLabel(ticket.row)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Seat
            </p>
            <p className="text-4xl font-black">
              {ticket.col !== null ? ticket.col + 1 : "GA"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
