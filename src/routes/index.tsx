import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowRight,
  Beef,
  Flame,
  Leaf,
  Star,
  Timer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: Home })

const highlights = [
  {
    icon: Beef,
    title: 'Carne a la parrilla',
    description: 'Sellada al momento para ese sabor jugoso que se queda contigo.',
  },
  {
    icon: Leaf,
    title: 'Fresco, siempre',
    description: 'Vegetales crujientes y buenos ingredientes en cada mordida.',
  },
  {
    icon: Flame,
    title: 'Hecho con ganas',
    description: 'Nada de prisas: cada hamburguesa sale recién preparada.',
  },
]

function Home() {
  return (
    <main className="overflow-hidden text-[#382326]">
      <section className="relative isolate min-h-[620px] bg-[#58151d] text-white sm:min-h-[680px]">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2000&q=85"
            alt=""
            fetchPriority="high"
            className="size-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a0b10]/95 via-[#58151d]/80 to-[#58151d]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a0b10]/75 via-transparent to-black/10" />
        </div>

        <div className="mx-auto flex min-h-[620px] w-full max-w-7xl items-center px-5 py-16 sm:min-h-[680px] sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#fecdd3] backdrop-blur-sm">
              <span className="size-2 rounded-full bg-[#fb7185]" />
              Fast Hamburger · Hecho al momento
            </div>
            <h1 className="display-title text-5xl leading-[0.97] tracking-tight sm:text-7xl lg:text-8xl">
              Hambre de
              <br />
              <span className="text-[#fb7185]">algo bueno.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Hamburguesas a la parrilla, ingredientes frescos y sabor sin
              complicaciones. Ven por tu favorita — nosotros ponemos lo demás.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-[#fb7185] px-7 text-sm font-extrabold text-[#58151d] shadow-lg shadow-black/20 hover:bg-[#fda4af]"
              >
                <Link to="/menu">
                  Explora el menú <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-white/35 bg-white/10 px-7 text-sm font-bold text-white hover:bg-white/20 hover:text-white"
              >
                <a href="#lo-bueno">
                  Conoce lo bueno <ArrowDown className="size-4" />
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/75">
              <div className="flex items-center gap-1 text-[#f7c36c]" aria-label="Cinco estrellas">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <span>El antojo se respeta</span>
              <span className="hidden size-1 rounded-full bg-white/40 sm:block" />
              <span className="inline-flex items-center gap-2">
                <Timer className="size-4 text-[#fecdd3]" /> Siempre recién hecho
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fbf8f5] to-transparent" />
      </section>

      <section id="lo-bueno" className="relative bg-[#fbf8f5] px-5 pb-16 pt-4 sm:px-8 sm:pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="island-kicker">No hay atajos para el sabor</p>
            <h2 className="display-title mt-3 text-4xl tracking-tight sm:text-5xl">
              Lo bueno se nota en cada mordida.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#796a6c]">
              Una buena hamburguesa no necesita mucho. Solo buenos ingredientes,
              fuego en su punto y ganas de hacerla bien.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-3xl border border-[#eadde0] bg-white/80 p-6 shadow-[0_14px_35px_-28px_rgba(88,21,29,0.4)] sm:p-8"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#f8e8eb] text-[#a83445]">
                  <Icon className="size-6" />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#a83445]">
                  0{index + 1} · Nuestra receta
                </p>
                <h3 className="mt-2 text-xl font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#817477]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8f5] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-4xl bg-[#7b1e2b] shadow-[0_26px_70px_-34px_rgba(88,21,29,0.65)] md:grid-cols-2">
          <div className="relative min-h-72 md:min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85"
              alt="Hamburguesa recién preparada con ingredientes frescos"
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3a0b10]/40 to-transparent md:bg-gradient-to-r" />
          </div>
          <div className="flex flex-col items-start justify-center px-7 py-10 text-white sm:px-11 sm:py-14 lg:px-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#fecdd3]">
              El plan está servido
            </p>
            <h2 className="display-title mt-3 text-4xl leading-tight sm:text-5xl">
              Tu próxima favorita te está esperando.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">
              Revisa todo lo que tenemos para ti y arma tu momento más rico del
              día.
            </p>
            <Button
              asChild
              className="mt-7 h-12 rounded-full bg-[#fb7185] px-7 font-extrabold text-[#58151d] hover:bg-[#fda4af]"
            >
              <Link to="/menu">
                Ver todo el menú <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
