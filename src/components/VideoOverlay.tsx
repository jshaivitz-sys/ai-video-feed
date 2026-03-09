"use client"

import { useEffect, useState } from "react"

export default function VideoOverlay({ videoRef }: any) {

  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  function togglePlay() {
    const video = videoRef?.current
    if (!video) return

    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  function toggleMute() {
    const video = videoRef?.current
    if (!video) return

    video.muted = !video.muted
    setMuted(video.muted)
  }

  useEffect(() => {

    const video = videoRef?.current
    if (!video) return

    video.muted = true

    const update = () => {
      if (!video.duration) return
      setProgress((video.currentTime / video.duration) * 100)
    }

    video.addEventListener("timeupdate", update)

    return () => {
      video.removeEventListener("timeupdate", update)
    }

  }, [videoRef])

  return (

    <div className="absolute inset-0 z-20 pointer-events-none">

      {/* PLAY / PAUSE */}

      <button
        onClick={togglePlay}
        className="absolute top-6 left-6 text-white text-3xl pointer-events-auto"
      >
        {playing ? "❚❚" : "▶"}
      </button>

      {/* MUTE */}

      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 text-white text-2xl pointer-events-auto"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* HEAR SOUND */}

      {muted && (
        <button
          onClick={toggleMute}
          className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold pointer-events-auto"
        >
          Hear Sound
        </button>
      )}

      {/* TIMELINE */}

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 pointer-events-none">

        <div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>

  )
}