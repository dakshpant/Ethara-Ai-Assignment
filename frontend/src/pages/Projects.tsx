import React, { useState, useEffect } from "react";
import { Project, User } from "../types";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";

import {
  Plus,
  Briefcase,
  Users,
  MoreVertical,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";

import { toast } from "react-hot-toast";

import { motion } from "motion/react";

import {
  getProjects,
  createProject,
  addMemberToProject,
  deleteProject,
} from "../services/project.service";

import { getUsers } from "../services/auth.service";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [members, setMembers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const [memberSearch, setMemberSearch] = useState("");

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // LOAD CACHE FIRST
      const cacheKey = `projects-${user?.id}`;

      const cachedProjects = sessionStorage.getItem(cacheKey);

      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects));

        setIsLoading(false);
      }

      const requests = [getProjects()];

      if (isAdmin) {
        requests.push(getUsers());
      }

      const responses = await Promise.all(requests);

      const projectsData = responses[0] as Project[];

      setProjects(projectsData || []);

      sessionStorage.setItem(cacheKey, JSON.stringify(projectsData));

      if (isAdmin) {
        const usersData = responses[1] as User[];

        setMembers(usersData || []);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.log(error);

      if (error.response?.status !== 404) {
        toast.error("Failed to load projects");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const project = await createProject(newProject);

      const updatedProjects = [...projects, project];

      setProjects(updatedProjects);

      sessionStorage.setItem("projects", JSON.stringify(updatedProjects));

      setIsModalOpen(false);

      setNewProject({
        name: "",
        description: "",
      });

      toast.success("Project created successfully");
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedProjectId) return;

    try {
      await addMemberToProject(selectedProjectId, userId);

      sessionStorage.removeItem(cacheKey);

      await fetchData();

      toast.success("Member added to project");
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(projectId);

      const updatedProjects = projects.filter(
        (project) => project.id !== projectId,
      );

      setProjects(updatedProjects);

      sessionStorage.setItem(cacheKey, JSON.stringify(updatedProjects));

      toast.success("Project deleted successfully");
    } catch (error: any) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  if (isLoading && projects.length === 0) {
    return <Loader />;
  }

  const filteredMembers = members.filter((m) => {
    const project = projects.find((p) => p.id === selectedProjectId);

    const alreadyAdded = project?.members?.some(
      (member: any) => member.userId === m.id,
    );

    return (
      (m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(memberSearch.toLowerCase())) &&
      !alreadyAdded
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Main Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of all ongoing organizational work.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        )}
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects found"
          description={
            isAdmin
              ? "Create your first project to get started."
              : "You haven't been added to any projects yet."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.05,
              }}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200"
            >
              {/* Top */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-900">
                  <Briefcase className="h-5 w-5" />
                </div>

                {/* Admin Menu */}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === project.id ? null : project.id,
                        )
                      }
                      className="rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {openMenuId === project.id && (
                      <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        <button
                          onClick={() => {
                            handleDeleteProject(project.id);

                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Project
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold tracking-tight text-slate-800 transition-colors group-hover:text-indigo-600">
                {project.name}
              </h3>

              <p className="mt-2 flex-grow text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                {project.description}
              </p>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="h-3.5 w-3.5" />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {project.members?.length || 0} Members
                  </span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id);

                      setIsMemberModalOpen(true);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 text-slate-400 shadow-sm transition-all hover:bg-indigo-600 hover:text-white"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Project Name
            </label>

            <input
              required
              value={newProject.name}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              placeholder="e.g. Q3 Sales Expansion"
            />
          </div>

          <div>
            <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Description
            </label>

            <textarea
              required
              rows={3}
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
              className="w-full resize-none rounded-xl border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              placeholder="Tell us about this project..."
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Create Project
          </button>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title="Add Team Members"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              placeholder="Search by name or email..."
            />
          </div>

          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            {filteredMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => handleAddMember(m.id)}
                className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {m.name}
                  </p>

                  <p className="font-mono text-[10px] text-neutral-400">
                    {m.email}
                  </p>
                </div>

                <PlusCircle className="h-4 w-4 text-neutral-300" />
              </button>
            ))}

            {filteredMembers.length === 0 && (
              <p className="py-8 text-center text-xs text-neutral-400">
                No members available to add
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
