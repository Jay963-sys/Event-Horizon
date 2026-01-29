import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Ticket } from "lucide-react";
import { format } from "date-fns";

interface EventProps {
  id: string;
  name: string;
  date: Date;
  location: string;
  description: string | null;
  imageUrl: string | null;
}

export default function EventCard({ event }: { event: EventProps }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-blue-200 hover:-translate-y-1">
      {/* 🖼️ IMAGE SECTION */}
      <div className="relative h-48 w-full bg-slate-100">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Ticket className="h-12 w-12" />
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-center shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">
            {format(event.date, "MMM")}
          </p>
          <p className="text-xl font-black text-slate-900">
            {format(event.date, "d")}
          </p>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {event.name}
        </h3>
        <p className="mt-2 text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-slate-600 mt-auto">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{format(event.date, "h:mm a")}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <Link
            href={`/events/${event.id}`}
            className="flex w-full items-center justify-between rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-600"
          >
            Get Tickets <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
