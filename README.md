# TaskMaster - Collaborative Task Tracking System

TaskMaster is a comprehensive backend API for a collaborative task tracking and management application. It offers secure user authentication, team collaboration, task assignments, real-time notifications via Socket.io, file attachments, and an optional Generative AI extension to automatically generate detailed task descriptions.

## Features

- **User Management**: Secure registration, login (JWT), and profile management.
- **Team Collaboration**: Create teams and invite members to collaborate.
- **Task Management**: CRUD operations for tasks, including assigning tasks, filtering by status/team, and searching by title/description.
- **Comments & Attachments**: Add comments to tasks and upload file attachments using Multer.
- **Real-time Notifications**: Get real-time updates when tasks are assigned using WebSockets.
- **Generative AI Integration**: Automatically generate task descriptions using Google's Gemini AI.

## Tech Stack

- **Node.js & Express.js**: REST API Framework
- **MySQL & Sequelize**: Relational DB and ORM
- **Socket.io**: WebSockets for real-time notifications
- **Multer**: Local file storage for attachments
- **Bcrypt & JWT**: Password hashing and token-based authentication
- **@google/generative-ai**: Generative AI integration

## Setup & Installation

### Requirements
- Node.js (v14+)
- MySQL Server running locally on port 3306

### 1. Clone & Install
```bash
# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (one is provided by default). Ensure these values match your system setup:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=taskmaster_db
JWT_SECRET=supersecretjwtkey_assignment
GEMINI_API_KEY=your_gemini_api_key
```
*Note: Ensure your MySQL instance contains a database named `taskmaster_db` or matches the values above. Also provide a valid Gemini API key for the generative description feature.*

### 3. Start the Server
```bash
# Run in development mode
npm run dev

# Or start normally
npm start
```
The application will connect to the MySQL database, automatically sync the schema/tables, and start the Express server and Socket.io instance on port `3000`.

## API Endpoints Overview

Ensure you include the `Authorization: Bearer <token>` header for protected routes.

### Auth (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Authenticate and receive JWT
- `GET /profile`: Get the logged-in user profile
- `PUT /profile`: Update the user profile

### Teams (`/api/teams`)
- `POST /`: Create a new team
- `GET /`: Get teams for the logged-in user
- `POST /:teamId/invite`: Invite a user to a team via email

### Tasks (`/api/tasks`)
- `POST /`: Create a new task (Optional: `teamId`, `assignedToId`)
- `GET /`: List tasks (Supports query params: `status`, `search`, `teamId`, `assignedToId`)
- `PUT /:id`: Update task details, status, or assignee

### Comments & Attachments
- `POST /api/tasks/:taskId/comments`: Add a comment to a task
- `GET /api/tasks/:taskId/comments`: Retrieve all comments for a task
- `POST /api/tasks/:taskId/attachments`: Upload an attachment (multipart/form-data with key `file`)
- `GET /api/tasks/:taskId/attachments`: List all attachments for a task

### AI Extension (`/api/ai`)
- `POST /generate-description`: Automatically generate a task description.
  *Body*: `{ "title": "Implement Login", "context": "Use JWT and bcrypt" }`


