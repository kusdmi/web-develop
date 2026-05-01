/** Mock-каталог без backend */
export const CATEGORIES = ['Все', 'Электроника', 'Одежда', 'Дом', 'Книги']

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Беспроводные наушники',
    description: 'Шумоподавление, 30 ч автономности.',
    price: 4990,
    category: 'Электроника',
    imageColor: '#c8c8c8',
  },
  {
    id: '2',
    name: 'Умные часы',
    description: 'Пульс, шаги, уведомления.',
    price: 8990,
    category: 'Электроника',
    imageColor: '#b8b8b8',
  },
  {
    id: '3',
    name: 'Футболка базовая',
    description: 'Хлопок, размеры S–XL.',
    price: 990,
    category: 'Одежда',
    imageColor: '#d0d0d0',
  },
  {
    id: '4',
    name: 'Джинсы классические',
    description: 'Тёмно-синий, slim fit.',
    price: 3490,
    category: 'Одежда',
    imageColor: '#a8a8a8',
  },
  {
    id: '5',
    name: 'Кружка керамическая',
    description: 'Объём 350 мл.',
    price: 450,
    category: 'Дом',
    imageColor: '#d8d8d8',
  },
  {
    id: '6',
    name: 'Настольная лампа',
    description: 'LED, регулировка яркости.',
    price: 2190,
    category: 'Дом',
    imageColor: '#bcbcbc',
  },
  {
    id: '7',
    name: 'Роман «Путешествие»',
    description: 'Мягкая обложка, 320 стр.',
    price: 650,
    category: 'Книги',
    imageColor: '#c4c4c4',
  },
  {
    id: '8',
    name: 'Учебник по React',
    description: 'Для начинающих разработчиков.',
    price: 1200,
    category: 'Книги',
    imageColor: '#b0b0b0',
  },
  {
    id: '9',
    name: 'Клавиатура механическая',
    description: 'Переключатели blue, RGB.',
    price: 6790,
    category: 'Электроника',
    imageColor: '#cccccc',
  },
  {
    id: '10',
    name: 'Рюкзак городской',
    description: 'Отдел для ноутбука 15".',
    price: 2890,
    category: 'Одежда',
    imageColor: '#aeaeae',
  },
  {
    id: '11',
    name: 'Плед вязаный',
    description: '140×180 см, акрил.',
    price: 1790,
    category: 'Дом',
    imageColor: '#d4d4d4',
  },
  {
    id: '12',
    name: 'Сборник рассказов',
    description: 'Современная проза.',
    price: 520,
    category: 'Книги',
    imageColor: '#bebebe',
  },
]

export function getProductById(id) {
  return MOCK_PRODUCTS.find((p) => p.id === String(id))
}
