// routes/hello.ts
import { createFileRoute } from '@tanstack/react-router'
import { MENU_ITEMS } from '@/lib/menu-catalog'

export const Route = createFileRoute('/api/menu/')({
    server: {
        handlers: {
            GET: async () => {

                await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate a delay

                return Response.json({
                    menu: MENU_ITEMS,
                })
            },
        },
    },
})