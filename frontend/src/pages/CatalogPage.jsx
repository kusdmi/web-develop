import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectAllProducts,
  selectCategories,
  selectProductsError,
  selectProductsStatus,
} from '../store/productsSlice'
import { ShopHeader } from '../components/ShopHeader'
import { Footer } from '../components/Footer'
import { Slider } from '../components/Slider'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductCard } from '../components/ProductCard'
import './CatalogPage.css'

const SOCKET_REGEX = /\b(Е14|Е27|G9|GU5\.3|GU10|G13|Лента)\b/i
const POWER_REGEX = /(\d+)\s*Вт/i
const KNOWN_BRANDS = [
  'Технолюкс',
  'Маяк',
  'Camelion',
  'Gauss',
  'Philips',
  'Osram',
  'Navigator',
  'ЭРА',
]
const KNOWN_SHAPES = [
  'Груша',
  'Свеча',
  'Шар',
  'Капсула',
  'Рефлектор',
  'Трубка',
  'Спираль',
  'U-образная',
  'Спот',
  'Лента',
]

function parseProductAttrs(product) {
  const source = `${product.name || ''} ${product.description || ''}`
  const socketMatch = source.match(SOCKET_REGEX)
  const powerMatch = source.match(POWER_REGEX)
  const brand = KNOWN_BRANDS.find((b) => source.toLowerCase().includes(b.toLowerCase())) || null
  const shape = KNOWN_SHAPES.find((s) => source.toLowerCase().includes(s.toLowerCase())) || null
  return {
    socket: socketMatch ? socketMatch[1].toUpperCase() : null,
    powerW: powerMatch ? Number(powerMatch[1]) : null,
    brand,
    shape,
  }
}

export function CatalogPage() {
  const products = useSelector(selectAllProducts)
  const status = useSelector(selectProductsStatus)
  const error = useSelector(selectProductsError)
  const categories = useSelector(selectCategories)

  const [searchParams, setSearchParams] = useSearchParams()
  const appliedQuery = (searchParams.get('search') ?? '').trim()
  const [searchQuery, setSearchQuery] = useState(appliedQuery)
  const [categoryFilter, setCategoryFilter] = useState('')
  const priceCap = useMemo(() => {
    const cap = products.length ? Math.max(...products.map((p) => Number(p.price) || 0)) : 0
    return Math.max(cap, 10000)
  }, [products])
  const [maxPrice, setMaxPrice] = useState(priceCap)
  const [socketFilter, setSocketFilter] = useState([])
  const [powerFilter, setPowerFilter] = useState([])
  const [brandFilter, setBrandFilter] = useState([])
  const [shapeFilter, setShapeFilter] = useState([])

  const catalogFilterOptions = useMemo(() => {
    const sockets = new Set()
    const powers = new Set()
    const brands = new Set()
    const shapes = new Set()

    for (const p of products) {
      const attrs = parseProductAttrs(p)
      if (attrs.socket) sockets.add(attrs.socket)
      if (attrs.powerW != null) powers.add(attrs.powerW)
      if (attrs.brand) brands.add(attrs.brand)
      if (attrs.shape) shapes.add(attrs.shape)
    }

    return {
      sockets: Array.from(sockets).sort((a, b) => a.localeCompare(b, 'ru')),
      powers: Array.from(powers).sort((a, b) => a - b),
      brands: Array.from(brands).sort((a, b) => a.localeCompare(b, 'ru')),
      shapes: Array.from(shapes).sort((a, b) => a.localeCompare(b, 'ru')),
    }
  }, [products])

  const runSearch = () => {
    const q = searchQuery.trim()
    if (q) {
      setSearchParams({ search: q })
    } else {
      setSearchParams({})
    }
  }

  const filtered = useMemo(() => {
    const q = appliedQuery.toLowerCase()
    return products.filter((p) => {
      const attrs = parseProductAttrs(p)
      const catOk = !categoryFilter || p.category === categoryFilter
      const priceOk = p.price <= maxPrice
      const socketOk = socketFilter.length === 0 || (attrs.socket && socketFilter.includes(attrs.socket))
      const powerOk = powerFilter.length === 0 || (attrs.powerW != null && powerFilter.includes(attrs.powerW))
      const brandOk = brandFilter.length === 0 || (attrs.brand && brandFilter.includes(attrs.brand))
      const shapeOk = shapeFilter.length === 0 || (attrs.shape && shapeFilter.includes(attrs.shape))
      const textOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        String(p.description || '').toLowerCase().includes(q)
      return (
        catOk &&
        priceOk &&
        socketOk &&
        powerOk &&
        brandOk &&
        shapeOk &&
        textOk
      )
    })
  }, [
    products,
    appliedQuery,
    categoryFilter,
    maxPrice,
    socketFilter,
    powerFilter,
    brandFilter,
    shapeFilter,
  ])

  return (
    <div className="catalog-page">
      <ShopHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={runSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
      />
      <Slider />
      <div className="catalog-page__main">
        <FilterSidebar
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          priceCap={priceCap}
          socketFilter={socketFilter}
          onSocketFilterChange={setSocketFilter}
          powerFilter={powerFilter}
          onPowerFilterChange={setPowerFilter}
          brandFilter={brandFilter}
          onBrandFilterChange={setBrandFilter}
          shapeFilter={shapeFilter}
          onShapeFilterChange={setShapeFilter}
          filterOptions={catalogFilterOptions}
        />
        <div className="catalog-page__grid-wrap">
          {status === 'loading' ? (
            <p className="catalog-page__empty">Загрузка каталога…</p>
          ) : status === 'failed' ? (
            <p className="catalog-page__empty">{error || 'Не удалось загрузить каталог'}</p>
          ) : null}
          <ul className="catalog-page__grid">
            {filtered.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="catalog-page__empty">Ничего не найдено</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
