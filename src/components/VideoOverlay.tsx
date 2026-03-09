"use client"

import { useEffect, useState } from "react"

export default function VideoOverlay() {

  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  function getVideo(el: HTMLElement): HTMLVideoElement | null {
    const container = el.closest(".video-container")
    if (!container) return null
    return container.querySelector("video")
  }

  function togglePlay(e: any) {
    const video = getVideo(e.currentTarget)
    if (!video) return

    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  function toggleMute(e: any) {
    const video = getVideo(e.currentTarget)
    if (!video) return

    video.muted = !video.muted
    setMuted(video.muted)
  }

  useEffect(() => {

    const videos = document.querySelectorAll("video")

    videos.forEach(video => {

      const update = () => {
        if (!video.duration) return
        const pct = (video.currentTime / video.duration) * 100
        setProgress(pct)
      }

      video.addEventListener("timeupdate", update)

    })

  }, [])

  return (

    <div className="absolute inset-0 pointer-events-none">

      {/* Play / Pause */}

      <button
        onClick={togglePlay}
        className="absolute top-6 left-6 text-white text-3xl pointer-events-auto"
      >
        {playing ? "❚❚" : "▶"}
      </button>

      {/* Mute / Unmute */}

      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 text-white text-2xl pointer-events-auto"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Hear Sound Overlay */}

      {muted && (
        <button
          onClick={toggleMute}
          className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold pointer-events-auto"
        >
          Hear Sound
        </button>
      )}

      {/* Timeline */}

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

    </div>

  )
}