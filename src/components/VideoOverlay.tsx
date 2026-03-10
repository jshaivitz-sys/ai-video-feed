"use client"

import { useEffect, useState } from "react"

export default function VideoOverlay({ video }: { video?: any }) {

  const [playing,setPlaying] = useState(true)
  const [muted,setMuted] = useState(true)
  const [progress,setProgress] = useState(0)

  function getVideo(el: HTMLElement): HTMLVideoElement | null {

    const container = el.closest(".video-container")
    if (!container) return null

    return container.querySelector("video")
  }

  function togglePlay(e:any){

    const videoEl = getVideo(e.currentTarget)
    if(!videoEl) return

    if(videoEl.paused){
      videoEl.play()
      setPlaying(true)
    } else {
      videoEl.pause()
      setPlaying(false)
    }

  }

  function toggleMute(e:any){

    const videoEl = getVideo(e.currentTarget)
    if(!videoEl) return

    videoEl.muted = !videoEl.muted
    setMuted(videoEl.muted)

  }

  useEffect(()=>{

    const videos = document.querySelectorAll("video")

    videos.forEach(video=>{

      const update=()=>{

        if(!video.duration) return

        const pct=(video.currentTime/video.duration)*100
        setProgress(pct)

      }

      video.addEventListener("timeupdate",update)

    })

  },[])

  return (

    <div className="absolute inset-0 z-20 pointer-events-none">

      {/* PLAY / PAUSE */}

      <button
        onClick={togglePlay}
        className="absolute bottom-6 left-6 text-white text-3xl pointer-events-auto"
      >
        {playing ? "❚❚" : "▶"}
      </button>


      {/* MUTE / UNMUTE */}

      <button
        onClick={toggleMute}
        className="absolute bottom-6 left-16 text-white text-2xl pointer-events-auto"
      >
        {muted ? "🔇" : "🔊"}
      </button>


      {/* HEAR SOUND OVERLAY */}

      {muted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

          <button
            onClick={toggleMute}
            className="text-white text-xl font-semibold pointer-events-auto"
          >
            Hear Sound
          </button>

        </div>
      )}


      {/* VIDEO META (Created By + Model) */}

      {video && (
        <div className="absolute bottom-5 left-6 text-white text-xs space-y-1 pointer-events-none">



          {video.model && (
            <div>
              Model: {video.model}
            </div>
          )}

        </div>
      )}


      {/* TIMELINE */}

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 pointer-events-none">

        <div
          className="h-full bg-white transition-all"
          style={{width:`${progress}%`}}
        />

      </div>

    </div>

  )
}