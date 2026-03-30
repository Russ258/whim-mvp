import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { stripeRouter } from './routes/stripe'
import { healthRouter } from './routes/health'

const app = express()
const PORT = process.env.PORT ?? 4000

// Raw body needed for Stripe webhook signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(cors())

app.use('/api/health', healthRouter)
app.use('/api/stripe', stripeRouter)

app.listen(PORT, () => {
  console.log(`Whim server running on http://localhost:${PORT}`)
})

export default app
