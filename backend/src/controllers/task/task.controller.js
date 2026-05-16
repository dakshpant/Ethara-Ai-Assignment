import prisma from "../../prisma/prisma.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedToId, priority, dueDate } =
      req.body;

    // VALIDATION
    if (!title || !projectId || !assignedToId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // PRIORITY VALIDATION
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority value",
      });
    }

    // CHECK PROJECT
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // CHECK USER
    const user = await prisma.user.findUnique({
      where: {
        id: assignedToId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Assigned user not found",
      });
    }

    // CREATE TASK
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedToId,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,

        createdById: req.user.id,
      },
    });

    res.status(201).json({
      message: "Task created successfully",

      task,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET TASKS
export const getTasks = async (req, res) => {
  try {
    let tasks;

    // ADMIN SEES ALL
    if (req.user.role === "ADMIN") {
      tasks = await prisma.task.findMany({
        include: {
          assignedTo: true,
          project: true,
        },
      });
    } else {
      // MEMBER SEES OWN TASKS
      tasks = await prisma.task.findMany({
        where: {
          assignedToId: req.user.id,
        },

        include: {
          assignedTo: true,
          project: true,
        },
      });
    }

    if (!tasks.length) {
      return res.status(404).json({
        message: "No tasks found",
      });
    }

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE TASK STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    // VALID STATUS CHECK
    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // FIND TASK
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // MEMBER ACCESS CHECK
    if (req.user.role === "MEMBER" && task.assignedToId !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // UPDATE TASK
    const updatedTask = await prisma.task.update({
      where: {
        id,
      },

      data: {
        status,
      },
    });

    res.status(200).json({
      message: "Task updated successfully",

      task: updatedTask,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
