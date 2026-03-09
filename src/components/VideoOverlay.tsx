"use client"

import { useEffect, useState } from "react"

export default function VideoOverlay({ videoRef }: any) {

  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  function togglePlay() {
    const video = videoRef.current
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
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setMuted(video.muted)
  }

  useEffect(() => {

    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.play()

    const updateProgress = () => {
      if (!video.duration) return
      setProgress((video.currentTime / video.duration) * 100)
    }

    video.addEventListener("timeupdate", updateProgress)

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
    }

  }, [videoRef])

  return (
    <>

      {/* Play / Pause Button */}

      <button
        onClick={togglePlay}
        className="absolute top-6 left-6 text-white text-3xl z-20"
      >
        {playing ? "❚❚" : "▶"}
      </button>


      {/* Mute Button */}

      {!muted && (
        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 text-white text-2xl z-20"
        >
          🔊
        </button>
      )}


      {/* Hear Sound Overlay */}

      {muted && (
        <button
          onClick={toggleMute}
          className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold z-10"
        >
          Hear Sound
        </button>
      )}


      {/* Timeline */}

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">

        <div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />

      </div>

    </>
  )
}