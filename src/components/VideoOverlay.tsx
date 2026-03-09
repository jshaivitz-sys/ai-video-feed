"use client"

import { useState } from "react"

export default function VideoOverlay() {

  const [muted,setMuted] = useState(true)
  const [paused,setPaused] = useState(false)
  const [progress,setProgress] = useState(0)

  function getVideo(el: HTMLElement): HTMLVideoElement | null {

    const container = el.closest(".video-container")
    if(!container) return null

    return container.querySelector("video")

  }

  function hearSound(e: React.MouseEvent<HTMLButtonElement>) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if(!v) return

    v.muted = false
    v.volume = 1
    v.play().catch(()=>{})

    setMuted(false)

  }

  function togglePlay(e: React.MouseEvent<HTMLButtonElement>) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if(!v) return

    if(v.paused){
      v.play().catch(()=>{})
      setPaused(false)
    }else{
      v.pause()
      setPaused(true)
    }

  }

  function toggleMute(e: React.MouseEvent<HTMLButtonElement>) {

    e.stopPropagation()

    const v = getVideo(e.currentTarget)
    if(!v) return

    v.muted = !v.muted
    setMuted(v.muted)

  }

  function updateProgress(video: HTMLVideoElement){

    if(!video.duration) return

    setProgress((video.currentTime / video.duration) * 100)

  }

  return (

    <div className="absolute inset-0 flex flex-col justify-end z-20 pointer-events-none">

      {/* HEAR SOUND */}

      {muted && (

        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">

          <button
            onClick={hearSound}
            className="bg-black/70 text-white px-6 py-3 rounded-lg text-lg backdrop-blur"
          >
            🔊 Hear Sound
          </button>

        </div>

      )}

      {/* CONTROLS */}

      <div className="p-4 space-y-3 pointer-events-auto">

        {/* TIMELINE */}

        <div className="w-full h-1 bg-white/30 rounded">

          <div
            className="h-1 bg-white"
            style={{ width:`${progress}%` }}
          />

        </div>

        {/* BUTTON ROW */}

        <div className="flex items-center justify-between text-white">

          <div className="flex gap-4">

            <button
              onClick={togglePlay}
              className="text-xl"
            >
              {paused ? "▶" : "❚❚"}
            </button>

            <button
              onClick={toggleMute}
              className="text-xl"
            >
              {muted ? "🔇" : "🔊"}
            </button>

          </div>

          <div className="opacity-70 text-xl">
            ↓
          </div>

        </div>

      </div>

    </div>

  )
}