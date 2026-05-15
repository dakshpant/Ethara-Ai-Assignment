import prisma from "../../prisma/prisma.js";


// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // validation
    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    // create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// GET PROJECTS
export const getProjects = async (req, res) => {
  try {

    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },

        tasks: true,
      },
    });

    res.status(200).json({
      projects,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// ADD MEMBER TO PROJECT
export const addMemberToProject = async (req, res) => {
  try {

    const { projectId } = req.params;

    const { userId } = req.body;

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
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // add member
    const member = await prisma.projectMember.create({
      data: {
        userId,
        projectId,
      },
    });

    res.status(201).json({
      message: "Member added successfully",
      member,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });

  }
};