import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const event = await prisma.event.create({
    data: {
      name: "Tech Summit 2026",
      organizerId: "user_123",
      description: "The biggest tech conference in Lagos.",
      date: new Date("2026-12-15T09:00:00Z"),
      location: "Eko Convention Center",
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
    },
  });

  await prisma.section.create({
    data: {
      name: "VIP Front Row",
      price: 50000,
      capacity: 50,
      isReserved: true,
      rows: 5,
      cols: 10,
      eventId: event.id,
    },
  });

  await prisma.section.create({
    data: {
      name: "General Admission",
      price: 15000,
      capacity: 500,
      isReserved: false,
      eventId: event.id,
    },
  });

  console.log("Created Hybrid Event:", event.name);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
