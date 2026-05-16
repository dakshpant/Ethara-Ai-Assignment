import prisma from "../../prisma/prisma.js";

export const getDashboardData = async (req, res) => {
  try {
    let totalTasks;
    let completedTasks;
    let pendingTasks;
    let overdueTasks;
    let recentTasks;

    // ADMIN DASHBOARD
    if (req.user.role === "ADMIN") {
      totalTasks = await prisma.task.count();

      completedTasks = await prisma.task.count({
        where: {
          status: "DONE",
        },
      });

      pendingTasks = await prisma.task.count({
        where: {
          status: {
            not: "DONE",
          },
        },
      });

      overdueTasks = await prisma.task.count({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: "DONE",
          },
        },
      });

      recentTasks = await prisma.task.findMany({
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          assignedTo: true,
          project: true,
        },
      });
    } else {
      // MEMBER DASHBOARD
      totalTasks = await prisma.task.count({
        where: {
          assignedToId: req.user.id,
        },
      });

      completedTasks = await prisma.task.count({
        where: {
          assignedToId: req.user.id,
          status: "DONE",
        },
      });

      pendingTasks = await prisma.task.count({
        where: {
          assignedToId: req.user.id,
          status: {
            not: "DONE",
          },
        },
      });

      overdueTasks = await prisma.task.count({
        where: {
          assignedToId: req.user.id,
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: "DONE",
          },
        },
      });

      recentTasks = await prisma.task.findMany({
        where: {
          assignedToId: req.user.id,
        },

        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          assignedTo: true,
          project: true,
        },
      });
    }

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      recentTasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};