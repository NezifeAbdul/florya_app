import { useEffect } from "react"

const useParallax = (selector: string = '.parallax-img', speed: number = 0.15): void => {
  useEffect(() => {
    const images = document.querySelectorAll<HTMLElement>(selector)  // ← HTMLElement generic

    const handleScroll = (): void => {
      images.forEach((img) => {
        const wrap = img.closest<HTMLElement>('.parallax-wrap')
        if (!wrap) return

        const rect = wrap.getBoundingClientRect()
        const windowH = window.innerHeight
        const visible = rect.top < windowH && rect.bottom > 0
        if (!visible) return

        const center = rect.top + rect.height / 2 - windowH / 2
        img.style.transform = `translateY(${center * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [selector, speed])
}

export default useParallax