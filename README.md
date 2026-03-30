# Whim MVP

Beauty, on demand. A monorepo containing the Whim mobile app and backend API.

```
whim-mvp/
├── apps/
│   ├── mobile/      # Expo React Native (iOS + Android)
│   └── server/      # Node.js + Express API
├── packages/
│   └── eslint-config/  # Shared ESLint rules
├── tsconfig.base.json
├── .prettierrc
└── .eslintrc.js
```

## Prerequisites

- **Node.js** 20+
- **Yarn** 1.x (classic) — `npm install -g yarn`
- **Expo CLI** — `npm install -g expo-cli`
- **Xcode** (iOS simulator) or **Android Studio** (Android emulator)
- A [Stripe](https://stripe.com) account with Connect enabled

## Setup

```bash
# Install all workspace dependencies from the root
yarn install
```

### Server environment

```bash
cd apps/server
cp .env.example .env
# Edit .env and fill in your Stripe test keys
```

## Running the apps

### Mobile (Expo)

```bash
# From root
yarn mobile

# Or target a specific platform
yarn workspace @whim/mobile ios
yarn workspace @whim/mobile android
```

Scan the QR code with **Expo Go** on your device, or press `i` / `a` for the simulator.

### Server

```bash
# From root — starts with hot reload via ts-node-dev
yarn server
```

The API will be available at `http://localhost:4000`.

Health check: `GET http://localhost:4000/api/health`

## Stripe Connect API

All routes are prefixed with `/api/stripe`.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/connect/onboard` | Create a salon Connect account + return onboarding URL |
| `GET` | `/connect/account/:accountId` | Get salon's payout/charges status |
| `POST` | `/payouts/transfer` | Transfer funds to a salon's Connect account |
| `POST` | `/webhook` | Stripe webhook receiver (register in Stripe dashboard) |

### Onboarding a salon (example)

```bash
curl -X POST http://localhost:4000/api/stripe/connect/onboard \
  -H 'Content-Type: application/json' \
  -d '{"email": "owner@salon.com", "salonName": "Glam Studio"}'
```

Returns `{ accountId, onboardingUrl }` — redirect the salon owner to `onboardingUrl` to complete KYC.

### Webhook setup

In the Stripe Dashboard → Developers → Webhooks, add an endpoint:
- **URL**: `https://your-domain.com/api/stripe/webhook`
- **Events**: `account.updated`, `transfer.created`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET` in your `.env`.

For local testing use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

## Linting & formatting

```bash
yarn lint      # ESLint across all workspaces
yarn format    # Prettier write
```

## Building for production

```bash
# Server
yarn workspace @whim/server build   # outputs to apps/server/dist/

# Mobile — use EAS Build
yarn workspace @whim/mobile eas build --platform all
```
