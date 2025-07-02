# TypeScript Express Server

A modern Node.js backend server built with TypeScript and Express.js.

## Features

- ⚡ TypeScript for type safety
- 🚀 Express.js framework
- 🔒 Security middleware (Helmet)
- 🌐 CORS enabled
- 📝 Request logging (Morgan)
- 🔄 Hot reloading in development
- 🏗️ Production build support
- 📁 File upload and processing (Multer)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server with hot reloading:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run clean` - Clean the dist folder

## API Endpoints

- `POST /api/files/upload` - Upload a file (see file upload routes)

## Project Structure

```
├── src/
│   ├── config/           # Configuration files (logger, multer, etc.)
│   ├── contorller/       # Controllers (file.controller.ts, types/)
│   ├── helper/           # Helper utilities (error.helper.ts, mapper.ts)
│   ├── repository/       # Data access layer (empty or add your repos)
│   ├── route/            # Route definitions
│   │   ├── fileRoutes/   # File-related routes
│   │   └── index.ts      # Main route entry
│   ├── service/          # Business logic (file.service.ts)
│   └── index.ts          # Main server file
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── nodemon.json          # Development server configuration
└── README.md             # This file
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Adding New Routes

Create new route files in the `src/route/` directory and import them in `src/index.ts`.

Example:
```typescript
// src/route/users.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

export default router;
```

Then import and use in `src/index.ts`:
```typescript
import usersRouter from './route/users';
app.use('/api/users', usersRouter);
```

## File Upload & Processing

File upload endpoints are available under `/api/files/`. The server uses Multer for handling file uploads. See `src/config/multer.ts` for configuration and `src/contorller/file.controller.ts` for implementation details.

---