"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "@/components/Header"
import VideoOverlay from "@/components/VideoOverlay"
import { motion } from "framer-motion"

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
    const user = data.user

    setUser(user)

    if (user) {

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      if (!profile) {

        const pendingName = localStorage.getItem("pending_display_name")

        if (pendingName) {

          await supabase
            .from("profiles")
            .insert({
              id: user.id,
              display_name: pendingName
            })

          localStorage.removeItem("pending_display_name")

        }

      }

    }

    fetchVideos(0, true)

  }

  async function fetchVideos(pageNumber: number, reset=false) {

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
      .order("created_at",{ascending:false})
      .range(from,to)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (!data) {
      setLoading(false)
      return
    }

    if (data.length < PAGE_SIZE) setHasMore(false)

    if (reset) {
      setVideos(data)
      setPage(1)
    } else {
      setVideos(prev => [...prev,...data])
      setPage(pageNumber+1)
    }

    setLoading(false)

  }

  async function toggleLike(video:any){

    if(!user) return

    const { data:existing } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id",user.id)
      .eq("video_id",video.id)
      .maybeSingle()

    if(existing){

      await supabase
        .from("likes")
        .delete()
        .eq("user_id",user.id)
        .eq("video_id",video.id)

    } else {

      await supabase
        .from("likes")
        .insert({
          user_id:user.id,
          video_id:video.id
        })

    }

    fetchVideos(0,true)

  }

  function observeVideo(el:HTMLVideoElement|null){

    if(!el) return

    if(!observerRef.current){

      observerRef.current=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

          const video=entry.target as HTMLVideoElement

          if(entry.isIntersecting) video.play().catch(()=>{})
          else video.pause()

        })

      },{threshold:0.7})

    }

    observerRef.current.observe(el)

  }

  function setupInfiniteScroll(){

    if(!sentinelRef.current) return

    const infiniteObserver=new IntersectionObserver(entries=>{

      if(entries[0].isIntersecting && hasMore){
        fetchVideos(page)
      }

    })

    infiniteObserver.observe(sentinelRef.current)

  }

  return(

    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black pt-16">

      <Header/>

      {videos.map((video,i)=>(

        <motion.div
          key={video.id}
          drag="y"
          dragConstraints={{top:0,bottom:0}}
          dragElastic={0.2}
          className="video-container h-screen w-screen snap-start relative flex items-center justify-center bg-black"
        >

          <video
            ref={(el)=>observeVideo(el)}
            src={video.video_url}
            loop
            muted
            playsInline
            preload={i<2?"auto":"metadata"}
            className="h-full w-full object-cover"
          />

          <VideoOverlay video={video} toggleLike={toggleLike}/>

          <div className="absolute bottom-24 left-6 text-white">

            <div className="font-bold">
              @{video.profiles?.display_name || "anon"}
            </div>

            <div>{video.caption}</div>

          </div>

        </motion.div>

      ))}

      <div ref={sentinelRef} className="h-20 flex items-center justify-center text-white">
        {loading && "Loading more..."}
        {!hasMore && "End of feed"}
      </div>

    </div>

  )

}