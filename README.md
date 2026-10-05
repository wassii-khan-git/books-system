# Bookstore Management System

Desktop software for managing a bookstore's catalogue, inventory, counter sales and printed invoices. Built with Electron, React 19, TypeScript, Tailwind CSS and PostgreSQL through Prisma 7.

![Bookstore dashboard showing sales, orders, products and customers](docs/screenshots/dashboard.png)

## Requirements

- Node.js 24 LTS (also supports Node 22.12+ or 20.19+).
- pnpm 10.33.0, the version pinned in `package.json`: `npm install --global pnpm@10.33.0`.
- A running PostgreSQL server and a database for this app.
- Internet access during installation to download packages and Electron's desktop binary.

## Run on Windows (PowerShell)

From the repository directory:

```powershell
pnpm.cmd install
# Only copy this file if you do not already have a .env:
Copy-Item .env.example .env
```

Edit `.env` with your PostgreSQL connection and the administrator credentials you want to use:

`.env` stays local and is ignored by Git. Commit `.env.example` with placeholders when documenting new settings. Dependencies, generated Prisma code, build output, caches and logs are also ignored.

```dotenv
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/bookstore"
SEED_ADMIN_NAME="Bookstore Admin"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="YOUR_OWN_PASSWORD"
```

Create the `bookstore` database first, for example in pgAdmin or with `createdb -U postgres bookstore`. Percent-encode special characters in the database username/password when putting them in the connection URL.

Then initialize the database and launch the desktop app:

```powershell
pnpm.cmd db:setup
pnpm.cmd dev
```

Sign in with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. Seeding creates the administrator only when that email does not exist; rerunning it does not change existing passwords or insert sample inventory. If you already have an account, use `pnpm.cmd db:generate` and `pnpm.cmd db:migrate` instead of `db:setup`.

`db:setup` generates the Prisma client, applies the checked-in migrations and creates the administrator. It needs a reachable PostgreSQL database. `dev` regenerates the client and starts Electron with hot reload. After initial setup, just run `pnpm.cmd dev`. Stop development with Ctrl+C.

The `.cmd` suffix avoids PowerShell's "pnpm.ps1 cannot be loaded" execution-policy error. On macOS/Linux, or shells that allow the pnpm script, use `pnpm` instead of `pnpm.cmd`.

## Recover from the Electron download timeout

The old configuration forced downloads through `npmmirror.com`. The repository now uses Electron's default GitHub release download source, including when packaging. Electron's binary download is separate from the npm package registry download.

After pulling these changes, retry:

```powershell
pnpm.cmd install
pnpm.cmd electron:install
pnpm.cmd dev
```

`electron:install` explicitly retries a missing binary download after a partially completed install; it exits immediately if the matching binary is already installed. Do not skip Electron's install script: the desktop app needs that binary.

If a timeout still occurs, check your network/firewall access to GitHub release downloads. Check for old mirror overrides with `pnpm.cmd config get electron_mirror` and `$env:ELECTRON_MIRROR`. Environment variables or your user-level `.npmrc` can override this repository's defaults. Only use a custom mirror if it is reachable and trusted; Electron supports the `ELECTRON_MIRROR` environment variable. See [Electron's installation documentation](https://www.electronjs.org/docs/latest/tutorial/installation).

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Generate Prisma client and launch development app |
| `pnpm db:generate` | Generate the client without changing database data |
| `pnpm db:migrate` | Apply the checked-in database migrations |
| `pnpm db:migrate:dev` | Create migrations when changing the schema during development |
| `pnpm db:seed` | Create the initial administrator from `.env` |
| `pnpm db:setup` | Generate, migrate and seed |
| `pnpm typecheck` | Check main process and renderer TypeScript |
| `pnpm lint` | Run ESLint |
| `pnpm build` | Generate client, typecheck and build application code |
| `pnpm start` | Preview an existing build (run `pnpm build` first) |
| `pnpm build:unpack` | Build an unpacked desktop application |
| `pnpm build:win` | Build a Windows installer |
| `pnpm build:mac` | Build a macOS package |
| `pnpm build:linux` | Build Linux packages |

Build on the target operating system; macOS signing requires macOS. Build output goes to `out/`; packaged artifacts go to `dist/`. Packaging excludes `.env`, so an installed application must receive `DATABASE_URL` through its runtime environment. Database setup is separate from building an installer.

Current validation: dependency installation, Prisma generation and database migrations succeed. Development launches, but production builds currently fail on existing TypeScript errors in the sales services and renderer components. ESLint also reports existing errors; those need to be resolved before treating an installer as release-ready.

## Project structure

```text
src/main/       Electron main process, database services and IPC controllers
src/preload/    Bridge between Electron and the React interface
src/renderer/   React pages, components and state
src/generated/  Generated Prisma client (ignored by Git)
prisma/         Database schema, migrations and administrator seed
resources/      Application resources
build/          Installer icons and platform resources
```

Features include category/company management, book inventory, sales, invoices, dashboard tables and password-based sign-in. Data fetching uses TanStack Query; tables use TanStack Table; forms use React Hook Form and Zod; passwords use bcrypt.

## Author

**Waseem Khan** — [GitHub](https://github.com/wassii-khan-git) | [LinkedIn](https://www.linkedin.com/in/waseem-khan-5a9393214)
