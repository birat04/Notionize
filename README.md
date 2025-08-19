# Notionize 🚀

A modern, full-stack productivity application inspired by Notion. Built with React, TypeScript, Express.js, and PostgreSQL. Organize your notes, todos, and projects in one beautiful, intuitive interface.

![Notionize Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Express](https://img.shields.io/badge/Express-5.1.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## ✨ Features

### 🎨 Modern UI/UX
- **Notion-like Design**: Clean, minimal interface with dark/light theme support
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback with toast notifications
- **Smooth Animations**: Polished interactions and transitions

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Session Management**: Persistent login state

### 📝 Todo Management
- **CRUD Operations**: Create, read, update, and delete todos
- **Real-time Editing**: Inline editing with keyboard shortcuts
- **Status Tracking**: Mark todos as complete/incomplete
- **Smart Filtering**: View all, completed, or pending todos
- **Timestamps**: Track creation and update times

### 📊 Dashboard Analytics
- **Task Statistics**: Total, completed, and pending task counts
- **Completion Rate**: Visual progress tracking
- **Activity Timeline**: Recent task activity
- **Performance Metrics**: Productivity insights

### 🏗️ Architecture
- **Microservices**: Separate frontend and backend services
- **RESTful API**: Clean, well-documented endpoints
- **Database ORM**: Prisma for type-safe database operations
- **Containerization**: Docker for easy deployment

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Zod** - Schema validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **Neon** - Cloud PostgreSQL hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/birat04/Notionize
cd Notionize
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/notionize"

# JWT Secret (change in production)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Frontend API URL
VITE_API_URL="http://localhost:3000"
```

### 3. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Manual Setup (Alternative)

#### Backend Setup
```bash
cd Backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

## 📁 Project Structure

```
Notionize/
├── Backend/                 # Express.js API server
│   ├── src/
│   │   └── index.ts        # Main server file
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   ├── package.json
│   └── dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── lib/            # Utility functions
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── dockerfile
├── compose.yaml            # Docker Compose configuration
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/me` - Get current user

### Todos
- `GET /todos` - Get all todos
- `POST /todos` - Create new todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

### Addresses
- `GET /addresses` - Get user addresses
- `POST /addresses` - Create new address

## 🎯 Key Features Explained

### Modern Authentication Flow
1. **Registration**: Users create accounts with username, email, and password
2. **Login**: Secure authentication with JWT tokens
3. **Session Management**: Automatic token refresh and logout
4. **Protected Routes**: Secure access to authenticated content

### Todo Management System
1. **Create**: Add new todos with titles and descriptions
2. **Read**: View all todos with filtering options
3. **Update**: Edit todo titles and toggle completion status
4. **Delete**: Remove todos with confirmation
5. **Real-time**: Instant UI updates with optimistic rendering

### Responsive Design
1. **Mobile-First**: Optimized for mobile devices
2. **Collapsible Sidebar**: Space-efficient navigation
3. **Touch-Friendly**: Large touch targets and gestures
4. **Adaptive Layout**: Flexible grid system

## 🔧 Development

### Running in Development Mode
```bash
# Backend development
cd Backend
npm run dev

# Frontend development
cd frontend
npm run dev
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Code Quality
```bash
# Lint frontend
cd frontend
npm run lint

# Type check
npm run build
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd Backend
npm run build
```

### Docker Production
```bash
# Build and run production containers
docker-compose -f compose.prod.yaml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Notion](https://notion.so)
- Icons by [Lucide](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Database with [Prisma](https://prisma.io)

---

**Made with ❤️ by the Notionize Team**

