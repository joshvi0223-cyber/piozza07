import SplitText from './SplitText'

const features = [
  {
    num: '01',
    title: 'Lightning Fast',
    body: 'Specialized e-scooters dispatch within five city blocks. Twenty minutes, door to door, never less than piping hot.',
  },
  {
    num: '02',
    title: '900° Wood-Fired',
    body: 'Stone hearth fired with quercia oak. The crust leopards in seconds; the cheese settles in milliseconds.',
  },
  {
    num: '03',
    title: '100% Organic',
    body: 'San Marzano tomatoes and Mozzarella di Bufala flown in weekly from the slopes of Vesuvius and the plains of Campania.',
  },
  {
    num: '04',
    title: 'Heritage Craft',
    body: 'Twelve days of cold fermentation. Three generations of dough wisdom. Passed by hand, never by paper.',
  },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-hairline py-20 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-16 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-3 flex flex-col gap-4" data-reveal>
            <span className="font-mono text-[10px] tracking-[0.3em] text-ink/35">(06)</span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-ink/50">CRAFT</span>
          </div>
          <div className="md:col-span-9 flex flex-col gap-2" data-reveal data-reveal-delay="1">
            <h2 className="font-bodoni italic text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              Rooted in{' '}
              <SplitText parts={[{ text: 'centuries.', className: 'text-red' }]} by="char" stagger={30} />
            </h2>
            <h2 className="font-bodoni italic text-3xl sm:text-4xl md:text-5xl text-ink leading-tight" style={{ transitionDelay: '400ms' }}>
              <SplitText parts={['Refined for today.']} by="char" stagger={30} delay={400} />
            </h2>
          </div>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {features.map((f, i) => {
            const isLastInRowMobile = true
            const isLastInRowDesktop = i % 2 === 1
            const isLastRowMobile = i === features.length - 1
            const isLastRowDesktop = i >= features.length - 2

            return (
              <div
                key={f.num}
                className={[
                  'feature-underline group flex flex-col gap-4 py-10 px-6 md:px-8 cursor-default',
                  !isLastInRowDesktop ? 'sm:border-r sm:border-hairline' : '',
                  !isLastRowDesktop ? 'sm:border-b sm:border-hairline' : '',
                  !isLastRowMobile ? 'border-b border-hairline sm:border-b-0' : '',
                ].join(' ')}
                data-reveal
                data-reveal-delay={String((i % 2) + 1) as '1' | '2' | '3' | '4'}
              >
                <span className="font-mono text-[10px] tracking-[0.3em] text-red/70">{f.num}</span>
                <h3 className="font-bodoni italic text-2xl md:text-3xl text-ink">{f.title}</h3>
                <p className="font-inter text-sm text-ink/50 leading-relaxed max-w-xs">{f.body}</p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
