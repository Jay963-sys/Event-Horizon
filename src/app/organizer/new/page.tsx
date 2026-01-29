"use client";

import { useActionState, useState } from "react";
import { createEvent } from "@/app/actions/createEvent";
import { Plus, Trash2, Armchair, Users, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";

interface SectionDraft {
  id: number;
  name: string;
  price: number;
  capacity: number;
  isReserved: boolean;
  rows?: number;
  cols?: number;
}

export default function NewEventPage() {
  const [state, action, isPending] = useActionState(createEvent, null);
  const [imageUrl, setImageUrl] = useState("");
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [newSection, setNewSection] = useState<Partial<SectionDraft>>({
    isReserved: false,
    price: 0,
    capacity: 100,
  });

  const addSection = () => {
    if (!newSection.name) return;

    setSections([
      ...sections,
      {
        id: Date.now(),
        name: newSection.name,
        price: Number(newSection.price),
        capacity: Number(newSection.capacity),
        isReserved: !!newSection.isReserved,
        rows: newSection.isReserved ? Number(newSection.rows) : undefined,
        cols: newSection.isReserved ? Number(newSection.cols) : undefined,
      },
    ]);
    setIsAdding(false);
    setNewSection({ isReserved: false, price: 0, capacity: 100 });
  };

  const removeSection = (id: number) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Event</h1>
        <p className="text-slate-500">Define your venue and ticket tiers.</p>
      </div>

      <form action={action} className="space-y-8">
        {state?.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
            {state.error}
          </div>
        )}

        {/* 1. Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900">Event Details</h2>
          {/* 👇 NEW: Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Banner
            </label>

            {imageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={imageUrl}
                  alt="Event Banner"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-slate-600 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="eventImage"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setImageUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                className="ut-button:bg-blue-600 ut-label:text-blue-600 border-slate-300"
              />
            )}
            {/* Hidden Input to send the URL to Server Action */}
            <input type="hidden" name="imageUrl" value={imageUrl} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Event Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Event Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="e.g. Summer Tech Fest"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Date & Time
              </label>
              <input
                name="date"
                type="datetime-local"
                required
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                name="location"
                type="text"
                required
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="e.g. City Stadium"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="What's this event about?"
              />
            </div>

            {/* Image URL */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Image URL (Optional)
              </label>
              <input
                name="imageUrl"
                type="url"
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* 2. Sections Manager */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Ticket Sections</h2>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              disabled={isAdding}
              className="text-sm text-blue-600 font-bold hover:underline"
            >
              + Add Section
            </button>
          </div>

          {/* List of Added Sections */}
          {sections.length === 0 && !isAdding && (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              No sections added. Add at least one (e.g. General Admission).
            </div>
          )}

          <div className="space-y-3">
            {sections.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  {s.isReserved ? (
                    <Armchair className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Users className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      ${s.price} •{" "}
                      {s.isReserved
                        ? `Reserved (${s.rows}x${s.cols})`
                        : `Open (${s.capacity} cap)`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(s.id)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Inline Add Form */}
          {isAdding && (
            <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Section Name (e.g. VIP)"
                  className="col-span-2 p-2 border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={newSection.name || ""}
                  onChange={(e) =>
                    setNewSection({ ...newSection, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  className="p-2 border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={newSection.price}
                  onChange={(e) =>
                    setNewSection({
                      ...newSection,
                      price: Number(e.target.value),
                    })
                  }
                />
                <div className="flex items-center gap-2 bg-white px-2 border border-slate-300 rounded">
                  <input
                    type="checkbox"
                    id="reserved"
                    checked={newSection.isReserved}
                    onChange={(e) =>
                      setNewSection({
                        ...newSection,
                        isReserved: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="reserved"
                    className="text-sm font-medium cursor-pointer select-none text-slate-700"
                  >
                    Reserved Seating?
                  </label>
                </div>
              </div>

              {newSection.isReserved ? (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Rows (e.g. 10)"
                    className="p-2 border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    onChange={(e) =>
                      setNewSection({
                        ...newSection,
                        rows: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Seats per Row (e.g. 20)"
                    className="p-2 border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    onChange={(e) =>
                      setNewSection({
                        ...newSection,
                        cols: Number(e.target.value),
                      })
                    }
                  />
                </div>
              ) : (
                <input
                  type="number"
                  placeholder="Total Capacity (e.g. 500)"
                  className="w-full p-2 border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={newSection.capacity}
                  onChange={(e) =>
                    setNewSection({
                      ...newSection,
                      capacity: Number(e.target.value),
                    })
                  }
                />
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* HIDDEN INPUT: Sends the JSON array to the server */}
          <input
            type="hidden"
            name="sections"
            value={JSON.stringify(sections)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || sections.length === 0}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            {isPending ? "Creating..." : "Publish Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
