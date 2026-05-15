import prisma from "../../prisma/prisma.js";

export const getDashboardData = async (req, res) => {
  try {

    let totalTasks;
    let completedTasks;
    let pendingTasks;
    let overdueTasks;

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

    }

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });

  }
};