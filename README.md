# RentExpress 🚗

A full-stack vehicle rental management system built for Nepal, allowing users to browse, book, and manage vehicle rentals with a complete admin dashboard for fleet management.

## Features

- **User Authentication** — Register, login, JWT-based sessions, forgot/reset password via email
- **Vehicle Browsing** — Search, filter by category/price/availability, detailed vehicle pages
- **Booking Flow** — Multi-step booking (confirm → review → confirmed) with real-time price calculation
- **Favourites** — Save vehicles for later
- **Reviews** — Rate and review vehicles after booking
- **Admin Dashboard** — Full CRUD for vehicles, categories, brands, bookings, users, and reviews
- **AI Chatbot (Wall-E)** — Gemini-powered assistant for customer questions
- **Rate Limiting** — Brute-force protection on login/register endpoints
- **Comprehensive Testing** — 137 Jest unit/integration tests (backend) + 52 Playwright E2E tests (frontend)

## Tech Stack

**Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Sonner

**Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, bcrypt, Nodemailer, express-rate-limit

**Testing:** Jest, Supertest (backend) · Playwright (frontend E2E)

**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

## Architecture

The backend follows a layered architecture: **Routes → Controllers → Services → Repositories → Models**, with Middleware, DTOs, and Exceptions providing consistent authentication, validation, and error handling.

The frontend follows a **Component → Server Action → API layer → Axios** pattern, with Server Components handling data fetching and Server Actions handling mutations, keeping most logic off the client.

## Project Structure

```
rent-express-web-api/
├── backend/          # Express API server
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       └── __tests__/
└── frontend/          # Next.js application
    └── src/
        ├── app/
        ├── lib/
        │   ├── api/
        │   └── actions/
        └── e2e/       # Playwright tests
```

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Requires a `.env` file in each folder — see `.env.example` for required variables (MongoDB URI, JWT secret, email credentials, Gemini API key, etc.).

## Testing

```bash
# Backend (Jest)
cd backend
npm test -- --coverage

# Frontend (Playwright)
cd frontend
npx playwright test
```

## Author

Built by Anisha G.C— coursework project for ST6003CEM Web API Development, Softwarica College (Coventry University).
```

