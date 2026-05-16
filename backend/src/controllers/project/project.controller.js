import prisma from "../../prisma/prisma.js";

// CREATE PROJECT
export const createProject = async (
  req,
  res,
) => {
  try {
    const {
      name,
      description,
    } = req.body;

    // VALIDATION
    if (!name) {
      return res.status(400).json({
        message:
          "Project name is required",
      });
    }

    // DUPLICATE CHECK
    const existingProject =
      await prisma.project.findFirst(
        {
          where: {
            name,
          },
        },
      );

    if (existingProject) {
      return res.status(400).json({
        message:
          "Project already exists",
      });
    }

    // CREATE PROJECT
    const project =
      await prisma.project.create({
        data: {
          name,
          description,
        },
      });

    res.status(201).json({
      message:
        "Project created successfully",

      project,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

// GET PROJECTS
export const getProjects = async (
  req,
  res,
) => {
  try {
    let projects;

    // ADMIN SEES ALL
    if (
      req.user.role === "ADMIN"
    ) {
      projects =
        await prisma.project.findMany(
          {
            include: {
              members: {
                include: {
                  user: true,
                },
              },

              tasks: true,
            },
          },
        );
    } else {
      // MEMBER SEES ONLY ASSIGNED PROJECTS
      projects =
        await prisma.project.findMany(
          {
            where: {
              members: {
                some: {
                  userId:
                    req.user.id,
                },
              },
            },

            include: {
              members: {
                include: {
                  user: true,
                },
              },

              tasks: true,
            },
          },
        );
    }

    if (!projects.length) {
      return res.status(404).json({
        message:
          "No projects found",
      });
    }

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

// ADD MEMBER TO PROJECT
export const addMemberToProject =
  async (req, res) => {
    try {
      const { projectId } =
        req.params;

      const { userId } =
        req.body;

      // VALIDATION
      if (!userId) {
        return res
          .status(400)
          .json({
            message:
              "User ID is required",
          });
      }

      // CHECK PROJECT
      const project =
        await prisma.project.findUnique(
          {
            where: {
              id: projectId,
            },
          },
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project not found",
          });
      }

      // CHECK USER
      const user =
        await prisma.user.findUnique(
          {
            where: {
              id: userId,
            },
          },
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      // CHECK EXISTING MEMBER
      const existingMember =
        await prisma.projectMember.findFirst(
          {
            where: {
              userId,
              projectId,
            },
          },
        );

      if (existingMember) {
        return res
          .status(400)
          .json({
            message:
              "User already added to project",
          });
      }

      // ADD MEMBER
      const member =
        await prisma.projectMember.create(
          {
            data: {
              userId,
              projectId,
            },
          },
        );

      res.status(201).json({
        message:
          "Member added successfully",

        member,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };