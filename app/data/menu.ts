export interface Pie {
  id: string
  num: string
  badge: string
  italian: string
  name: string
  price: number
  desc: string
  ingredients: string[]
  frame: number
}

const TOTAL_FRAMES = 240

export const PIES: Pie[] = [
  {
    id: 'margherita',
    num: 'I',
    badge: '№ 01',
    italian: '— LA REGINA',
    name: 'Margherita',
    price: 18,
    desc: 'The original. Nothing hidden, nothing lacking. A study in balance.',
    ingredients: ['San Marzano', 'Bufala', 'Basil', 'EVOO'],
    frame: 1,
  },
  {
    id: 'diavola',
    num: 'II',
    badge: '№ 02',
    italian: '— IL DIAVOLO',
    name: 'Diavola',
    price: 22,
    desc: 'Calabrian heat, restrained. Spice that builds slowly, lingers longer.',
    ingredients: ['Spicy Salami', 'Calabrian', 'Mozzarella', 'Sugo'],
    frame: Math.round(TOTAL_FRAMES * 0.3),
  },
  {
    id: 'tartufo',
    num: 'III',
    badge: '№ 03',
    italian: '— IL TESORO',
    name: 'Tartufo',
    price: 26,
    desc: 'Earth and luxury. A truffle-threaded canvas on a char-kissed crust.',
    ingredients: ['Black Truffle', 'Mushroom', 'Fior di Latte', 'Truffle Oil'],
    frame: Math.round(TOTAL_FRAMES * 0.6),
  },
  {
    id: 'quattro-formaggi',
    num: 'IV',
    badge: '№ 04',
    italian: '— LA BIANCA',
    name: 'Quattro Formaggi',
    price: 24,
    desc: 'Four cheeses, one harmony. Rich, molten, and restrained all at once.',
    ingredients: ['Gorgonzola', 'Fior di Latte', 'Pecorino', 'Parmigiano'],
    frame: Math.round(TOTAL_FRAMES * 0.75),
  },
]
