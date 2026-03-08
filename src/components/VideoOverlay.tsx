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

  function toggleSound(e: any) {

    e.stopPropagation()

    const videoEl =
      e.currentTarget.closest(".video-container")
      ?.querySelector("video")

    if (!videoEl) return

    videoEl.muted = false
    videoEl.play()

    setMuted(false)

  }

  return (

    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white pointer-events-none">

      {/* Hear Sound Overlay */}

      {muted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">

          <button
            onClick={toggleSound}
            className="bg-black/70 px-5 py-3 rounded-lg text-white text-lg font-semibold backdrop-blur"
          >
            🔊 Hear Sound
          </button>

        </div>
      )}

      {/* Like Button */}

      <div className="flex justify-end pointer-events-auto">

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