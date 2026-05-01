import { useSyncExternalStore } from 'react'

/** Точка перехода «мобильный / десктоп» в шапке и др. */
export const MEDIA_DESKTOP = '(min-width: 768px)'

/**
 * Подписка на window.matchMedia. На SSR snapshot всегда false.
 * @param {string} query например '(min-width: 768px)'
 */
export function useMatchMedia(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
