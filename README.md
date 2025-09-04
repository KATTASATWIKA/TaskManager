# Task Manager - Kanban-Style Project Management

A full-stack task management application with drag-and-drop functionality built using React, Node.js, Express, and MongoDB. Features a modern Kanban-style interface for organizing projects and tasks efficiently.

## 🚀 Features

### Core Functionality
- **Multi-Board Management**: Create and manage multiple project boards
- **Drag & Drop Interface**: Seamlessly move tasks between lists and reorder items
- **Task Lists**: Organize tasks in customizable lists (To Do, In Progress, Done, etc.)
- **Task Management**: Create, edit, delete, and prioritize tasks
- **Real-time Updates**: Auto-save functionality with visual feedback

### Task Features
- **Priority Levels**: Urgent, High, Medium, Low priority with color coding
- **Due Dates**: Set and track task deadlines with overdue indicators
- **Labels**: Organize tasks with custom labels and tags
- **Descriptions**: Add detailed descriptions to tasks
- **Task Modal**: Comprehensive task editing interface

### User Experience
- **Responsive Design**: Modern, mobile-friendly interface
- **Dark/Light Themes**: Theme switching capability
- **Smart Notifications**: Urgent task alerts on dashboard
- **Board Templates**: Quick setup with default or project-specific lists
- **Layout Persistence**: Automatically saves board and task arrangements

## 🛠 Technology Stack

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **React Beautiful DnD** for drag-and-drop functionality
- **Lucide React** for icons
- **Date-fns** for date manipulation
- **Custom CSS** with modern styling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for secure user sessions
- **RESTful API** architecture

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend development server (from frontend directory)
   npm start
   ```

6. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🗄 Database Schema

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### Boards
```javascript
{
  _id: ObjectId,
  title: String,
  owner: ObjectId (User reference),
  listOrder: [ObjectId], // Order of lists
  createdAt: Date,
  updatedAt: Date
}
```

#### TaskLists
```javascript
{
  _id: ObjectId,
  title: String,
  board: ObjectId (Board reference),
  taskOrder: [ObjectId], // Order of tasks
  createdAt: Date,
  updatedAt: Date
}
```

#### Tasks
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  list: ObjectId (TaskList reference),
  priority: String, // 'low', 'medium', 'high', 'urgent'
  dueDate: Date,
  labels: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Boards
- `GET /api/boards` - Get all user boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board with lists and tasks
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:id/lists` - Create list in board

### Lists
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list

### Tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task


## 🚦 Usage Guide

### Getting Started
1. **Register/Login**: Create account or sign in
2. **Create Board**: Click "New Board" on dashboard
3. **Add Lists**: Use quick templates or create custom lists
4. **Create Tasks**: Click "Add a task" in any list
5. **Organize**: Drag tasks between lists and reorder as needed

### Board Management
- **Default Lists**: To Do, In Progress, Done
- **Quick Lists**: Backlog, Planning, Development, Testing, Review, Deployment
- **Custom Lists**: Create lists specific to your workflow

### Task Organization
- **Priorities**: Set task priority levels with visual indicators
- **Due Dates**: Track deadlines with smart date formatting
- **Labels**: Tag tasks for better organization
- **Descriptions**: Add detailed task information

## 🔧 Development

5. **Run the application**
   ```bash
   # Start backend server (from backend directory)
   node server.js
   
   # Start frontend development server (from frontend directory)
   npm run dev
   ```

### Running Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests  
cd backend && npm test
```

### Building for Production
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && node server.js
```

## 🚀 Future Enhancements

- [ ] Real-time collaboration
- [ ] File attachments
- [ ] Task comments and activity log
- [ ] Advanced filtering and search
- [ ] Time tracking
- [ ] Team management
- [ ] Board templates
- [ ] Notifications system
- [ ] Mobile app version



Built with ❤️ using React and Node.js
