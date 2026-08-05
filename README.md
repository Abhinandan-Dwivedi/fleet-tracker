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
