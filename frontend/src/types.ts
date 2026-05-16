export type Role =
  | "ADMIN"
  | "MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface ProjectMember {
  id: string;

  userId: string;

  projectId: string;

  user: User;
}

export interface Project {
  id: string;

  name: string;

  description?: string;

  createdAt: string;

  createdById?: string;

  members?: ProjectMember[];

  tasks?: Task[];
}

export type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

export interface Task {
  id: string;

  projectId: string;

  title: string;

  description?: string;

  priority: Priority;

  status: TaskStatus;

  assignedToId: string;

  createdById: string;

  dueDate?: string;

  createdAt: string;

  assignedTo?: User;

  project?: Project;
}

export interface DashboardStats {
  totalTasks: number;

  completedTasks: number;

  pendingTasks: number;

  overdueTasks: number;
}