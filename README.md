# Image Processing Project

A full-stack project for file upload and image processing, featuring a TypeScript/Express backend and a Next.js frontend.

---

## Project Structure

```
image-processing/
├── backend/   # TypeScript Express server (API, file upload, processing)
├── frontend/  # Next.js app (UI for file upload and results)
└── README.md  # Project overview (this file)
```

---

## Backend (Express + TypeScript)

A modern Node.js backend server built with TypeScript and Express.js.

**Features:**
- TypeScript for type safety
- Express.js framework
- Security middleware (Helmet)
- CORS enabled
- Request logging (Morgan)
- Hot reloading in development
- File upload and processing (Multer)

**Setup:**
1. `cd backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   The server runs at `http://localhost:3000`

**Production:**
- Build: `npm run build`
- Start: `npm start`

**API Example:**
- `POST /api/files/upload` — Upload a file

**More details:** See [`backend/README.md`](./backend/README.md)

---

## Frontend (Next.js)

A React-based frontend built with Next.js, bootstrapped using `create-next-app`.

**Setup:**
1. `cd frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:3000`

**Editing:**
- Main page: `src/app/page.tsx`
- Layout: `src/app/layout.tsx`
- Global styles: `src/app/globals.css`

**More details:** See [`frontend/README.md`](./frontend/README.md)

---

## Development Workflow

- Run backend and frontend separately in their respective folders.
- Both default to port 3000; change one if running simultaneously.
- Use the backend for API/file upload, and the frontend for user interaction.

---

## License

MIT
