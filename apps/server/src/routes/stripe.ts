import { Router, Request, Response } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
})

export const stripeRouter = Router()

/**
 * POST /api/stripe/connect/onboard
 * Creates a Stripe Connect account for a salon and returns an onboarding link.
 * The salon completes KYC/bank setup via Stripe-hosted onboarding.
 *
 * Body: { email: string, salonName: string }
 */
stripeRouter.post('/connect/onboard', async (req: Request, res: Response) => {
  const { email, salonName } = req.body as { email: string; salonName: string }

  if (!email || !salonName) {
    return res.status(400).json({ error: 'email and salonName are required' })
  }

  try {
    // Create a Standard or Express connected account
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: { name: salonName },
    })

    // Generate an onboarding link (redirect the salon owner here)
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.APP_URL ?? 'http://localhost:3000'}/onboarding/refresh`,
      return_url: `${process.env.APP_URL ?? 'http://localhost:3000'}/onboarding/complete`,
      type: 'account_onboarding',
    })

    return res.json({ accountId: account.id, onboardingUrl: accountLink.url })
  } catch (err) {
    console.error('[stripe/connect/onboard]', err)
    return res.status(500).json({ error: 'Failed to create Connect account' })
  }
})

/**
 * GET /api/stripe/connect/account/:accountId
 * Retrieves the current status of a salon's Connect account.
 */
stripeRouter.get('/connect/account/:accountId', async (req: Request, res: Response) => {
  const { accountId } = req.params

  try {
    const account = await stripe.accounts.retrieve(accountId)
    return res.json({
      id: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    })
  } catch (err) {
    console.error('[stripe/connect/account]', err)
    return res.status(500).json({ error: 'Failed to retrieve account' })
  }
})

/**
 * POST /api/stripe/payouts/transfer
 * Transfers funds from the platform to a salon's Connect account.
 * Use after a booking is completed and funds are ready to disburse.
 *
 * Body: { destinationAccountId: string, amountCents: number, currency?: string }
 */
stripeRouter.post('/payouts/transfer', async (req: Request, res: Response) => {
  const { destinationAccountId, amountCents, currency = 'usd' } = req.body as {
    destinationAccountId: string
    amountCents: number
    currency?: string
  }

  if (!destinationAccountId || !amountCents) {
    return res.status(400).json({ error: 'destinationAccountId and amountCents are required' })
  }

  try {
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency,
      destination: destinationAccountId,
    })

    return res.json({ transferId: transfer.id, status: 'transferred' })
  } catch (err) {
    console.error('[stripe/payouts/transfer]', err)
    return res.status(500).json({ error: 'Transfer failed' })
  }
})

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events. Verify signature before processing.
 * Register this URL in your Stripe dashboard.
 */
stripeRouter.post('/webhook', (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed', err)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  switch (event.type) {
    case 'account.updated': {
      const account = event.data.object as Stripe.Account
      console.log(`[webhook] account.updated: ${account.id}`)
      // TODO: update salon record in DB with charges_enabled / payouts_enabled
      break
    }
    case 'transfer.created': {
      const transfer = event.data.object as Stripe.Transfer
      console.log(`[webhook] transfer.created: ${transfer.id}`)
      // TODO: mark booking payout as disbursed in DB
      break
    }
    default:
      console.log(`[webhook] Unhandled event: ${event.type}`)
  }

  return res.json({ received: true })
})
