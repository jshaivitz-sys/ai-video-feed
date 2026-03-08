"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "@/components/Header"
import VideoOverlay from "@/components/VideoOverlay"

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
    getUser()
    fetchVideos(0)
  }, [])

  useEffect(() => {
    setupInfiniteScroll()
  }, [videos])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  async function fetchVideos(pageNumber: number) {
    if (loading) return

    setLoading(true)

    const from = pageNumber * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error("Supabase fetch error:", error)
      setLoading(false)
      return
    }

    if (!data) {
      setLoading(false)
      return
    }

    if (data.length < PAGE_SIZE) {
      setHasMore(false)
    }

    setVideos((prev) => [...prev, ...data])
    setPage(pageNumber + 1)
    setLoading(false)
  }

  async function likeVideo(video: any) {
    const { error } = await supabase
      .from("videos")
      .update({ likes: video.likes + 1 })
      .eq("id", video.id)

    if (error) {
      console.error("Like update failed:", error)
      return
    }

    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id ? { ...v, likes: v.likes + 1 } : v
      )
    )
  }

  function observeVideo(el: HTMLVideoElement | null) {
    if (!el) return

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement

            if (entry.isIntersecting) {
              video.play().catch(() => {})
            } else {
              video.pause()
            }
          })
        },
        { threshold: 0.7 }
      )
    }

    observerRef.current.observe(el)
  }

  function setupInfiniteScroll() {
    if (!sentinelRef.current) return

    const infiniteObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchVideos(page)
        }
      },
      { threshold: 1 }
    )

    infiniteObserver.observe(sentinelRef.current)
  }

  if (!loading && videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        No videos yet. Be the first to upload.
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">

      <Header />

      {user && (
        <a
          href="/upload"
          className="fixed top-20 right-6 z-50 bg-white text-black px-4 py-2 rounded"
        >
          Upload
        </a>
      )}

      {!user && (
        <a
          href="/login"
          className="fixed top-20 right-6 z-50 bg-white text-black px-4 py-2 rounded"
        >
          Login
        </a>
      )}

      {videos.map((video, i) => (
        <div
          key={video.id}
          className="h-screen w-screen snap-start relative flex items-center justify-center bg-black"
        >
          <video
            ref={(el) => observeVideo(el)}
            src={video.video_url}
            loop
            muted
            playsInline
            preload={i < 2 ? "auto" : "metadata"}
            className="h-full w-full object-cover"
          />

          <VideoOverlay />

          <div className="absolute bottom-20 left-6 text-white">
            <div className="font-bold">@anonymous</div>
            <div>{video.caption}</div>
          </div>

          <button
            onClick={() => likeVideo(video)}
            className="absolute right-6 bottom-24 text-white text-3xl transition-transform active:scale-150"
          >
            ❤️ {video.likes}
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