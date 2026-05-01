import { useEffect, useState } from 'react'
import './Slider.css'

const SLIDES = [
  {
    label: 'Акции и новинки',
    title: 'Магазин лампочек — LED, лампы и светильники по выгодным ценам',
  },
  {
    label: 'Доставка',
    title: 'Быстрая отправка по городу и аккуратная упаковка каждого заказа',
  },
  {
    label: 'Гарантия качества',
    title: 'Только проверенные лампы с долгим сроком службы',
  },
]

export function Slider() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length)
  }

  const active = SLIDES[activeIndex]

  return (
    <div className="catalog-slider" role="region" aria-label="Промо: магазин лампочек">
      <button
        type="button"
        className="catalog-slider__arrow catalog-slider__arrow--left"
        onClick={goPrev}
        aria-label="Предыдущий слайд"
      >
        ‹
      </button>

      <div className="catalog-slider__inner">
        <p className="catalog-slider__label">{active.label}</p>
        <h2 className="catalog-slider__title">{active.title}</h2>
        <div className="catalog-slider__dots" aria-hidden>
          {SLIDES.map((_, index) => (
            <span
              key={index}
              className={
                index === activeIndex
                  ? 'catalog-slider__dot catalog-slider__dot--active'
                  : 'catalog-slider__dot'
              }
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="catalog-slider__arrow catalog-slider__arrow--right"
        onClick={goNext}
        aria-label="Следующий слайд"
      >
        ›
      </button>
    </div>
  )
}
