import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Home, UtensilsCrossed } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50/50 via-background to-amber-50/20 px-4 text-center">
      {/* Glow / Resplandor de fondo */}
      <div className="pointer-events-none absolute -z-10 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="max-w-md space-y-6">
        {/* Badge / Icono animado */}
        <div className="relative mb-2 inline-flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
          <UtensilsCrossed className="h-12 w-12" />
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground shadow">
            !
          </span>
        </div>

        {/* Textos del error */}
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            ¡Ups! Se nos quemó la hamburguesa
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            La página que buscas no está en el menú, o tal vez se la comió el repartidor por el camino.
          </p>
        </div>

        {/* Botones de acción adaptados a TanStack Router */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <Button
            asChild
            className="w-full bg-amber-600 font-medium text-white shadow-md transition-all hover:bg-amber-700 sm:w-auto"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
        </div>

        <p className="pt-6 text-xs text-muted-foreground/60">
          ¿Crees que esto es un error? Contacta con el equipo de soporte.
        </p>
      </div>
    </div>
  )
}