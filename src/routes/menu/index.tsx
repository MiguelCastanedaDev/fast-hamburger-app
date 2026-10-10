import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowDown,
  Beef,
  Clock3,
  Flame,
  Leaf,
  LoaderCircle,
  Minus,
  Plus,
  Search,
  Sandwich,
  ShoppingBag,
  Utensils,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { MenuItem } from '@/lib/menu-catalog'

type MenuCategory = 'principal' | 'acompanamiento'
type MenuFilter = 'todo' | MenuCategory

const filters: { id: MenuFilter; label: string }[] = [
  { id: 'todo', label: 'Todo el menú' },
  { id: 'principal', label: 'Hamburguesas y más' },
  { id: 'acompanamiento', label: 'Acompañamientos' },
]

export const Route = createFileRoute('/menu/')({
  component: MenuPage,
})

async function fetchMenu(): Promise<MenuItem[]> {
  const response = await fetch('/api/menu')
  if (!response.ok) {
    throw new Error('No pudimos cargar el menú. Inténtalo de nuevo.')
  }

  const payload: { menu: MenuItem[] } = await response.json()
  if (!Array.isArray(payload.menu)) {
    throw new Error('La respuesta del menú no tiene el formato esperado.')
  }

  return payload.menu
}

function getCategory(item: MenuItem): MenuCategory {
  return /fries|rings|papas|aros/i.test(item.name)
    ? 'acompanamiento'
    : 'principal'
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price)
}

function isPaymentLinkResponse(
  value: unknown,
): value is { url?: unknown; error?: unknown } {
  return typeof value === 'object' && value !== null
}

function MenuPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<MenuFilter>('todo')
  const [cart, setCart] = useState<Record<number, number>>({})
  const { data: menu = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
  })
  const cartItems = menu.flatMap((item) => {
    const quantity = cart[item.id] ?? 0
    return quantity > 0 ? [{ item, quantity }] : []
  })
  const cartCount = cartItems.reduce((total, entry) => total + entry.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, entry) => total + entry.item.price * entry.quantity,
    0,
  )

  const checkout = useMutation({
    mutationFn: async (items: { id: number; quantity: number }[]) => {
      const response = await fetch('/api/stripe/payment-link', {
        method: 'POST',
        body: JSON.stringify({ items }),
        headers: { 'Content-Type': 'application/json' },
      })
      const result: unknown = await response.json()

      if (!isPaymentLinkResponse(result) || !response.ok || typeof result.url !== 'string') {
        throw new Error(
          isPaymentLinkResponse(result) && typeof result.error === 'string'
            ? result.error
            : 'No se pudo iniciar el pago. Inténtalo de nuevo.',
        )
      }

      return result.url
    },
    onSuccess: (url) => {
      window.location.assign(url)
    },
  })

  function updateQuantity(id: number, change: number) {
    setCart((currentCart) => {
      const nextQuantity = Math.min(99, (currentCart[id] ?? 0) + change)
      const nextCart = { ...currentCart }

      if (nextQuantity <= 0) {
        delete nextCart[id]
      } else {
        nextCart[id] = nextQuantity
      }

      return nextCart
    })
  }

  const visibleMenu = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()

    return menu.filter((item) => {
      const matchesFilter =
        activeFilter === 'todo' || getCategory(item) === activeFilter
      const matchesSearch =
        !normalizedSearch ||
        `${item.name} ${item.description}`
          .toLocaleLowerCase()
          .includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, menu, search])

  const emptyMenuMessage = (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#e4d2d5] bg-white/50 px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#f8e8eb] text-[#a83445]">
        <Utensils className="size-5" />
      </span>
      <h3 className="text-lg font-extrabold">No encontramos ese antojo</h3>
      <p className="mt-2 text-sm text-[#817477]">
        Prueba otra búsqueda o cambia el filtro para ver más opciones.
      </p>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          setSearch('')
          setActiveFilter('todo')
        }}
        className="mt-3 text-[#8f2635]"
      >
        Ver todo el menú
      </Button>
    </div>
  )

  return (
    <main className="min-h-screen px-4 pb-20 pt-8 text-[#382326] sm:px-6 sm:pt-12">
      <div className="mx-auto w-full max-w-6xl">
        <section className="relative isolate overflow-hidden rounded-4xl bg-[#58151d] px-6 py-10 text-white shadow-[0_24px_70px_-30px_rgba(88,21,29,0.7)] sm:px-12 sm:py-14 lg:px-16">
          <div className="absolute -right-16 -top-24 -z-10 size-80 rounded-full bg-[#fb7185]/20 blur-3xl" />
          <div className="absolute -bottom-36 right-1/4 -z-10 size-72 rounded-full bg-[#e0a154]/15 blur-3xl" />
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#fecdd3]">
                <span className="size-2 rounded-full bg-[#fb7185]" />
                Sabor hecho al momento
              </div>
              <h1 className="display-title text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                El menú
                <br />
                <span className="text-[#fb7185]">que se antoja.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
                Ingredientes frescos, plancha caliente y ese primer mordisco que
                siempre vale la pena.
              </p>
              <a
                href="#platillos"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fb7185] px-5 py-3 text-sm font-extrabold text-[#58151d] no-underline shadow-lg shadow-black/10 hover:bg-[#fda4af]"
              >
                Descubre el menú <ArrowDown className="size-4" />
              </a>
            </div>

            <div className="hidden size-52 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[#fb7185] lg:flex">
              <div className="flex size-40 items-center justify-center rounded-full border border-dashed border-white/20">
                <Sandwich className="size-24 stroke-[1.15]" />
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-5 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <Flame className="size-4 text-[#f2b970]" /> A la parrilla
            </span>
            <span className="inline-flex items-center gap-2">
              <Leaf className="size-4 text-[#fb7185]" /> Ingredientes frescos
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-[#f2b970]" /> Preparado al pedir
            </span>
          </div>
        </section>

        <section id="platillos" className="scroll-mt-8 pt-14 sm:pt-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="island-kicker">Directo de nuestra cocina</p>
              <h2 className="display-title mt-2 text-4xl tracking-tight sm:text-5xl">
                Algo rico te espera
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#796a6c] sm:text-base">
                Date una vuelta por los favoritos de la casa y encuentra tu
                próxima combinación.
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a777a]" />
              <Input
                aria-label="Buscar en el menú"
                placeholder="¿Qué se te antoja?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-12 rounded-full border-[#eadadd] bg-white/85 pl-10 pr-4 shadow-sm placeholder:text-[#a49496] focus-visible:ring-[#e11d48]/30"
              />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2" aria-label="Filtrar menú">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                type="button"
                variant="outline"
                aria-pressed={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={
                  activeFilter === filter.id
                    ? 'h-10 rounded-full border-[#8f2635] bg-[#8f2635] px-5 text-white hover:bg-[#a83445] hover:text-white'
                    : 'h-10 rounded-full border-[#eadadd] bg-white/70 px-5 text-[#796a6c] hover:border-[#e7aeb7] hover:bg-white hover:text-[#8f2635]'
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="mb-4 mt-7 flex items-center justify-between text-sm text-[#817477]">
            <p aria-live="polite">
              {isLoading
                ? 'Preparando el menú…'
                : `${visibleMenu.length} ${visibleMenu.length === 1 ? 'opción' : 'opciones'}`}
            </p>
            {isFetching && !isLoading && (
              <span className="inline-flex items-center gap-2 text-xs">
                <LoaderCircle className="size-3.5 animate-spin" /> Actualizando
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-[#eee2e3] bg-white/80"
                >
                  <div className="aspect-[1.65] animate-pulse bg-[#f2e8e9]" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#f2e8e9]" />
                    <div className="h-6 w-2/3 animate-pulse rounded bg-[#f2e8e9]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#f2e8e9]" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-[#f2e8e9]" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="flex flex-col items-center rounded-3xl border border-red-200 bg-white/80 px-6 py-12 text-center"
            >
              <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-700">
                <AlertCircle className="size-6" />
              </span>
              <h3 className="text-lg font-extrabold">No llegó el menú</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#817477]">
                {error instanceof Error
                  ? error.message
                  : 'Ocurrió un problema al cargar los platillos.'}
              </p>
              <Button
                type="button"
                onClick={() => void refetch()}
                className="mt-5 rounded-full bg-[#8f2635] px-5 text-white hover:bg-[#a83445]"
              >
                Intentar de nuevo
              </Button>
            </div>
          ) : visibleMenu.length > 0 || cartItems.length > 0 ? (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div>
                {visibleMenu.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {visibleMenu.map((item, index) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        index={index}
                        quantity={cart[item.id] ?? 0}
                        onQuantityChange={(change) => updateQuantity(item.id, change)}
                        disabled={checkout.isPending}
                      />
                    ))}
                  </div>
                ) : (
                  emptyMenuMessage
                )}
              </div>

              <aside
                id="carrito"
                aria-label="Carrito de compras"
                className="h-fit rounded-3xl border border-[#eadde0] bg-white/90 p-5 shadow-[0_18px_45px_-32px_rgba(88,21,29,0.55)] lg:sticky lg:top-24"
              >
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-extrabold">
                    <ShoppingBag className="size-5 text-[#8f2635]" />
                    Tu carrito
                  </h3>
                  <span className="rounded-full bg-[#f8e8eb] px-2.5 py-1 text-xs font-extrabold text-[#8f2635]">
                    {cartCount}
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="mt-5 rounded-2xl bg-[#fbf5f5] px-4 py-6 text-center">
                    <ShoppingBag className="mx-auto size-7 text-[#c89ba2]" />
                    <p className="mt-3 text-sm font-bold text-[#796a6c]">
                      Tu carrito está esperando algo rico
                    </p>
                    <p className="mt-1 text-xs text-[#918588]">
                      Agrega tus favoritos desde el menú.
                    </p>
                  </div>
                ) : (
                  <>
                    <ul className="mt-4 divide-y divide-[#f0e7e8]">
                      {cartItems.map(({ item, quantity }) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#382326]">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-[#817477]">
                              {formatPrice(item.price * quantity)}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-xs"
                              aria-label={`Quitar una unidad de ${item.name}`}
                              disabled={checkout.isPending}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="rounded-full border-[#eadde0] text-[#8f2635]"
                            >
                              {quantity === 1 ? (
                                <X className="size-3" />
                              ) : (
                                <Minus className="size-3" />
                              )}
                            </Button>
                            <span className="min-w-5 text-center text-sm font-bold">
                              {quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-xs"
                              aria-label={`Agregar una unidad de ${item.name}`}
                              disabled={checkout.isPending || quantity >= 99}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="rounded-full border-[#eadde0] text-[#8f2635]"
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-2 flex items-center justify-between border-t border-[#eadde0] pt-4">
                      <span className="text-sm font-semibold text-[#796a6c]">
                        Total
                      </span>
                      <span className="text-lg font-extrabold text-[#8f2635]">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>

                    {checkout.isError && (
                      <p role="alert" className="mt-3 text-sm text-red-700">
                        {checkout.error instanceof Error
                          ? checkout.error.message
                          : 'No se pudo iniciar el pago.'}
                      </p>
                    )}

                    <Button
                      type="button"
                      disabled={checkout.isPending || cartItems.length === 0}
                      onClick={() =>
                        checkout.mutate(
                          cartItems.map(({ item, quantity }) => ({
                            id: item.id,
                            quantity,
                          })),
                        )
                      }
                      className="mt-4 h-11 w-full rounded-full bg-[#8f2635] font-extrabold text-white hover:bg-[#a83445]"
                    >
                      {checkout.isPending ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" />
                          Preparando pago…
                        </>
                      ) : (
                        'Continuar al pago'
                      )}
                    </Button>
                  </>
                )}
              </aside>
            </div>
          ) : (
            emptyMenuMessage
          )}
        </section>

        <footer className="mt-16 rounded-3xl border border-[#eadde0] bg-white/60 px-6 py-5 text-center text-sm text-[#817477]">
          <p>
            ¿Ya elegiste?{' '}
            <span className="font-bold text-[#8f2635]">
              Tu próxima hamburguesa está a un mordisco de distancia.
            </span>
          </p>
        </footer>
      </div>
    </main>
  )
}

function MenuCard({
  item,
  index,
  quantity,
  onQuantityChange,
  disabled,
}: {
  item: MenuItem
  index: number
  quantity: number
  onQuantityChange: (change: number) => void
  disabled: boolean
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const isSide = getCategory(item) === 'acompanamiento'
  const fallbackIcon = isSide ? Utensils : index === 2 ? Sandwich : Beef
  const FallbackIcon = fallbackIcon

  return (
    <article className="feature-card group overflow-hidden rounded-3xl border border-[#eee2e3] transition-transform duration-300">
      <div className="relative aspect-[1.65] overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,#f8dcae_0%,#f3ead6_42%,#f1e4e5_100%)]">
        {!imageFailed && (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {imageFailed && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-[#9f4653]/70"
          >
            <div className="flex size-28 items-center justify-center rounded-full border border-white/60 bg-white/45 shadow-sm backdrop-blur-sm">
              <FallbackIcon className="size-14 stroke-[1.25]" />
            </div>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#8f2635] shadow-sm">
          {isSide ? 'Para acompañar' : 'Favorito de la casa'}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#58151d]/15 to-transparent" />
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-extrabold tracking-tight text-[#382326]">
            {item.name}
          </h3>
          <span className="shrink-0 rounded-full bg-[#f8e8eb] px-3 py-1.5 text-sm font-extrabold text-[#8f2635]">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[#817477]">
          {item.description}
        </p>
        <div className="mt-5 flex items-center gap-2 border-t border-[#f0e7e8] pt-4 text-xs font-semibold text-[#918588]">
          <Clock3 className="size-3.5" />
          Preparado al momento
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          {quantity > 0 ? (
            <div className="flex items-center gap-2 rounded-full border border-[#eadde0] bg-white px-2 py-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Quitar una unidad de ${item.name}`}
                disabled={disabled}
                onClick={() => onQuantityChange(-1)}
                className="rounded-full text-[#8f2635] hover:bg-[#f8e8eb]"
              >
                {quantity === 1 ? <X /> : <Minus />}
              </Button>
              <span aria-live="polite" className="min-w-5 text-center text-sm font-extrabold">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Agregar una unidad de ${item.name}`}
                disabled={disabled || quantity >= 99}
                onClick={() => onQuantityChange(1)}
                className="rounded-full text-[#8f2635] hover:bg-[#f8e8eb]"
              >
                <Plus />
              </Button>
            </div>
          ) : (
            <span className="text-xs font-semibold text-[#918588]">
              Elige la cantidad
            </span>
          )}
          <Button
            type="button"
            disabled={disabled || quantity >= 99}
            onClick={() => onQuantityChange(1)}
            className="h-10 rounded-full bg-[#8f2635] px-4 text-xs font-extrabold text-white hover:bg-[#a83445]"
          >
            {quantity > 0 ? (
              <>
                <Plus className="size-4" /> Agregar
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" /> Agregar
              </>
            )}
          </Button>
        </div>
      </div>

    </article>
  )
}
