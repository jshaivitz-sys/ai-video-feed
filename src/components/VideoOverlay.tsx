"use client"

import { useEffect, useState } from "react"

export default function VideoOverlay({ videoRef }: any) {
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  const video = videoRef?.current

  function togglePlay() {
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
    if (!video) return

    video.muted = !video.muted
    setMuted(video.muted)
  }

  useEffect(() => {
    if (!video) return

    video.muted = true

    const updateProgress = () => {
      if (!video.duration) return
      setProgress((video.currentTime / video.duration) * 100)
    }

    video.addEventListener("timeupdate", updateProgress)

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
    }
  }, [video])

  return (
    <div className="absolute inset-0 pointer-events-none">

      {/* PLAY / PAUSE */}
      <button
        onClick={togglePlay}
        className="absolute top-6 left-6 text-white text-3xl pointer-events-auto"
      >
        {playing ? "❚❚" : "▶"}
      </button>

      {/* MUTE / UNMUTE */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 text-white text-2xl pointer-events-auto"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* HEAR SOUND BUTTON */}
      {muted && (
        <button
          onClick={toggleMute}
          className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold pointer-events-auto"
        >
          Hear Sound
        </button>
      )}

      {/* TIMELINE */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>

    </div>
  )
}