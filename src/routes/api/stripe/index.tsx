import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const Route = createFileRoute('/api/stripe/')({
  server: {
    handlers: {
        GET: async () => {
            return Response.json({ message: 'Stripe API is working!' })
        }
    },
  },
})