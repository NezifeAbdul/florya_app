
import { useEffect, useRef } from "react"

interface PageHeroProps {

  backgroundImage: string
  eyebrow?: string

  title: string

  subtitle?: string

  parallaxSpeed?: number
 
  height?: string

  showScrollHint?: boolean
}

const HeroComponentSecondary = ({
  backgroundImage,
  eyebrow,
  title,
  subtitle,
  parallaxSpeed = 0.45,
  height = "92vh",
  showScrollHint = true,
}: PageHeroProps) => {
  const heroRef = useRef<HTMLElement>(null)

  // Parallax
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY =
          `${window.scrollY * parallaxSpeed}px`
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [parallaxSpeed])

  // Fade-in on mount
  useEffect(() => {
    const el = heroRef.current?.querySelector(".hero-content")
    if (!el) return
    const id = requestAnimationFrame(() => el.classList.add("visible"))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section
      className="page-hero"
      ref={heroRef}
      style={{ backgroundImage: `url(${backgroundImage})`, minHeight: height }}
    >
      <div className="page-hero__overlay" />

      <div className="hero-content slide-up">
        {eyebrow && <span className="hero-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {showScrollHint && (
        <div className="hero-scroll-hint">
          <span />
        </div>
      )}
    </section>
  )
}

export default HeroComponentSecondary