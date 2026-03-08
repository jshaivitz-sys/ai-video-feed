"use client"

import { useState } from "react"

export default function VideoOverlay({
  video,
  toggleLike
}: {
  video: any
  toggleLike: (video: any) => void
}) {

  const [muted, setMuted] = useState(true)

  function togglePlay(e: any) {

    const videoEl = e.currentTarget.parentElement.querySelector("video")

    if (!videoEl) return

    if (videoEl.paused) {
      videoEl.play()
    } else {
      videoEl.pause()
    }

  }

  function toggleSound(e: any) {

    e.stopPropagation()

    const videoEl = e.currentTarget.parentElement.querySelector("video")

    if (!videoEl) return

    videoEl.muted = !videoEl.muted
    setMuted(videoEl.muted)

  }

  function rewind(e: any) {

    e.stopPropagation()

    const videoEl = e.currentTarget.parentElement.querySelector("video")

    if (!videoEl) return

    videoEl.currentTime -= 5

  }

  function forward(e: any) {

    e.stopPropagation()

    const videoEl = e.currentTarget.parentElement.querySelector("video")

    if (!videoEl) return

    videoEl.currentTime += 5

  }

  return (

    <div
      onClick={togglePlay}
      className="absolute inset-0 flex flex-col justify-between p-6 text-white"
    >

      {/* Top Controls */}

      <div className="flex justify-end gap-3">

        <button
          onClick={toggleSound}
          className="bg-black/60 px-3 py-2 rounded"
        >
          {muted ? "🔇" : "🔊"}
        </button>

      </div>

      {/* Bottom Controls */}

      <div className="flex justify-between items-end">

        {/* Video Controls */}

        <div className="flex gap-3">

          <button
            onClick={rewind}
            className="bg-black/60 px-3 py-2 rounded"
          >
            ⏪
          </button>

          <button
            onClick={forward}
            className="bg-black/60 px-3 py-2 rounded"
          >
            ⏩
          </button>

        </div>

        {/* Like */}

        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleLike(video)
          }}
          className="text-3xl transition-transform active:scale-150"
        >
          ❤️
        </button>

      </div>

    </div>
  )
}