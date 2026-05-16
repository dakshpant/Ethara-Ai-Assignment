import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-task-manager-key";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "MEMBER";
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberIds: string[];
  createdAt: string;
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId: string;
  dueDate: string;
  createdAt: string;
}

// In-memory DB
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Member User",
    email: "member@example.com",
    passwordHash: bcrypt.hashSync("member123", 10),
    role: "MEMBER",
    createdAt: new Date().toISOString(),
  }
];

const projects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Modernizing our landing page with the new brand guidelines.",
    adminId: "1",
    memberIds: ["1", "2"],
    createdAt: new Date().toISOString(),
  }
];

const tasks: Task[] = [
  {
    id: "t1",
    projectId: "p1",
    title: "Design System Implementation",
    description: "Implement the new design system components in Tailwind.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assigneeId: "2",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Update Logo Assets",
    description: "Export all logo variations for the web team.",
    priority: "MEDIUM",
    status: "DONE",
    assigneeId: "1",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user;
      next();
    });
  };

  // Auth APIs
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "MEMBER",
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // Projects APIs
  app.get("/api/projects", authenticateToken, (req: any, res) => {
    const userId = req.user.id;
    const userProjects = projects.filter(p => p.adminId === userId || p.memberIds.includes(userId));
    res.json(userProjects);
  });

  app.post("/api/projects", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
    const { name, description } = req.body;
    const newProject: Project = {
      id: "p" + Math.random().toString(36).substr(2, 5),
      name,
      description,
      adminId: req.user.id,
      memberIds: [req.user.id],
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    res.status(201).json(newProject);
  });

  app.post("/api/projects/:projectId/members", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
    const { projectId } = req.params;
    const { userId } = req.body;
    const project = projects.find(p => p.id === projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!project.memberIds.includes(userId)) {
      project.memberIds.push(userId);
    }
    res.json(project);
  });

  // Tasks APIs
  app.get("/api/tasks", authenticateToken, (req: any, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Admins see all tasks for projects they admin
    // Members see tasks assigned to them
    const userProjects = projects.filter(p => p.adminId === userId || p.memberIds.includes(userId));
    const projectIds = userProjects.map(p => p.id);
    
    let userTasks = tasks.filter(t => projectIds.includes(t.projectId));
    if (userRole === "MEMBER") {
      userTasks = userTasks.filter(t => t.assigneeId === userId);
    }
    
    res.json(userTasks);
  });

  app.post("/api/tasks", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
    const { projectId, title, description, priority, dueDate, assigneeId } = req.body;
    const newTask: Task = {
      id: "t" + Math.random().toString(36).substr(2, 5),
      projectId,
      title,
      description,
      priority,
      status: "TODO",
      assigneeId,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  app.patch("/api/tasks/:id", authenticateToken, (req: any, res) => {
    const { id } = req.params;
    const { status, title, description, priority, dueDate, assigneeId } = req.body;
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Members can only update status
    if (req.user.role === "MEMBER") {
      if (task.assigneeId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
      if (status) task.status = status;
    } else {
      // Admins can update everything
      if (status) task.status = status;
      if (title) task.title = title;
      if (description) task.description = description;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
      if (assigneeId) task.assigneeId = assigneeId;
    }

    res.json(task);
  });

  app.delete("/api/tasks/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Admin only" });
    const { id } = req.params;
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ message: "Task not found" });
    tasks.splice(index, 1);
    res.status(204).send();
  });

  // Dashboard API
  app.get("/api/dashboard", authenticateToken, (req: any, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const userProjects = projects.filter(p => p.adminId === userId || p.memberIds.includes(userId));
    const projectIds = userProjects.map(p => p.id);
    
    let userTasks = tasks.filter(t => projectIds.includes(t.projectId));
    if (userRole === "MEMBER") {
      userTasks = userTasks.filter(t => t.assigneeId === userId);
    }

    const stats = {
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(t => t.status === "DONE").length,
      pendingTasks: userTasks.filter(t => t.status === "IN_PROGRESS" || t.status === "TODO").length,
      overdueTasks: userTasks.filter(t => t.status !== "DONE" && new Date(t.dueDate) < new Date()).length,
      recentTasks: userTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    };
    
    res.json(stats);
  });

  // Helper API to get all members for dropdown
  app.get("/api/members", authenticateToken, (req, res) => {
    res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
  });

  // Vite and Static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
