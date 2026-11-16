import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import campaignFilm from '../assets/videoplayback (2).mp4'

function CampaignFilmSection() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    const upperPanel = section?.querySelector('.campaign-film__panel--upper')
    const lowerPanel = section?.querySelector('.campaign-film__panel--lower')

    if (!section || !video || !upperPanel || !lowerPanel) return undefined

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let isVisible = false
    let isRevealed = false
    let isOpening = false
    let playPending = false
    let playbackFailed = false
    let videoFrameCallback = null
    let animationFrame = null
    let openingTimeline

    const context = gsap.context(() => {
      openingTimeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          isRevealed = true
          isOpening = false
        },
      })
        .to(upperPanel, { yPercent: -101, duration: 1.55, ease: 'power4.inOut' }, 0)
        .to(lowerPanel, { yPercent: 101, duration: 1.55, ease: 'power4.inOut' }, 0)
    }, section)

    const revealPanels = (animate = true) => {
      if (isRevealed || isOpening) return
      isOpening = true

      if (animate && !motionPreference.matches) {
        openingTimeline.play()
      } else {
        openingTimeline.progress(1).pause()
        isRevealed = true
        isOpening = false
      }
    }

    const reportPlaybackFailure = (error) => {
      if (playbackFailed) return
      playbackFailed = true
      console.warn('The VASTRAA campaign film could not start automatically.', error)
      if (isVisible) revealPanels()
    }

    const revealOnVideoFrame = () => {
      const reveal = () => {
        videoFrameCallback = null
        animationFrame = null
        if (isVisible && !video.paused) revealPanels()
      }

      if (typeof video.requestVideoFrameCallback === 'function') {
        videoFrameCallback = video.requestVideoFrameCallback(reveal)
      } else {
        animationFrame = window.requestAnimationFrame(reveal)
      }
    }

    const startPlayback = async () => {
      if (
        motionPreference.matches
        || playbackFailed
        || playPending
        || !video.paused
      ) return

      playPending = true
      try {
        await video.play()
        if (!isVisible) {
          video.pause()
          return
        }
        revealOnVideoFrame()
      } catch (error) {
        if (error.name !== 'AbortError') reportPlaybackFailure(error)
      } finally {
        playPending = false
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2
      if (nextVisible === isVisible) return

      isVisible = nextVisible
      if (isVisible) {
        if (playbackFailed) revealPanels()
        else startPlayback()
      } else {
        if (videoFrameCallback !== null && typeof video.cancelVideoFrameCallback === 'function') {
          video.cancelVideoFrameCallback(videoFrameCallback)
          videoFrameCallback = null
        }
        if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame)
          animationFrame = null
        }
        video.pause()
      }
    }, { threshold: [0, 0.2] })

    const handleMotionChange = (event) => {
      if (event.matches) {
        video.pause()
        if (isOpening) {
          openingTimeline.progress(1).pause()
        } else {
          revealPanels(false)
        }
      } else if (isVisible) {
        startPlayback()
      }
    }

    const handleVideoError = () => {
      reportPlaybackFailure(video.error || new Error('The local video asset failed to load.'))
    }

    if (motionPreference.matches) revealPanels(false)
    observer.observe(section)
    motionPreference.addEventListener('change', handleMotionChange)
    video.addEventListener('error', handleVideoError)

    return () => {
      observer.disconnect()
      motionPreference.removeEventListener('change', handleMotionChange)
      video.removeEventListener('error', handleVideoError)
      video.pause()
      if (videoFrameCallback !== null && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(videoFrameCallback)
      }
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      context.revert()
    }
  }, [])

  return (
    <section className="campaign-film" ref={sectionRef} aria-labelledby="campaign-film-title">
      <div className="campaign-film__stage">
        <video
          ref={videoRef}
          className="campaign-film__video"
          src={campaignFilm}
          muted
          playsInline
          loop
          preload="metadata"
          aria-label="VASTRAA 2026 fashion campaign film"
        />
        <div className="campaign-film__panel campaign-film__panel--upper" aria-hidden="true" />
        <div className="campaign-film__panel campaign-film__panel--lower" aria-hidden="true" />
        <h2 className="campaign-film__title" id="campaign-film-title">2026</h2>
      </div>
    </section>
  )
}

export default CampaignFilmSection
