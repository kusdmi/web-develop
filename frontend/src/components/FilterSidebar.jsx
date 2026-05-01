import { useSyncExternalStore, useState } from 'react'
import './FilterSidebar.css'

const MQ_DESKTOP = '(min-width: 768px)'

function subscribeMediaQuery(callback) {
  const mq = window.matchMedia(MQ_DESKTOP)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getMediaQuerySnapshot() {
  return window.matchMedia(MQ_DESKTOP).matches
}

function getMediaQueryServerSnapshot() {
  return false
}

export function FilterSidebar({
  maxPrice,
  onMaxPriceChange,
  priceCap,
  socketFilter,
  onSocketFilterChange,
  powerFilter,
  onPowerFilterChange,
  brandFilter,
  onBrandFilterChange,
  shapeFilter,
  onShapeFilterChange,
  filterOptions,
}) {
  const { sockets, powers, brands, shapes } = filterOptions
  const isDesktop = useSyncExternalStore(
    subscribeMediaQuery,
    getMediaQuerySnapshot,
    getMediaQueryServerSnapshot,
  )
  const [mobileCollapsed, setMobileCollapsed] = useState(true)
  const panelOpen = isDesktop || !mobileCollapsed

  const toggleValue = (value, selected, setSelected) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    )
  }

  return (
    <aside className="filter-sidebar" aria-label="Фильтр товаров">
      <div className="filter-sidebar__header">
        <h2 className="filter-sidebar__title" id="filter-sidebar-heading">
          Фильтр
        </h2>
        {!isDesktop ? (
          <button
            type="button"
            className={`filter-sidebar__toggle${panelOpen ? ' filter-sidebar__toggle--open' : ''}`}
            aria-expanded={panelOpen}
            aria-controls="filter-sidebar-panel"
            onClick={() => setMobileCollapsed((c) => !c)}
          >
            <span className="filter-sidebar__toggle-text">
              {panelOpen ? 'Свернуть' : 'Развернуть'}
            </span>
            <span className="filter-sidebar__toggle-chevron" aria-hidden>
              ▼
            </span>
          </button>
        ) : null}
      </div>
      <div
        id="filter-sidebar-panel"
        className={
          panelOpen
            ? 'filter-sidebar__panel'
            : 'filter-sidebar__panel filter-sidebar__panel--collapsed'
        }
        role="region"
        aria-labelledby="filter-sidebar-heading"
      >
      <div className="filter-sidebar__block">
        <label className="filter-sidebar__label" htmlFor="filter-price">
          Цена до, ₽
        </label>
        <input
          id="filter-price"
          type="range"
          min={0}
          max={priceCap}
          step={100}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
        />
        <output className="filter-sidebar__output" htmlFor="filter-price">
          {maxPrice.toLocaleString('ru-RU')} ₽
        </output>
      </div>
      <div className="filter-sidebar__block filter-sidebar__block--group">
        <p className="filter-sidebar__label">Цоколь</p>
        <div className="filter-sidebar__group" role="group" aria-label="Цоколь">
          {sockets.map((s) => (
            <label key={s} className="filter-sidebar__check">
              <input
                type="checkbox"
                checked={socketFilter.includes(s)}
                onChange={() => toggleValue(s, socketFilter, onSocketFilterChange)}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-sidebar__block filter-sidebar__block--group">
        <p className="filter-sidebar__label">Мощность</p>
        <div className="filter-sidebar__group" role="group" aria-label="Мощность">
          {powers.map((w) => (
            <label key={w} className="filter-sidebar__check">
              <input
                type="checkbox"
                checked={powerFilter.includes(w)}
                onChange={() => toggleValue(w, powerFilter, onPowerFilterChange)}
              />
              <span>{w} Вт</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-sidebar__block filter-sidebar__block--group">
        <p className="filter-sidebar__label">Производитель</p>
        <div className="filter-sidebar__group" role="group" aria-label="Производитель">
          {brands.map((b) => (
            <label key={b} className="filter-sidebar__check">
              <input
                type="checkbox"
                checked={brandFilter.includes(b)}
                onChange={() => toggleValue(b, brandFilter, onBrandFilterChange)}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-sidebar__block filter-sidebar__block--group">
        <p className="filter-sidebar__label">Форма</p>
        <div className="filter-sidebar__group" role="group" aria-label="Форма">
          {shapes.map((shape) => (
            <label key={shape} className="filter-sidebar__check">
              <input
                type="checkbox"
                checked={shapeFilter.includes(shape)}
                onChange={() => toggleValue(shape, shapeFilter, onShapeFilterChange)}
              />
              <span>{shape}</span>
            </label>
          ))}
        </div>
      </div>
      </div>
    </aside>
  )
}
