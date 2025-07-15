# 📝 Task Manager App

A simple full-stack **Task Management Web Application** that allows users to register, log in, and manage their daily tasks. Built with the **MERN stack** (MongoDB, Express, React, Node.js), this app demonstrates user authentication, CRUD operations, and secure API communication.

---

# 🚀 Key Features

- ✅ User registration & login with JWT authentication
- 🧠 Create, read, update, and delete tasks
- 🔐 Protected routes using middleware
- 🔍 Filter or sort tasks
- 💾 MongoDB Atlas integration for cloud storage
- 🌐 RESTful API structure
- 🎨 React frontend with user-friendly UI (customizable)

---

## 🛠️ Getting Started

These instructions will get your project up and running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Chathura1109/task-manager-app.git
cd task-manager-app
```

---

## 📦 Backend Setup

### Step 1: Navigate to the backend directory

```bash
cd backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

-Create a Free MongoDB Atlas Account

-Create a Free Tier Cluster --> Click "Connect" --> Copy the connection string

> Replace `your_mongodb_atlas_connection_string` with your database password

-After your cluster is ready, click "Database Access" --> Click “+ Add New Database User”

-Then allow Network Access

### Step 4: Run the backend server

```bash
npm run dev
```

> The backend server will start on [http://localhost:5000]

---

## 🌐 Frontend Setup

### Step 1: Navigate to the frontend directory

```bash
cd ../frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the React development server

```bash
npm start
```

> The frontend will be accessible at [http://localhost:3000]

---

## 📂 Project Structure

```
task-manager-app/
├── backend/
|   |__ config/database.js
│   ├── middleware/auth.js
│   ├── models/Task.js & User.js
│   ├── node_modules/
│   ├── routes/auth.js & tasks.js
│   ├── .env
│   └── server.js
|
└── frontend/
    ├── src/
    │   ├── components/ (Auth/, Tasks/, Layout/)
    │   ├── pages/ (Login.js, Register.js, Dashboard.js)
    │   ├── services/api.js
    │   ├── context/AuthContext.js
    │   └── App.js
    └── package.json
└── README.md
```

---

## 📬 API Endpoints

(Used THUNDER CLIENT to test)

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/auth/register | Register new user    |
| POST   | /api/auth/login    | User login           |
| GET    | /api/tasks         | Get all user's tasks |
| POST   | /api/tasks         | Create a new task    |
| PUT    | /api/tasks/:id     | Update existing task |
| DELETE | /api/tasks/:id     | Delete task          |

Ex URL-: http://localhost:5000/api/auth/login

> ✅ Endpoints require a valid JWT token in the `Authorization` header.

Ex -: 🔍Get Single Task
GET [http://localhost:5000/api/tasks/TASK_ID_HERE]

      Headers
      Authorization: Bearer YOUR_JWT_TOKEN_HERE

---

## 🌍 Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
```

---

## ✅ Example Usage

### Signup

```http
POST /api/users/signup
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

### Auth Header Format (JWT)

```http
Authorization: Bearer <your_token>
```

---

## 💡 Future Improvements

- Password reset functionality
- Task prioritization
- Toogle dark mode

---

## 👨‍💻 Author

- GitHub: [@Chathura1109](https://github.com/Chathura1109)

---
