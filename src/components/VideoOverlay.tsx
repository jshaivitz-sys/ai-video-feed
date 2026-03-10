"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function VideoOverlay(props:any){

  const { video, user } = props

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

  async function deleteVideo(){

    if(!video) return

    const confirmDelete = confirm("Delete this video?")
    if(!confirmDelete) return

    const fileName = video.video_url.split("/").pop() || ""

    await supabase.storage
      .from("videos")
      .remove([fileName])

    await supabase
      .from("videos")
      .delete()
      .eq("id",video.id)

    window.location.reload()

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

{/* DELETE BUTTON */}

{video && user && (
  <button
    onClick={deleteVideo}
    className="absolute top-6 right-6 text-white text-2xl pointer-events-auto z-50"
  >
    🗑
  </button>
)}

      {/* PLAY */}

      <button
        onClick={togglePlay}
        className="absolute bottom-6 left-6 text-white text-3xl pointer-events-auto"
      >
        {playing ? "❚❚" : "▶"}
      </button>

      {/* MUTE */}

      <button
        onClick={toggleMute}
        className="absolute bottom-6 left-16 text-white text-2xl pointer-events-auto"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* HEAR SOUND */}

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

      {/* MODEL */}

      {video && (
        <div className="absolute bottom-20 left-6 text-white text-xs space-y-1 pointer-events-none">

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
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>

  )
}