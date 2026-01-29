"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateEvent } from "@/app/actions/updateEvent";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import React from "react";

type FormState = { error?: string } | null;

interface EventData {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  location: string;
  imageUrl: string | null;
}

export default function EditEventForm({ event }: { event: EventData }) {
  // Bind the event ID to the action so the server knows which event to update
  const action = async (
    prevState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    return updateEvent(event.id, prevState, formData);
  };

  // 👇 THIS is the key line
  const [state, formAction] = React.useActionState<FormState>(
    action as unknown as (state: FormState) => Promise<FormState>,
    null,
  );
  const [imageUrl, setImageUrl] = useState(event.imageUrl || "");
  // Format date for datetime-local input (yyyy-MM-ddThh:mm)
  const defaultDate = new Date(event.date).toISOString().slice(0, 16);

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    >
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
          {state.error}
        </div>
      )}

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Event Banner
        </label>
        {imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200">
            <Image src={imageUrl} alt="Banner" fill className="object-cover" />
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
            onClientUploadComplete={(res) => res && setImageUrl(res[0].url)}
            className="ut-button:bg-blue-600 ut-label:text-blue-600 border-slate-300"
          />
        )}
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Event Name
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={event.name}
            className="mt-1 w-full rounded-md border border-slate-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Date & Time
          </label>
          <input
            name="date"
            type="datetime-local"
            required
            defaultValue={defaultDate}
            className="mt-1 w-full rounded-md border border-slate-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            name="location"
            type="text"
            required
            defaultValue={event.location}
            className="mt-1 w-full rounded-md border border-slate-300 p-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={event.description || ""}
            className="mt-1 w-full rounded-md border border-slate-300 p-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <SubmitButton />
      </div>
    </form>
  );
}
