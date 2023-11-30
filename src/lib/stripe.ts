import Stripe from 'stripe'

const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? ''

export const stripe = new Stripe(stripeSecretKey, {
  appInfo: {
    name: 'Ignite Shop',
  },
})
