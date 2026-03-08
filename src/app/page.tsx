"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {
  const [videos, setVideos] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getUser()
    fetchVideos()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  async function fetchVideos() {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("VIDEOS:", data)
    console.log("ERROR:", error)

    if (data) setVideos(data)
  }

  async function likeVideo(video: any) {
    await supabase
      .from("videos")
      .update({ likes: video.likes + 1 })
      .eq("id", video.id)

    fetchVideos()
  }

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">

      {user && (
        <a
          href="/upload"
          className="fixed top-6 right-6 z-50 bg-white text-black px-4 py-2 rounded"
        >
          Upload
        </a>
      )}

      {!user && (
        <a
          href="/login"
          className="fixed top-6 right-6 z-50 bg-white text-black px-4 py-2 rounded"
        >
          Login
        </a>
      )}

      {videos.map((video) => (
        <div
          key={video.id}
          className="h-screen w-screen snap-start relative flex items-center justify-center bg-black"
        >
          <video
            ref={(el) => {
              if (!el) return

              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting) {
                    el.play()
                  } else {
                    el.pause()
                  }
                },
                { threshold: 0.7 }
              )

              observer.observe(el)
            }}
            src={video.video_url}
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-20 left-6 text-white">
            <div className="font-bold">@anonymous</div>
            <div>{video.caption}</div>
          </div>

          <button
            onClick={() => likeVideo(video)}
            className="absolute right-6 bottom-24 text-white text-2xl"
          >
            ❤️ {video.likes}
          </button>
        </div>
      ))}
    </div>
  )
}