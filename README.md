# FleetTrack — Real-Time Fleet Tracking & Delivery Management
 
A full-stack, multi-tenant SaaS platform giving logistics companies real-time visibility into their delivery fleet. Dispatchers track deliveries live on a map, and customers get a public, no-login tracking link built on a strictly typed, security-first architecture.
 
**Repo:** `https://github.com/Abhinandan-Dwivedi/fleet-tracker`
**Live Demo:** _ _ _
 
---
 
## Tech Stack
 
**Next.js** (App Router) · **TypeScript** (strict) · **tRPC** · **Prisma** + **PostgreSQL** · **NextAuth (Auth.js v5)** · **Pusher** (WebSockets) · **Leaflet** · **Zod** · **Vitest** · **Tailwind CSS**
 
---
 
## Architecture Highlights
 
- **Multi-tenant isolation, enforced in 3 layers** - route middleware, tRPC procedure tiers (public/protected/staff), and Prisma queries all filter by `companyId` from the verified session, never client input.
- **Server-enforced delivery state machine** - a strict 5-stage lifecycle (`PENDING → ASSIGNED → IN_TRANSIT → DELIVERED/FAILED`); invalid transitions are rejected regardless of what the client sends.
- **Real-time, tenant-scoped fan-out** - driver locations broadcast over company-specific Pusher channels, so dispatchers see live movement instantly with zero cross-tenant leakage.
---
 
## Features
 
- Role-based dashboards for dispatcher, fleet manager, and customer roles
- Live fleet map with real-time driver location updates
- Delivery creation, assignment, and validated status transitions
- Public, authentication-free tracking page with field-level data minimization
- 11 automated tests covering state machine logic and tenant isolation
---
## Getting Started
 
```bash
git clone https://github.com/Abhinandan-Dwivedi/fleet-tracker.git 
cd fleet-tracker
pnpm install
 
docker run --name fleet-tracker-db \
  -e POSTGRES_PASSWORD=password -e POSTGRES_DB=fleet_tracker \
  -p 5432:5432 -v fleet-tracker-data:/var/lib/postgresql/data -d postgres:16
```
 
Create a `.env` file:
 
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/fleet_tracker"
AUTH_SECRET="generate-with-npx-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
PUSHER_APP_ID="..."
PUSHER_KEY="..."
PUSHER_SECRET="..."
PUSHER_CLUSTER="..."
NEXT_PUBLIC_PUSHER_KEY="..."
NEXT_PUBLIC_PUSHER_CLUSTER="..."
```
 
```bash
npx prisma migrate dev
npx prisma db seed
pnpm dev
```
 
| Role | Email |
|---|---|
| Dispatcher | `dispatcher@acme.com` |
| Fleet Manager | `manager@acme.com` |
| Customer | `customer@acme.com` |
 
**Run tests:** `pnpm test`
 
---
 
## Roadmap
 
- [ ] Fleet manager analytics dashboard
- [ ] Real-time alerting (delays, geofencing, offline drivers)
- [ ] CI pipeline + production deployment
---
