import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Project, User } from "../types";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/ui/Loader";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { 
  Plus, 
  Briefcase, 
  Users, 
  Calendar,
  MoreVertical,
  PlusCircle,
  Search
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [memberSearch, setMemberSearch] = useState("");
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [projectsRes, membersRes] = await Promise.all([
        api.get("/projects"),
        api.get("/members")
      ]);
      setProjects(projectsRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/projects", newProject);
      setProjects([...projects, response.data]);
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedProjectId) return;
    try {
      await api.post(`/projects/${selectedProjectId}/members`, { userId });
      fetchData();
      toast.success("Member added to project");
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  if (isLoading) return <Loader />;

  const filteredMembers = members.filter(m => 
    (m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
     m.email.toLowerCase().includes(memberSearch.toLowerCase())) &&
    !projects.find(p => p.id === selectedProjectId)?.memberIds.includes(m.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Projects</h2>
          <p className="mt-1 text-sm text-slate-500">Overview of all ongoing organizational work.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects found"
          description={isAdmin ? "Create your first project to get started." : "You haven't been added to any projects yet."}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-900">
                  <Briefcase className="h-5 w-5" />
                </div>
                <button className="text-slate-300 hover:text-slate-900">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">{project.name}</h3>
              <p className="mt-2 flex-grow text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                {project.description}
              </p>
              
              <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{project.memberIds.length} Members</span>
                  </div>
                </div>
                
                {isAdmin && (
                  <button 
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setIsMemberModalOpen(true);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
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
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">Project Name</label>
            <input
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              placeholder="e.g. Q3 Sales Expansion"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">Description</label>
            <textarea
              required
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none resize-none"
              placeholder="Tell us about this project..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white hover:bg-neutral-800 transition-colors"
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
              className="w-full rounded-xl border border-neutral-100 bg-neutral-50/50 pl-10 pr-4 py-2.5 text-sm transition-all focus:border-neutral-900 focus:bg-white focus:outline-none"
              placeholder="Search by name or email..."
            />
          </div>
          <div className="max-h-60 overflow-y-auto pr-1 space-y-1">
            {filteredMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => handleAddMember(m.id)}
                className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{m.name}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">{m.email}</p>
                </div>
                <PlusCircle className="h-4 w-4 text-neutral-300" />
              </button>
            ))}
            {filteredMembers.length === 0 && (
              <p className="py-8 text-center text-xs text-neutral-400">No members available to add</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
