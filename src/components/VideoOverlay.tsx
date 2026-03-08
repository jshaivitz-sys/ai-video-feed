"use client"

import { useEffect, useState } from "react"

export default function VideoOverlay({
  video,
  toggleLike
}: {
  video: any
  toggleLike: (video: any) => void
}) {

  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)

  function getVideo(el: any) {
    return el.closest(".video-container")?.querySelector("video")
  }

  function revealControls() {

    setShowControls(true)

    setTimeout(() => {
      setShowControls(false)
    }, 2000)

  }

  function togglePlay(e: any) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }

    revealControls()

  }

  function toggleVolume(e: any) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    v.muted = !v.muted
    setMuted(v.muted)

    revealControls()

  }

  function unmute(e: any) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    v.muted = false
    v.volume = 1

    setMuted(false)
    revealControls()

  }

  function updateProgress(e: any) {

    const v = e.target
    const percent = (v.currentTime / v.duration) * 100
    setProgress(percent)

  }

  function seek(e: any) {

    const v = getVideo(e.currentTarget)
    if (!v) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width

    v.currentTime = percent * v.duration

  }

  function handleTap() {
    revealControls()
  }

  useEffect(() => {

    const videos = document.querySelectorAll("video")

    videos.forEach(v => {
      v.addEventListener("timeupdate", updateProgress)
    })

    return () => {
      videos.forEach(v => {
        v.removeEventListener("timeupdate", updateProgress)
      })
    }

  }, [])

  return (

    <div
      className="absolute inset-0 flex flex-col justify-end"
      onClick={handleTap}
    >

      {/* Floating Unmute Button */}

      {muted && (

        <div className="absolute inset-0 flex items-center justify-center">

          <button
            onClick={unmute}
            className="bg-black/70 text-white px-5 py-3 rounded-lg text-lg backdrop-blur"
          >
            🔊 Hear Sound
          </button>

        </div>

      )}

      {/* Controls */}

      <div
        className={`p-4 space-y-2 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >

        {/* Timeline */}

        <div
          onClick={seek}
          className="w-full h-1 bg-white/30 rounded cursor-pointer"
        >
          <div
            className="h-1 bg-white rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}

        <div className="flex items-center justify-between text-white">

          <div className="flex items-center gap-4">

            <button
              onClick={togglePlay}
              className="text-xl"
            >
              {playing ? "❚❚" : "▶"}
            </button>

            <button
              onClick={toggleVolume}
              className="text-xl"
            >
              {muted ? "🔇" : "🔊"}
            </button>

          </div>

          <div className="flex items-center gap-6">

            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleLike(video)
              }}
              className="text-xl"
            >
              ❤️
            </button>

            <div className="text-xl opacity-70">
              ↓
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}