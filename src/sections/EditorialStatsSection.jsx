import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const statistics = [
  { value: 3, label: 'Curated moods', caption: 'Ease / expression / everyday' },
  { value: 10, label: 'Signature styles', caption: 'A considered wardrobe' },
  { value: 6, label: 'Editorial frames', caption: 'A glimpse into our world' },
  { value: 1, label: 'Point of view', caption: 'Made to be worn' },
]

const formatValue = (value) => String(value).padStart(2, '0')

function EditorialStatsSection() {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const motionMedia = gsap.matchMedia()
    motionMedia.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        noPreference: '(prefers-reduced-motion: no-preference)',
      },
      ({ conditions }) => {
        const items = gsap.utils.toArray('.editorial-stats__item', section)

        if (conditions.reduceMotion) {
          items.forEach((item) => {
            const counter = item.querySelector('[data-stat-target]')
            counter.textContent = formatValue(counter.dataset.statTarget)
          })
          return
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
          },
        })

        items.forEach((item, index) => {
          const counter = item.querySelector('[data-stat-target]')
          const target = Number(counter.dataset.statTarget)
          const count = { value: 0 }
          const startAt = index * 0.16

          counter.textContent = '00'
          timeline.fromTo(
            item,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' },
            startAt,
          )
          timeline.to(
            count,
            {
              value: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                counter.textContent = formatValue(Math.round(count.value))
              },
            },
            startAt,
          )
        })
      },
    )

    return () => motionMedia.revert()
  }, [])

  return (
    <section
      className="editorial-stats section-pad"
      aria-label="VASTRAA by the numbers"
      ref={sectionRef}
    >
      <div className="editorial-stats__grid">
        {statistics.map((stat) => (
          <div className="editorial-stats__item" key={stat.label}>
            <span className="editorial-stats__number" data-stat-target={stat.value}>
              {formatValue(stat.value)}
            </span>
            <p className="editorial-stats__label">{stat.label}</p>
            <p className="editorial-stats__caption">{stat.caption}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EditorialStatsSection
