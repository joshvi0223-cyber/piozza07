import FloatingPizza from './FloatingPizza'
import SplitText from './SplitText'

const ingredients = [
  { label: 'Dough', detail: '12-day cold ferment' },
  { label: 'Tomato', detail: 'San Marzano D.O.P.' },
  { label: 'Cheese', detail: 'Mozzarella di Bufala' },
  { label: 'Fire', detail: 'Quercia oak, 900°F' },
]

export default function Prologue() {
  return (
    <section id="prologue" className="relative border-t border-hairline py-20 md:py-32 px-6 md:px-10 overflow-hidden">

      {/* Ambient floating pizzas */}
      <div className="hidden md:block pointer-events-none absolute -left-20 top-1/4 opacity-5">
        <FloatingPizza size={240} frame={60} opacity={1} parallax={0.05} />
      </div>
      <div className="hidden md:block pointer-events-none absolute -right-16 bottom-1/4 opacity-5">
        <FloatingPizza size={180} frame={120} opacity={1} parallax={-0.04} />
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">

        {/* Left rail */}
        <div className="md:col-span-3 flex flex-col gap-4" data-reveal>
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/35">(02)</span>
          <span className="font-mono text-[11px] tracking-[0.25em] text-ink/50">PROLOGUE</span>
          <div className="w-8 h-px bg-hairline" />
          <span className="font-bodoni italic text-sm text-ink/40">Naples, 1962.</span>
        </div>

        {/* Right content */}
        <div className="md:col-span-9">
          <div data-reveal>
            <p className="drop-cap font-bodoni italic text-lg sm:text-xl md:text-2xl text-ink/90 leading-relaxed max-w-2xl">
              In the steep alleys of the Quartieri Spagnoli, a single oven burned through the night.
              No recipe written down. No clock on the wall. Only dough, fire, and the particular silence
              of a man who has memorized what perfect smells like. That man was our grandfather.
              This is his pizzeria, carried forward by hand.
            </p>
          </div>

          {/* Ingredient credits */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8" data-reveal data-reveal-delay="2">
            {ingredients.map((ing) => (
              <div key={ing.label} className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-ink/35 uppercase">{ing.label}</span>
                <div className="w-4 h-px bg-red/60" />
                <span className="font-inter text-xs text-ink/60 leading-relaxed">{ing.detail}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
