# 📚 Trilha de Estudos

A full-stack mobile application for organizing and tracking study trails. Create learning paths, add content (articles, videos, courses), and track your progress — all from your phone.

---

## 🛠️ Technologies

### Backend
| Technology | Purpose |
|---|---|
| **NestJS** | Node.js framework for building the REST API |
| **Prisma ORM** | Database access & migrations |
| **PostgreSQL** | Relational database |
| **JWT (JSON Web Tokens)** | Stateless authentication |
| **bcrypt** | Secure password hashing |
| **class-validator** | DTO validation on all endpoints |
| **Docker & Docker Compose** | Containerized infrastructure |

### Mobile App
| Technology | Purpose |
|---|---|
| **React Native** (via Expo SDK 54) | Cross-platform mobile UI |
| **Expo Router v6** | File-based routing & navigation |
| **TypeScript** | Type safety across the entire codebase |
| **Axios** | HTTP client with JWT interceptors |
| **AsyncStorage** | Persistent local token & user storage |
| **React Native Gesture Handler** | Swipe-to-delete interactions |
| **React Native Reanimated** | Smooth animations |

---

## 🎨 About the UI

> **AI-assisted design** — Tools such as AI coding assistants were used to help design the interface layout and select the color palette. The dark theme (`#121214` background, `#00D287` primary accent) was refined with AI suggestions.
>
> **The main focus was on business logic and user experience (UX)**, including:
> - Smooth swipe-to-delete gestures with haptic-style feedback
> - Pull-to-refresh and infinite scrolling with pagination
> - JWT-based auth flow with automatic session recovery on app startup
> - Modal forms for creating/editing trails and content
> - Progress tracking with visual completion indicators

---

## 📂 Project Structure

```
APP_TrilhaEstudos/
├── docker-compose.yml          # Full-stack orchestration
├── README.md
│
├── backend/                    # NestJS API
│   ├── Dockerfile
│   ├── entrypoint.sh           # Auto migrations + seed on startup
│   ├── prisma/
│   │   ├── schema.prisma       # Data models
│   │   └── seed.ts             # Default user & sample data
│   └── src/
│       ├── auth/               # JWT auth module
│       ├── trilhas/            # Trails CRUD module
│       ├── conteudos/          # Content CRUD module
│       └── prisma/             # Prisma service module
│
└── trilha-estudos-app/         # Expo / React Native app
    ├── app/                    # File-based routing (Expo Router)
    │   ├── _layout.tsx         # Root Stack navigator
    │   ├── index.tsx           # Auth check → redirect
    │   ├── (auth)/             # Login & Register screens
    │   └── (main)/trilhas/     # Trail list & detail screens
    └── src/
        ├── components/         # Reusable UI components
        ├── services/           # API service layer (Axios)
        ├── theme/              # Color palette & design tokens
        └── types/              # TypeScript interfaces
```

---

## 🚀 How to Run

### Prerequisites

- **Node.js** ≥ 18
- **Docker** & **Docker Compose** (for the database and backend)
- **Expo CLI** — installed globally or via `npx`
- **Android Emulator** (Android Studio) or **physical device** with [Expo Go](https://expo.dev/go)

---

### Option 1: Docker (recommended — single command)

This starts the **database**, runs **migrations + seed**, and starts the **backend** — all in one command:

```bash
# From the project root
docker-compose up --build
```

Then start the mobile app separately:

```bash
cd trilha-estudos-app
npm install
npx expo start
```

> **Note:** The Expo/React Native app runs on your development machine (or emulator), not inside Docker, since it needs access to the native build toolchain.

---

### Option 2: Manual setup (without Docker)

#### 1. Start the database

You can use the existing docker-compose inside `/backend` for just the database:

```bash
cd backend
docker-compose up -d
```

Or point to any PostgreSQL instance and adjust the `.env` file accordingly.

#### 2. Setup the backend

```bash
cd backend
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database with sample data
npx ts-node prisma/seed.ts

# Start the API in development mode
npm run start:dev
```

The API will be available at `http://localhost:3000`.

#### 3. Setup the mobile app

```bash
cd trilha-estudos-app
npm install
npx expo start
```

---

### Connecting the App to the Backend

The mobile app is pre-configured to connect to `http://10.0.2.2:3000` (Android Emulator default). If you're running on a **physical device**, update the `API_URL` in:

```
trilha-estudos-app/src/services/api.ts
```

Replace `10.0.2.2` with your machine's local IP address (run `ipconfig` on Windows or `ifconfig` on Mac/Linux to find it).

---

### Running on Emulator vs Physical Device

| Scenario | Command | API URL |
|---|---|---|
| **Android Emulator** | `npx expo start --android` | `http://10.0.2.2:3000` (default) |
| **Physical device (Expo Go)** | `npx expo start` → scan QR code | `http://<YOUR_LOCAL_IP>:3000` |
| **iOS Simulator** | `npx expo start --ios` | `http://localhost:3000` |

---

## 🔐 Default Test User

After running the seed, a default user is available for testing:

| Field | Value |
|---|---|
| **Email** | `admin@admin.com` |
| **Password** | `123123` |

---

## 🗄️ pgAdmin (optional)

If using Docker, pgAdmin is available at [http://localhost:5050](http://localhost:5050):

| Field | Value |
|---|---|
| **Email** | `admin@admin.com` |
| **Password** | `admin` |

To connect to the database from pgAdmin, add a new server with:
- **Host**: `db`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `123`

---

## 📋 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/trilhas?page=1&limit=10` | List user trails (paginated) | ✅ |
| `GET` | `/trilhas/:id` | Get trail details | ✅ |
| `POST` | `/trilhas` | Create a new trail | ✅ |
| `PATCH` | `/trilhas/:id` | Update a trail | ✅ |
| `DELETE` | `/trilhas/:id` | Delete a trail | ✅ |
| `GET` | `/conteudos/trilha/:trilhaId` | List content by trail | ✅ |
| `POST` | `/conteudos` | Create content | ✅ |
| `PATCH` | `/conteudos/:id` | Update content | ✅ |
| `PATCH` | `/conteudos/:id/toggle` | Toggle completion status | ✅ |
| `DELETE` | `/conteudos/:id` | Delete content | ✅ |

---

## 💡 Possible Improvements

- **Drag-and-drop** for reordering trails and content items
- **Custom error handling** with user-friendly error screens and toast notifications
- **Better logging** — structured logging (e.g., Winston/Pino) on the backend with request tracing
- **Automated tests** — unit tests for services, integration tests for controllers, and E2E tests for critical flows
- **Offline support** — cache trails locally and sync when connectivity is restored
- **Search & filters** — filter trails by status, search content by title
- **User profile** — edit name, change password, avatar
- **Push notifications** — reminders to continue studying

---

## 📄 License

This project is private and unlicensed.
