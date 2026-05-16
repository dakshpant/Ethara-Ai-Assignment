export type Role = "ADMIN" | "MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberIds: string[];
  createdAt: string;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  recentTasks: Task[];
}
