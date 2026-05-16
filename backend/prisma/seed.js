import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // CLEAR OLD DATA
  await prisma.task.deleteMany();

  await prisma.projectMember.deleteMany();

  await prisma.project.deleteMany();

  await prisma.user.deleteMany();

  // PASSWORDS
  const adminPassword =
    await bcrypt.hash(
      "admin123",
      10,
    );

  const memberPassword =
    await bcrypt.hash(
      "member123",
      10,
    );

  // USERS
  const admin =
    await prisma.user.create({
      data: {
        name: "Daksh Admin",
        email:
          "admin@example.com",
        password:
          adminPassword,
        role: "ADMIN",
      },
    });

  const member1 =
    await prisma.user.create({
      data: {
        name: "Aman Sharma",
        email:
          "aman@example.com",
        password:
          memberPassword,
        role: "MEMBER",
      },
    });

  const member2 =
    await prisma.user.create({
      data: {
        name: "Priya Singh",
        email:
          "priya@example.com",
        password:
          memberPassword,
        role: "MEMBER",
      },
    });

  // PROJECTS
  const project1 =
    await prisma.project.create({
      data: {
        name:
          "TeamFlow Web App",

        description:
          "Main productivity platform development",
      },
    });

  const project2 =
    await prisma.project.create({
      data: {
        name:
          "Mobile Dashboard",

        description:
          "Analytics dashboard redesign",
      },
    });

  // PROJECT MEMBERS
  await prisma.projectMember.createMany(
    {
      data: [
        {
          userId: admin.id,
          projectId:
            project1.id,
        },

        {
          userId: member1.id,
          projectId:
            project1.id,
        },

        {
          userId: member2.id,
          projectId:
            project1.id,
        },

        {
          userId: member1.id,
          projectId:
            project2.id,
        },
      ],
    },
  );

  // TASKS
  await prisma.task.createMany({
    data: [
      {
        title:
          "Design Login Page",

        description:
          "Create responsive authentication UI",

        status: "DONE",

        priority: "HIGH",

        projectId:
          project1.id,

        assignedToId:
          member1.id,

        createdById:
          admin.id,

        dueDate:
          new Date(
            "2026-05-10",
          ),
      },

      {
        title:
          "Build Dashboard API",

        description:
          "Create dashboard analytics endpoint",

        status:
          "IN_PROGRESS",

        priority: "HIGH",

        projectId:
          project1.id,

        assignedToId:
          member2.id,

        createdById:
          admin.id,

        dueDate:
          new Date(
            "2026-05-20",
          ),
      },

      {
        title:
          "Fix Navbar UI",

        description:
          "Improve navbar responsiveness",

        status: "TODO",

        priority:
          "MEDIUM",

        projectId:
          project2.id,

        assignedToId:
          member1.id,

        createdById:
          admin.id,

        dueDate:
          new Date(
            "2026-05-25",
          ),
      },

      {
        title:
          "Database Optimization",

        description:
          "Improve Prisma query performance",

        status: "TODO",

        priority: "LOW",

        projectId:
          project1.id,

        assignedToId:
          member2.id,

        createdById:
          admin.id,

        dueDate:
          new Date(
            "2026-05-28",
          ),
      },
    ],
  });

  console.log(
    "✅ Database seeded successfully",
  );

  console.log(
    "\nAdmin Login:",
  );

  console.log(
    "admin@example.com / admin123",
  );

  console.log(
    "\nMember Login:",
  );

  console.log(
    "aman@example.com / member123",
  );
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });