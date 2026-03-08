"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "@/components/Header"

const PAGE_SIZE = 10

export default function Home() {

  const [videos, setVideos] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setupInfiniteScroll()
  }, [videos])

  async function init() {

    const { data } = await supabase.auth.getUser()
    setUser(data.user)

    fetchVideos(0)

  }

  async function fetchVideos(pageNumber: number) {

    if (loading) return

    setLoading(true)

    const from = pageNumber * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from("videos")
      .select(`
        *,
        profiles(display_name),
        likes:likes(count)
      `)
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const formatted = data.map((video: any) => ({
      ...video,
      likes: video.likes?.[0]?.count || 0
    }))

    if (formatted.length < PAGE_SIZE) setHasMore(false)

    setVideos(prev => [...prev, ...formatted])
    setPage(pageNumber + 1)
    setLoading(false)

  }

  async function likeVideo(video: any) {

    const { data } = await supabase.auth.getUser()
    if (!data.user) return

    const userId = data.user.id

    const { data: existing } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("video_id", video.id)
      .maybeSingle()

    if (existing) {

      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("video_id", video.id)

      setVideos(prev =>
        prev.map(v =>
          v.id === video.id
            ? { ...v, likes: Math.max((v.likes || 1) - 1, 0) }
            : v
        )
      )

    } else {

      await supabase
        .from("likes")
        .insert({
          user_id: userId,
          video_id: video.id
        })

      setVideos(prev =>
        prev.map(v =>
          v.id === video.id
            ? { ...v, likes: (v.likes || 0) + 1 }
            : v
        )
      )

    }

  }

  function observeVideo(el: HTMLVideoElement | null) {

    if (!el) return

    if (!observerRef.current) {

      observerRef.current = new IntersectionObserver(entries => {

        entries.forEach(entry => {

          const video = entry.target as HTMLVideoElement

          if (entry.isIntersecting) video.play().catch(() => {})
          else video.pause()

        })

      }, { threshold: 0.7 })

    }

    observerRef.current.observe(el)

  }

  function setupInfiniteScroll() {

    if (!sentinelRef.current) return

    const infiniteObserver = new IntersectionObserver(entries => {

      if (entries[0].isIntersecting && hasMore) fetchVideos(page)

    })

    infiniteObserver.observe(sentinelRef.current)

  }

  return (

    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">

      <Header />

      {videos.map((video, i) => (

        <div
          key={video.id}
          className="h-screen w-screen snap-start relative flex items-center justify-center bg-black"
        >

          <video
            ref={observeVideo}
            src={video.video_url}
            loop
            muted
            playsInline
            preload={i < 2 ? "auto" : "metadata"}
            className="h-full w-full object-cover"
          />

          {/* creator */}

          <div className="absolute bottom-24 left-6 text-white">

            <div className="font-bold">
              @{video.profiles?.display_name || "anon"}
            </div>

            <div>{video.caption}</div>

          </div>

          {/* like button */}

          <button
            onClick={() => likeVideo(video)}
            className="absolute right-6 bottom-32 text-white text-4xl active:scale-125 transition"
          >
            ❤️
            <div className="text-sm">{video.likes}</div>
          </button>

        </div>

      ))}

      <div
        ref={sentinelRef}
        className="h-20 flex items-center justify-center text-white"
      >
        {loading && "Loading more..."}
        {!hasMore && "End of feed"}
      </div>

    </div>

  )

}