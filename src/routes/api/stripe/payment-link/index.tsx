import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { MENU_ITEMS } from '@/lib/menu-catalog'
import type { MenuItem } from '@/lib/menu-catalog'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

type RequestedCartItem = {
    product: MenuItem
    quantity: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function parseCartItems(value: unknown):
    | { items: RequestedCartItem[] }
    | { error: string } {
    if (!Array.isArray(value) || value.length === 0) {
        return { error: 'Agrega al menos un producto al carrito.' }
    }

    const items: RequestedCartItem[] = []
    const seenIds = new Set<number>()

    for (const entry of value) {
        if (!isRecord(entry)) {
            return { error: 'El formato de los productos no es válido.' }
        }

        const { id, quantity } = entry
        if (
            typeof id !== 'number' ||
            !Number.isSafeInteger(id) ||
            typeof quantity !== 'number' ||
            !Number.isSafeInteger(quantity) ||
            quantity < 1 ||
            quantity > 99
        ) {
            return { error: 'Cada producto debe tener un ID y una cantidad válida (1 a 99).' }
        }

        const product = MENU_ITEMS.find((item) => item.id === id)
        if (!product) {
            return { error: `El producto ${id} no existe en el menú.` }
        }

        if (seenIds.has(id)) {
            return { error: 'No repitas productos; indica la cantidad en una sola entrada.' }
        }

        seenIds.add(id)
        items.push({ product, quantity })
    }

    return { items }
}

export const Route = createFileRoute('/api/stripe/payment-link/')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                let body: unknown
                try {
                    body = await request.json()
                } catch {
                    return Response.json(
                        { error: 'El cuerpo de la solicitud debe ser JSON válido.' },
                        { status: 400 },
                    )
                }

                if (!isRecord(body)) {
                    return Response.json(
                        { error: 'El cuerpo de la solicitud no es válido.' },
                        { status: 400 },
                    )
                }

                const parsedCart = parseCartItems(body.items)
                if ('error' in parsedCart) {
                    return Response.json(
                        { error: parsedCart.error },
                        { status: 400 },
                    )
                }

                const lineItems = parsedCart.items.map(({ product, quantity }) => {
                    return {
                        price_data: {
                            currency: 'mxn',
                            product_data: {
                                name: product.name,
                                description: product.description,
                            },
                            unit_amount: Math.round(product.price * 100),
                        },
                        quantity,
                    }
                })

                try {
                    const paymentLink = await stripe.paymentLinks.create({
                        line_items: lineItems,
                        metadata: {
                            item_count: String(
                                parsedCart.items.reduce(
                                    (total, item) => total + item.quantity,
                                    0,
                                ),
                            ),
                        },
                        after_completion: {
                            type: 'redirect',
                            redirect: {
                                url: new URL('/menu?payment=success', request.url).toString(),
                            },
                        },
                    })

                    return Response.json({
                        id: paymentLink.id,
                        url: paymentLink.url,
                    })
                } catch (error) {
                    console.error('Stripe payment link error:', error)

                    return Response.json(
                        { error: 'No se pudo crear el link de pago.' },
                        { status: 500 },
                    )
                }
            },
        },
    },
})
