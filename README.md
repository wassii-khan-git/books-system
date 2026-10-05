An Electron application with React and TypeScript

# Bookstore Management System

A cross-platform desktop application for running a bookstore: managing the catalogue and inventory, selling at the counter, and printing invoices. Built with Electron, React and TypeScript on a PostgreSQL database, and packaged for Windows, macOS and Linux.

![Dashboard](docs/screenshots/dashboard.png)

## Features

- **Catalogue and inventory:** manage titles, categories and publishers, with stock tracked per title.
- **Point of sale:** create sales at the counter and print invoices.
- **Admin dashboard:** browse records in tables with sorting, filtering and pagination.
- **Secure sign-in:** passwords are hashed, and authentication runs in Electron's main process, reached from the interface over IPC.
- **Cross-platform builds:** installers for Windows, macOS and Linux through electron-builder.

## Tech stack

| Area | Tools |
|---|---|
| Desktop | Electron, electron-vite, electron-builder |
| Interface | React 19, TypeScript, Tailwind CSS, shadcn/ui (Radix UI), lucide icons |
| State and data fetching | TanStack Query, Zustand |
| Tables and charts | TanStack Table, Recharts |
| Forms and validation | React Hook Form, Zod |
| Database | PostgreSQL, Prisma ORM with migrations |
| Auth | bcrypt password hashing, Electron IPC |
| Code quality | ESLint, Prettier, TypeScript type checks |

## Getting started

### Prerequisites

- Node.js 20 or later
- pnpm
- A running PostgreSQL database

### Setup

```bash
git clone https://github.com/wassii-khan-git/books-system.git
cd books-system
pnpm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bookstore"
```

Apply the database migrations, then start the app in development mode:

```bash
npx prisma migrate dev
pnpm dev
```

### Build installers

```bash
pnpm build:win     # Windows
pnpm build:mac     # macOS
pnpm build:linux   # Linux
```

## Project structure

```
src/
  main/       Electron main process: database access, authentication, IPC handlers
  preload/    Secure bridge between the main process and the interface
  renderer/   React interface
prisma/       Database schema and migrations
```

## Author

**Waseem Khan**, Software Engineer (Full Stack)
[LinkedIn](https://www.linkedin.com/in/waseem-khan-5a9393214) · [GitHub](https://github.com/wassii-khan-git)
