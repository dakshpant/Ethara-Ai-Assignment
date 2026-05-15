import prisma from "../../prisma/prisma.js";


// CREATE TASK
export const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      projectId,
      assignedToId,
      priority,
      dueDate,
    } = req.body;

    // validation
    if (!title || !projectId || !assignedToId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // check project
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

    // check user
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

    // create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedToId,
        priority,
        dueDate: dueDate
          ? new Date(dueDate)
          : null,

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

    // admin sees all tasks
    if (req.user.role === "ADMIN") {

      tasks = await prisma.task.findMany({
        include: {
          assignedTo: true,
          project: true,
        },
      });

    } else {

      // member sees own tasks
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

    // members can update only own tasks
    if (
      req.user.role === "MEMBER" &&
      task.assignedToId !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

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