"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  isReserved: z.boolean(),
  rows: z.coerce.number().optional(),
  cols: z.coerce.number().optional(),
});

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

export async function createEvent(prevState: any, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    imageUrl: formData.get("imageUrl"),
    sections: JSON.parse(formData.get("sections") as string),
  };

  const result = eventSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  try {
    await prisma.event.create({
      data: {
        organizerId: userId,
        name: data.name,
        description: data.description || "",
        date: new Date(data.date),
        location: data.location,
        imageUrl: data.imageUrl || null,
        sections: {
          create: data.sections.map((s) => ({
            name: s.name,
            price: s.price,
            capacity: s.isReserved ? (s.rows || 0) * (s.cols || 0) : s.capacity, // Auto-calc capacity for seated
            isReserved: s.isReserved,
            rows: s.isReserved ? s.rows : null,
            cols: s.isReserved ? s.cols : null,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    return { error: "Failed to save event to database." };
  }

  redirect("/organizer");
}
