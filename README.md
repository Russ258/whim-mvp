# Whim MVP

Last-minute salon booking experience built with Next.js (App Router), Prisma + SQLite, Tailwind, and server actions. The project ships three faces of Whim:

- **Consumer shell** – landing hero, deal discovery, booking flow, past/upcoming bookings, saved cards, and notification opt-in
- **Salon dashboard** – role-gated ops panel with daily calendar, slot management, and live stats
- **Admin back office** – CRUD for salons/services, booking overrides, and promo code management

## Tech stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS (v4) with custom design tokens
- Prisma ORM with SQLite storage
- Server Actions for booking, auth, ops, and notification flows
- Lucide icons, date-fns utilities

## Getting started

```bash
npm install
npm run db:migrate   # runs `prisma migrate dev`
npm run db:seed      # loads sample salons, services, slots, bookings, promos
npm run dev
```

The app boots at [http://localhost:3000](http://localhost:3000).

## Demo identities

Use the lightweight role switcher at `/login` to toggle between personas. Passcodes are baked in for quick testing:

| Role | Passcode | Notes |
| --- | --- | --- |
| Consumer | _none_ | Default landing + booking journey (Harper Bloom as demo user) |
| Salon | `salon-daypass` | Unlocks `/salon` dashboard with slot creation + stats |
| Admin | `admin-daypass` | Unlocks `/admin` for CRUD, overrides, and promo tools |

## Feature tour

### Consumer experience
- Hero/landing story with CTA, featured partners, and brand styling
- Location picker + time filter (Now, Next 2h, Today) that narrows live deals
- Deal feed cards surface salon rating, distance, pricing, and slot metadata
- Booking drawer simulates payment, confirms, and logs an email stub on the server
- `/bookings` aggregates upcoming vs past visits plus saved payment cards
- `/profile` offers notification opt-in (push/email + SMS) persisted to Prisma and shortcuts into other portals
- Bottom navigation for a mobile-first shell

### Salon dashboard
- Auth gated via role cookie (set on `/login`)
- KPIs for slots filled today, Whim-driven revenue, and live listings
- Daily calendar and slot list for the active salon (switch between demo salons)
- Form to publish last-minute slots (service, time, discount, price)
- Quick action form to update/cancel slot status

### Admin back office
- Role gate identical to salon view
- Forms to create salons, attach services, and register promo codes
- Manual override block to approve/refund/adjust booking + payment states
- Snapshot panels for bookings, services, and promo toggles

## Tooling & formatting

- `npm run lint` – ESLint (Next core web vitals profile)
- `.prettierrc` ships opinionated formatting defaults
- Prisma helpers: `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`

## Extending

- Real auth can slot into the role cookie utility located in `src/app/actions/auth.ts`
- Replace email/payment mocks by wiring `createBookingAction` to real services
- Swap SQLite for Postgres by changing `prisma/schema.prisma` + datasource URL

Have fun exploring Whim! 🎉
