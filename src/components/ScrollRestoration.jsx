import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Disable native browser scroll restoration immediately so it does not fight SPA transitions
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const STORAGE_KEY = 'vastraa_scroll_positions'
const memoryPositions = new Map()
let lastProcessedSignature = ''

function getSavedPosition(key) {
  if (!key) return undefined
  if (memoryPositions.has(key)) {
    return memoryPositions.get(key)
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data && typeof data[key] === 'object') {
        return data[key]
      }
    }
  } catch {
    // Session storage not available or restricted
  }
  return undefined
}

function savePosition(key, pos) {
  if (!key || !pos) return
  memoryPositions.set(key, pos)
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    data[key] = pos
    const keys = Object.keys(data)
    if (keys.length > 50) {
      delete data[keys[0]]
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Session storage not available or restricted
  }
}

function scrollToCoords(top, left = 0) {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const body = document.body

  root.style.setProperty('scroll-behavior', 'auto', 'important')
  if (body) {
    body.style.setProperty('scroll-behavior', 'auto', 'important')
  }

  // Force layout recalculation to ensure the computed scrollBehavior is 'auto'
  void root.offsetHeight

  try {
    window.scrollTo({
      top,
      left,
      behavior: 'instant',
    })
  } catch {
    window.scrollTo(left, top)
  }

  root.scrollTop = top
  root.scrollLeft = left
  if (body) {
    body.scrollTop = top
    body.scrollLeft = left
  }

  requestAnimationFrame(() => {
    root.style.removeProperty('scroll-behavior')
    if (body) {
      body.style.removeProperty('scroll-behavior')
    }
  })
}

function scrollToFragment(hash) {
  if (!hash) return false
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return false
  const target = document.getElementById(id)
  if (!target) return false

  const rect = target.getBoundingClientRect()
  const targetY = Math.max(0, window.scrollY + rect.top)
  scrollToCoords(targetY, 0)
  return true
}

function useScrollRestoration() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const currentKeyRef = useRef(location.key)
  const previousLocationRef = useRef(location)
  const isInitialMountRef = useRef(true)
  const isProgrammaticScrollRef = useRef(false)
  const rafIdRef = useRef(0)

  // Listen for user scroll events and record position for current key
  useLayoutEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return
      const key = currentKeyRef.current
      if (key) {
        savePosition(key, { x: window.scrollX, y: window.scrollY })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle route navigation scroll restoration
  useLayoutEffect(() => {
    const prevLocation = previousLocationRef.current
    const prevKey = prevLocation.key
    const isInitial = isInitialMountRef.current
    const signature = `${location.key}:${location.pathname}:${location.search}:${location.hash}`

    if (lastProcessedSignature === signature) {
      return
    }
    lastProcessedSignature = signature

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = 0
    }

    // Save previous page position before resetting scroll
    if (!isInitial && prevKey && !isProgrammaticScrollRef.current) {
      savePosition(prevKey, { x: window.scrollX, y: window.scrollY })
    }

    currentKeyRef.current = location.key
    previousLocationRef.current = location

    if (isInitial) {
      isInitialMountRef.current = false
      if (location.hash && scrollToFragment(location.hash)) {
        // Handled by fragment
      } else {
        const saved = getSavedPosition(location.key)
        if (saved && (saved.y > 0 || saved.x > 0)) {
          isProgrammaticScrollRef.current = true
          scrollToCoords(saved.y, saved.x)
          ScrollTrigger.clearScrollMemory('manual')
          rafIdRef.current = requestAnimationFrame(() => {
            ScrollTrigger.refresh()
            isProgrammaticScrollRef.current = false
            rafIdRef.current = 0
          })
        }
      }
      return
    }

    // Determine target scroll position
    let targetY = null
    let targetX = 0

    if (navigationType === 'POP') {
      const saved = getSavedPosition(location.key)
      if (saved) {
        targetY = saved.y ?? 0
        targetX = saved.x ?? 0
      } else if (location.hash && scrollToFragment(location.hash)) {
        targetY = null
      } else {
        targetY = 0
        targetX = 0
      }
    } else if (navigationType === 'PUSH') {
      if (location.hash && scrollToFragment(location.hash)) {
        targetY = null
      } else {
        targetY = 0
        targetX = 0
      }
    } else if (navigationType === 'REPLACE') {
      if (location.pathname !== prevLocation.pathname) {
        targetY = 0
        targetX = 0
      } else if (location.hash && location.hash !== prevLocation.hash) {
        scrollToFragment(location.hash)
        targetY = null
      }
      // Same-route replace preserves current scroll position
    }

    if (targetY !== null) {
      isProgrammaticScrollRef.current = true
      scrollToCoords(targetY, targetX)
      ScrollTrigger.clearScrollMemory('manual')

      // Settle layout across frames for smooth or dynamic content expansion
      let frames = 0
      const settle = () => {
        frames++
        if (targetY > 0 && Math.abs(window.scrollY - targetY) > 2) {
          const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
          if (maxScroll >= targetY) {
            scrollToCoords(targetY, targetX)
          }
        }

        if (frames < 3) {
          rafIdRef.current = requestAnimationFrame(settle)
        } else {
          ScrollTrigger.refresh()
          isProgrammaticScrollRef.current = false
          rafIdRef.current = 0
        }
      }

      rafIdRef.current = requestAnimationFrame(settle)
    }
  }, [location, navigationType])

  return null
}

export default function ScrollRestoration() {
  useScrollRestoration()
  return null
}
