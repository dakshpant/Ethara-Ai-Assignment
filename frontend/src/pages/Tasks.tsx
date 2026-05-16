import React, { useState, useEffect } from "react";
import { Task, Project, User, Priority, TaskStatus } from "../types";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { PriorityBadge } from "../components/ui/PriorityBadge";
import { Plus, CheckSquare, Trash2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../services/task.service";
import { getProjects } from "../services/project.service";
import { getUsers } from "../services/auth.service";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | "ALL">(
    "ALL",
  );

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedToId: "",
    priority: "MEDIUM" as Priority,
    dueDate: new Date().toISOString().split("T")[0],
  });

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchData();
  }, []);

async function fetchData() {
  try {
    // LOAD CACHED TASKS
    const cachedTasks =
      sessionStorage.getItem(
        "tasks",
      );

    const cachedProjects =
      sessionStorage.getItem(
        "projects",
      );

    if (cachedTasks) {
      setTasks(
        JSON.parse(
          cachedTasks,
        ),
      );
    }

    if (cachedProjects) {
      setProjects(
        JSON.parse(
          cachedProjects,
        ),
      );
    }

    setIsLoading(false);

    const requests = [
      getTasks(),
      getProjects(),
    ];

    // ONLY ADMIN FETCHES USERS
    if (
      user?.role === "ADMIN"
    ) {
      requests.push(
        getUsers(),
      );
    }

    const responses =
      await Promise.all(
        requests,
      );

    const tasksData =
      responses[0] as Task[];

    const projectsData =
      responses[1] as Project[];

    // UPDATE STATE
    setTasks(tasksData || []);

    setProjects(
      projectsData || [],
    );

    // CACHE DATA
    sessionStorage.setItem(
      "tasks",
      JSON.stringify(
        tasksData,
      ),
    );

    sessionStorage.setItem(
      "projects",
      JSON.stringify(
        projectsData,
      ),
    );

    // ONLY ADMIN HAS USERS RESPONSE
    if (
      user?.role === "ADMIN"
    ) {
      const usersData =
        responses[2] as User[];

      setMembers(
        usersData || [],
      );
    }

    // DEFAULT SELECTED PROJECT
    if (
      projectsData?.length > 0
    ) {
      setSelectedProjectId(
        projectsData[0].id,
      );
    }
  } catch (error) {
    console.log(error);

    toast.error(
      "Failed to load tasks",
    );
  } finally {
    setIsLoading(false);
  }
}

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsCreatingTask(true);

    try {
      if (!newTask.title.trim()) {
        toast.error("Task title is required");

        return;
      }

      if (newTask.title.trim().length < 3) {
        toast.error("Task title must be at least 3 characters");

        return;
      }

      if (!newTask.projectId) {
        toast.error("Please select a project");

        return;
      }

      if (!newTask.assignedToId) {
        toast.error("Please assign the task");

        return;
      }

      const task = await createTask({
        ...newTask,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
      });

      setTasks((prev) => [...prev, task]);

      setIsModalOpen(false);

      setNewTask({
        title: "",
        description: "",
        projectId: selectedProjectId !== "ALL" ? selectedProjectId : "",
        assignedToId: "",
        priority: "MEDIUM",
        dueDate: new Date().toISOString().split("T")[0],
      });

      toast.success("Task created successfully");
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    try {
      const updatedTask = await updateTaskStatus(id, status);

      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));

      toast.success(
        `Task moved to ${
          status === "DONE"
            ? "Done"
            : status === "IN_PROGRESS"
              ? "In Progress"
              : "To Do"
        }`,
      );
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(id);

      setTasks((prev) => prev.filter((t) => t.id !== id));

      toast.success("Task deleted");
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  if (isLoading && tasks.length === 0) {
    return <Loader />;
  }

  const filteredTasks =
    selectedProjectId === "ALL"
      ? tasks
      : tasks.filter((t) => t.projectId === selectedProjectId);

  const stages: {
    label: string;
    status: TaskStatus;
  }[] = [
    {
      label: "To Do",
      status: "TODO",
    },
    {
      label: "In Progress",
      status: "IN_PROGRESS",
    },
    {
      label: "Done",
      status: "DONE",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Project Board
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Board view for tracking project milestones.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setNewTask((prev) => ({
                ...prev,
                projectId: selectedProjectId !== "ALL" ? selectedProjectId : "",
              }));

              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        )}
      </div>

      {/* Project Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 pb-1">
        <button
          onClick={() => setSelectedProjectId("ALL")}
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-lg",
            selectedProjectId === "ALL"
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
          )}
        >
          All
        </button>

        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-lg",
              selectedProjectId === project.id
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
            )}
          >
            {project.name}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No projects found"
          description="Create a project first."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div key={stage.status} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  {stage.label}

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-400">
                    {
                      filteredTasks.filter((t) => t.status === stage.status)
                        .length
                    }
                  </span>
                </h3>
              </div>

              <div className="flex flex-col gap-3 min-h-[500px] border-2 border-dashed border-slate-100/50 rounded-2xl p-2 bg-slate-50/30">
                <AnimatePresence mode="popLayout">
                  {filteredTasks
                    .filter((t) => t.status === stage.status)
                    .map((task, i) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                        }}
                        transition={{
                          delay: i * 0.05,
                        }}
                        className="group relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <PriorityBadge priority={task.priority} />

                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition-all p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                          {task.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-3">
                          <div className="flex items-center gap-1.5">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-[10px] font-bold text-slate-400">
                              {task.assignedTo?.name?.[0] || "?"}
                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "No Date"}
                            </span>
                          </div>

                          <div className="flex gap-1">
                            {stage.status !== "TODO" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    task.id,
                                    stage.status === "DONE"
                                      ? "IN_PROGRESS"
                                      : "TODO",
                                  )
                                }
                                className="h-6 w-6 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors"
                              >
                                <ArrowRight className="h-3 w-3 rotate-180" />
                              </button>
                            )}

                            {stage.status !== "DONE" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    task.id,
                                    stage.status === "TODO"
                                      ? "IN_PROGRESS"
                                      : "DONE",
                                  )
                                }
                                className="h-6 w-6 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm shadow-indigo-100"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTasks.filter((t) => t.status === stage.status)
                  .length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Empty
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Task Title
            </label>

            <input
              id="title"
              required
              disabled={isCreatingTask}
              value={newTask.title}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  title: e.target.value,
                })
              }
              placeholder="e.g. Design dashboard layout"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={3}
              disabled={isCreatingTask}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              }
              placeholder="Add task details..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
            />
          </div>

          {/* Project */}
          <div className="space-y-1.5">
            <label
              htmlFor="project"
              className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Project
            </label>

            <select
              id="project"
              required
              disabled={isCreatingTask}
              value={newTask.projectId}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  projectId: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
            >
              <option value="">Select Project</option>

              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <label
              htmlFor="assignee"
              className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Assign To
            </label>

            <select
              id="assignee"
              required
              disabled={isCreatingTask}
              value={newTask.assignedToId}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  assignedToId: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
            >
              <option value="">Select Assignee</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label
              htmlFor="priority"
              className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Priority
            </label>

            <select
              id="priority"
              disabled={isCreatingTask}
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value as Priority,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
            >
              <option value="LOW">Low</option>

              <option value="MEDIUM">Medium</option>

              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="dueDate"
              className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              type="date"
              disabled={isCreatingTask}
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  dueDate: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isCreatingTask}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreatingTask ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
