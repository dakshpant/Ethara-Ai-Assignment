# Team Task Manager

A modern full-stack Team Task Manager web application built with React, Node.js, Express, Prisma, and PostgreSQL.

The application allows organizations and teams to:

* create projects
* manage team members
* assign tasks
* track progress
* monitor deadlines
* manage work with role-based access control

---

# Live Demo

## Frontend

```txt
https://your-frontend-url.vercel.app
```

## Backend API

```txt
https://your-backend-url.up.railway.app
```

---

# Demo Accounts

## Admin Account

```txt
Email: admin@example.com
Password: admin123
```

## Member Account

```txt
Email: aman@example.com
Password: member123
```

---

# Features

## Authentication

* User Signup
* User Login
* JWT Authentication
* Persistent Login Sessions
* Protected Routes
* Logout Functionality

---

## Role-Based Access Control (RBAC)

### Admin

Admins can:

* Create projects
* Add members to projects
* Create tasks
* Assign tasks
* Delete tasks
* View all projects
* View all tasks
* View dashboard analytics

### Member

Members can:

* View assigned projects
* View assigned tasks
* Update own task status
* Track task progress
* View dashboard analytics for own tasks

---

## Project Management

* Create Projects
* Add Team Members
* Project Member Management
* Project Visibility Control
* Project Statistics

---

## Task Management

* Create Tasks
* Assign Tasks to Members
* Task Priorities
* Task Status Workflow
* Due Dates
* Task Deletion
* Status Tracking

### Task Workflow

```txt
TODO → IN_PROGRESS → DONE
```

---

## Dashboard

* Total Tasks
* Completed Tasks
* Pending Tasks
* Overdue Tasks
* Recent Tasks
* Live Progress Indicator
* Role-Based Analytics

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Hot Toast
* Framer Motion
* Lucide React

---

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* BcryptJS

---

## Deployment

* Railway (Backend + PostgreSQL)
* Vercel (Frontend)

---

# Folder Structure

```txt
Assignment
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── src
│   │   ├── config
│   │   │
│   │   ├── controllers
│   │   │   ├── auth
│   │   │   ├── dashboard
│   │   │   ├── project
│   │   │   └── task
│   │   │
│   │   ├── middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── prisma
│   │   │   └── prisma.js
│   │   │
│   │   ├── routes
│   │   │   ├── auth
│   │   │   ├── dashboard
│   │   │   ├── project
│   │   │   └── task
│   │   │
│   │   ├── utils
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── prisma.config.ts
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── ui
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── context
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── layouts
│   │   │   └── AppLayout.tsx
│   │   │
│   │   ├── pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Tasks.tsx
│   │   │   └── Profile.tsx
│   │   │
│   │   ├── services
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── project.service.ts
│   │   │   └── task.service.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── types.ts
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Database Schema

## User

Stores:

* user information
* authentication details
* roles

## Project

Stores:

* project details
* descriptions
* related tasks

## ProjectMember

Manages:

* many-to-many relationship
* users assigned to projects

## Task

Stores:

* assigned tasks
* priorities
* statuses
* due dates
* task creators

---

# API Endpoints

## Authentication

### Signup

```http
POST /api/auth/signup
```

### Login

```http
POST /api/auth/login
```

### Get Users

```http
GET /api/auth/users
```

---

## Projects

### Get Projects

```http
GET /api/projects
```

### Create Project

```http
POST /api/projects
```

### Add Member

```http
POST /api/projects/:projectId/members
```

---

## Tasks

### Get Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

### Update Task Status

```http
PATCH /api/tasks/:id
```

### Delete Task

```http
DELETE /api/tasks/:id
```

---

## Dashboard

### Get Dashboard Data

```http
GET /api/dashboard
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create .env File

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key
PORT=3000
```

---

## Push Prisma Schema

```bash
npx prisma db push
```

---

## Seed Database

```bash
npx prisma db seed
```

---

## Start Backend Server

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:3000
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

---

## Create .env File

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Performance Optimizations

Implemented:

* Axios API Layer
* Session Storage Caching
* Optimized Rendering
* Reduced API Refetching
* Protected Route Handling
* Role-Based Conditional Rendering
* Smooth Page Transitions

---

# Security Features

* JWT Authentication
* Password Hashing
* Protected Backend Routes
* Role Middleware
* Input Validation
* Duplicate Prevention
* Access Control

---

# Deployment Guide

## Backend Deployment (Railway)

1. Push project to GitHub
2. Create Railway Project
3. Connect GitHub Repository
4. Add Environment Variables
5. Deploy Backend

---

## Frontend Deployment (Vercel)

1. Import GitHub Repository
2. Add Frontend Environment Variables
3. Deploy Frontend

---

# Environment Variables

## Backend

```env
DATABASE_URL=
JWT_SECRET=
PORT=
NODE_ENV=production
```

## Frontend

```env
VITE_API_URL=
```

---

# Future Improvements

* Real-Time Notifications
* WebSockets
* File Attachments
* Team Chat
* Activity Logs
* Drag & Drop Kanban Board
* Dark Mode
* Email Notifications
* Pagination
* Advanced Filtering

---

# Author

## Daksh Pant

Built as a full-stack assignment project demonstrating:

* full-stack development
* RBAC implementation
* relational database modeling
* REST API architecture
* frontend optimization
* modern UI/UX practices

---

# License

This project is developed for educational and assignment purposes.
