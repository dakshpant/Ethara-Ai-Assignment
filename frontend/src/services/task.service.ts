import api from "./api";
import { TaskStatus } from "../types";

export const getTasks = async () => {
  const response = await api.get("/tasks");

  return response.data.tasks;
};

export const createTask = async (
  data: any
) => {
  const response = await api.post(
    "/tasks",
    data
  );

  return response.data.task;
};

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus
) => {
  const response = await api.patch(
    `/tasks/${id}`,
    { status }
  );

  return response.data.task;
};

export const deleteTask = async (
  id: string
) => {
  await api.delete(`/tasks/${id}`);
};