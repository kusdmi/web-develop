/** Mock-каталог без backend — магазин лампочек */
export const CATEGORIES = [
  'Все',
  'Лампы накаливания',
  'Галогенные лампы',
  'Люминесцентные лампы',
  'Компактные люминесцентные лампы',
  'Светодиоды',
]

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Лампа накаливания А60 60 Вт Е27',
    description: 'Тёплый свет 2700 K, матовое стекло.',
    price: 89,
    category: 'Лампы накаливания',
    imageColor: '#d4c4a8',
    socket: 'Е27',
    powerW: 60,
    brand: 'Технолюкс',
    shape: 'Груша',
  },
  {
    id: '2',
    name: 'Лампа накаливания «свеча» 40 Вт Е14',
    description: 'Для бра и люстр, прозрачное стекло.',
    price: 75,
    category: 'Лампы накаливания',
    imageColor: '#e8dcc8',
    socket: 'Е14',
    powerW: 40,
    brand: 'Технолюкс',
    shape: 'Свеча',
  },
  {
    id: '3',
    name: 'Лампа накаливания шар 25 Вт Е27',
    description: 'Декоративная, мягкий свет.',
    price: 65,
    category: 'Лампы накаливания',
    imageColor: '#c9b89a',
    socket: 'Е27',
    powerW: 25,
    brand: 'Маяк',
    shape: 'Шар',
  },
  {
    id: '4',
    name: 'Галогенная G9 28 Вт',
    description: 'Капсульная, для точечных светильников.',
    price: 120,
    category: 'Галогенные лампы',
    imageColor: '#dde4e8',
    socket: 'G9',
    powerW: 28,
    brand: 'Camelion',
    shape: 'Капсула',
  },
  {
    id: '5',
    name: 'Галогенная MR16 GU5.3 35 Вт',
    description: 'Рефлекторная, 12 В (с трансформатором).',
    price: 145,
    category: 'Галогенные лампы',
    imageColor: '#cfd8dc',
    socket: 'GU5.3',
    powerW: 35,
    brand: 'Gauss',
    shape: 'Рефлектор',
  },
  {
    id: '6',
    name: 'Люминесцентная трубка Т8 18 Вт 6500 K',
    description: 'Длина 600 мм, холодный белый.',
    price: 190,
    category: 'Люминесцентные лампы',
    imageColor: '#b8c5ce',
    socket: 'G13',
    powerW: 18,
    brand: 'Philips',
    shape: 'Трубка',
  },
  {
    id: '7',
    name: 'Люминесцентная трубка Т8 36 Вт 4000 K',
    description: 'Длина 1200 мм, нейтральный белый.',
    price: 260,
    category: 'Люминесцентные лампы',
    imageColor: '#a8b8c4',
    socket: 'G13',
    powerW: 36,
    brand: 'Philips',
    shape: 'Трубка',
  },
  {
    id: '8',
    name: 'КЛЛ спираль 15 Вт Е27',
    description: 'Энергосберегающая, замена 75 Вт накаливания.',
    price: 210,
    category: 'Компактные люминесцентные лампы',
    imageColor: '#c5d4c0',
    socket: 'Е27',
    powerW: 15,
    brand: 'Osram',
    shape: 'Спираль',
  },
  {
    id: '9',
    name: 'КЛЛ 3U 20 Вт Е14',
    description: 'Компактная форма, холодный свет.',
    price: 230,
    category: 'Компактные люминесцентные лампы',
    imageColor: '#b8c9b0',
    socket: 'Е14',
    powerW: 20,
    brand: 'Navigator',
    shape: 'U-образная',
  },
  {
    id: '10',
    name: 'Светодиодная А60 10 Вт Е27',
    description: 'Тёплый свет, 806 лм, ресурс 25 000 ч.',
    price: 179,
    category: 'Светодиоды',
    imageColor: '#fff8e6',
    socket: 'Е27',
    powerW: 10,
    brand: 'Gauss',
    shape: 'Груша',
  },
  {
    id: '11',
    name: 'Светодиодная GU10 7 Вт',
    description: 'Для спотов, угол 120°, нейтральный белый.',
    price: 165,
    category: 'Светодиоды',
    imageColor: '#f5edd4',
    socket: 'GU10',
    powerW: 7,
    brand: 'Camelion',
    shape: 'Спот',
  },
  {
    id: '12',
    name: 'LED-лента 5 м, 3000 K',
    description: '12 В, комплект с блоком питания 2 А.',
    price: 890,
    category: 'Светодиоды',
    imageColor: '#e6efe0',
    socket: 'Лента',
    powerW: 24,
    brand: 'ЭРА',
    shape: 'Лента',
  },
]

const SOCKET_SORT_ORDER = ['Е14', 'Е27', 'G9', 'GU5.3', 'GU10', 'G13', 'Лента']

/** Уникальные значения для фильтра каталога (из мок-данных). */
export function getCatalogFilterOptions() {
  const sockets = [...new Set(MOCK_PRODUCTS.map((p) => p.socket))]
  sockets.sort((a, b) => {
    const ia = SOCKET_SORT_ORDER.indexOf(a)
    const ib = SOCKET_SORT_ORDER.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b, 'ru')
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
  const powers = [...new Set(MOCK_PRODUCTS.map((p) => p.powerW))].sort(
    (a, b) => a - b,
  )
  const brands = [...new Set(MOCK_PRODUCTS.map((p) => p.brand))].sort((a, b) =>
    a.localeCompare(b, 'ru'),
  )
  const shapes = [...new Set(MOCK_PRODUCTS.map((p) => p.shape))].sort((a, b) =>
    a.localeCompare(b, 'ru'),
  )
  return { sockets, powers, brands, shapes }
}

export function getProductById(id) {
  return MOCK_PRODUCTS.find((p) => p.id === String(id))
}
