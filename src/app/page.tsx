"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "@/components/Header"

export default function Home() {

  const [videos, setVideos] = useState<any[]>([])
  const [profiles, setProfiles] = useState<Record<string,string>>({})
  const [likes, setLikes] = useState<Record<string,number>>({})
  const [user, setUser] = useState<any>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    init()
  }, [])

  async function init() {

    const { data } = await supabase.auth.getUser()
    setUser(data.user)

    const { data: videosData } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })

    if (!videosData) return

    setVideos(videosData)

    // get unique user ids
    const userIds = Array.from(
      new Set(
        videosData
          .map(v => v.user_id)
          .filter(Boolean)
      )
    )

    if (userIds.length > 0) {

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds)

      const profileMap: Record<string,string> = {}

      profileData?.forEach(p => {
        profileMap[p.id] = p.display_name
      })

      setProfiles(profileMap)

    }

    // get likes
    const videoIds = videosData.map(v => v.id)

    if (videoIds.length > 0) {

      const { data: likesData } = await supabase
        .from("likes")
        .select("video_id")
        .in("video_id", videoIds)

      const likeMap: Record<string,number> = {}

      likesData?.forEach(l => {
        likeMap[l.video_id] = (likeMap[l.video_id] || 0) + 1
      })

      setLikes(likeMap)

    }

  }

  async function toggleLike(video:any) {

    if (!user) return

    const { data: existing } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("video_id", video.id)
      .maybeSingle()

    if (existing) {

      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("video_id", video.id)

      setLikes(prev => ({
        ...prev,
        [video.id]: Math.max((prev[video.id] || 1) - 1, 0)
      }))

    } else {

      await supabase
        .from("likes")
        .insert({
          user_id: user.id,
          video_id: video.id
        })

      setLikes(prev => ({
        ...prev,
        [video.id]: (prev[video.id] || 0) + 1
      }))

    }

  }

  function observeVideo(el:HTMLVideoElement | null) {

    if (!el) return

    if (!observerRef.current) {

      observerRef.current = new IntersectionObserver(entries => {

        entries.forEach(entry => {

          const video = entry.target as HTMLVideoElement

          if (entry.isIntersecting) video.play().catch(()=>{})
          else video.pause()

        })

      }, { threshold:0.7 })

    }

    observerRef.current.observe(el)

  }

  return (

    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">

      <Header />

      {videos.map((video,i)=> (

        <div
          key={video.id}
          className="h-screen w-screen snap-start relative flex items-center justify-center bg-black"
        >

          <video
            ref={(el)=>observeVideo(el)}
            src={video.video_url}
            playsInline
            muted
            loop
            preload={i < 2 ? "auto" : "metadata"}
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-24 left-6 text-white">

            <div className="font-bold">
              @{profiles[video.user_id] ?? "anon"}
            </div>

            <div>{video.caption}</div>

          </div>

          <button
            onClick={()=>toggleLike(video)}
            className="absolute right-6 bottom-32 text-white text-4xl"
          >
            ❤️
            <div className="text-sm">
              {likes[video.id] ?? 0}
            </div>
          </button>

        </div>

      ))}

    </div>

  )

}