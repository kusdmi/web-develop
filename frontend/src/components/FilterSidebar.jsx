import './FilterSidebar.css'

export function FilterSidebar({
  maxPrice,
  onMaxPriceChange,
  priceCap,
}) {
  return (
    <aside className="filter-sidebar" aria-label="Фильтр товаров">
      <h2 className="filter-sidebar__title">Фильтр</h2>
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
    </aside>
  )
}
