import api from "./api";

export const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data.projects;
};

export const createProject = async (projectData: {
  name: string;
  description: string;
}) => {
  const response = await api.post(
    "/projects",
    projectData,
  );

  return response.data.project;
};

export const addMemberToProject = async (
  projectId: string,
  userId: string,
) => {
  const response = await api.post(
    `/projects/${projectId}/members`,
    {
      userId,
    },
  );

  return response.data;
};

export const deleteProject = async (
  projectId: string,
) => {
  const response = await api.delete(
    `/projects/${projectId}`,
  );

  return response.data;
};