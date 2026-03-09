"use client"

import { useEffect, useState } from "react"

export default function VideoOverlay() {
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  function getVideo(el: any) {
    return el.closest(".video-container")?.querySelector("video") as HTMLVideoElement | null
  }

  function togglePlay(e: any) {
    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    if (v.paused) {
      v.play().catch(() => {})
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  function toggleVolume(e: any) {
    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    v.muted = !v.muted
    setMuted(v.muted)
  }

  function unmute(e: any) {
    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    v.muted = false
    v.volume = 1
    v.play().catch(() => {})
    setMuted(false)
    setPlaying(true)
  }

  function updateProgress(e: any) {
    const v = e.target as HTMLVideoElement
    const percent = v.duration ? (v.currentTime / v.duration) * 100 : 0
    setProgress(percent)
  }

  function scrub(e: any) {
    const timeline = e.currentTarget
    const v = getVideo(timeline)
    if (!v || !v.duration) return

    const rect = timeline.getBoundingClientRect()
    const clientX =
      e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX

    const rawPercent = (clientX - rect.left) / rect.width
    const percent = Math.max(0, Math.min(1, rawPercent))

    v.currentTime = percent * v.duration
  }

  useEffect(() => {
    const videos = document.querySelectorAll("video")

    videos.forEach((v) => {
      v.addEventListener("timeupdate", updateProgress)
    })

    return () => {
      videos.forEach((v) => {
        v.removeEventListener("timeupdate", updateProgress)
      })
    }
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col justify-end z-10">
      {muted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <button
            onClick={unmute}
            className="bg-black/70 text-white px-5 py-3 rounded-lg text-lg backdrop-blur"
          >
            🔊 Hear Sound
          </button>
        </div>
      )}

      <div className="p-4 space-y-2 pointer-events-auto">
        <div
          onMouseDown={scrub}
          onTouchStart={scrub}
          className="w-full h-1 bg-white/30 rounded cursor-pointer"
        >
          <div
            className="h-1 bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white text-xl"
            >
              {playing ? "❚❚" : "▶"}
            </button>

            <button
              onClick={toggleVolume}
              className="text-white text-xl"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          <div className="text-white text-xl opacity-70">↓</div>
        </div>
      </div>
    </div>
  )
}