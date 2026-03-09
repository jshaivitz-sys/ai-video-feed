"use client"

export default function VideoOverlay() {

  function getVideo(el: HTMLElement): HTMLVideoElement | null {

    const container = el.closest(".video-container")

    if (!container) return null

    return container.querySelector("video")

  }

  function unmute(e: React.MouseEvent<HTMLButtonElement>) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    v.muted = false
    v.volume = 1
    v.play().catch(()=>{})

  }

  function togglePlay(e: React.MouseEvent<HTMLButtonElement>) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    if (v.paused) {
      v.play().catch(()=>{})
    } else {
      v.pause()
    }

  }

  function toggleMute(e: React.MouseEvent<HTMLButtonElement>) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if (!v) return

    v.muted = !v.muted

  }

  return (

    <div className="absolute inset-0 flex flex-col justify-end z-20 pointer-events-none">

      {/* HEAR SOUND */}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">

        <button
          onClick={unmute}
          className="bg-black/70 text-white px-6 py-3 rounded-lg text-lg backdrop-blur"
        >
          🔊 Hear Sound
        </button>

      </div>

      {/* CONTROLS */}

      <div className="p-4 flex justify-between text-white pointer-events-auto">

        <div className="flex gap-4">

          <button
            onClick={togglePlay}
            className="text-xl"
          >
            ▶ / ❚❚
          </button>

          <button
            onClick={toggleMute}
            className="text-xl"
          >
            🔇 / 🔊
          </button>

        </div>

      </div>

    </div>

  )

}