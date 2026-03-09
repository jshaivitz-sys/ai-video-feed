"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "@/components/Header"
import VideoOverlay from "@/components/VideoOverlay"

const PAGE_SIZE = 6

export default function Home() {

  const [videos,setVideos] = useState<any[]>([])
  const [profiles,setProfiles] = useState<Record<string,string>>({})
  const [page,setPage] = useState(0)
  const [loading,setLoading] = useState(false)
  const [hasMore,setHasMore] = useState(true)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    fetchVideos(0,true)
  },[])

  useEffect(()=>{
    setupInfiniteScroll()
  },[videos])

  async function fetchVideos(pageNumber:number,reset=false){

    if(loading) return
    setLoading(true)

    const from = pageNumber * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const {data,error} = await supabase
      .from("videos")
      .select("*")
      .order("created_at",{ascending:false})
      .range(from,to)

    if(error){
      console.error(error)
      setLoading(false)
      return
    }

    if(!data){
      setLoading(false)
      return
    }

    // get display names separately
    const userIds = data.map(v => v.user_id).filter(Boolean)

    if(userIds.length){

      const {data:profileRows} = await supabase
        .from("profiles")
        .select("id,display_name")
        .in("id",userIds)

      if(profileRows){

        const map:Record<string,string> = {}

        profileRows.forEach((p:any)=>{
          map[p.id] = p.display_name
        })

        setProfiles(prev=>({...prev,...map}))
      }

    }

    if(data.length < PAGE_SIZE) setHasMore(false)

    if(reset){
      setVideos(data)
      setPage(1)
    }else{
      setVideos(prev=>[...prev,...data])
      setPage(pageNumber+1)
    }

    setLoading(false)
  }

  function observeVideo(el:HTMLVideoElement | null){

    if(!el) return

    if(!observerRef.current){

      observerRef.current = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

          const video = entry.target as HTMLVideoElement

          if(entry.isIntersecting){

            document.querySelectorAll("video").forEach(v=>{
              if(v !== video){
                const vid = v as HTMLVideoElement
                vid.pause()
                vid.muted = true
              }
            })

            video.play().catch(()=>{})

          }else{

            video.pause()

          }

        })

      },{
        threshold:0.6
      })
    }

    observerRef.current.observe(el)
  }

  function setupInfiniteScroll(){

    const el = sentinelRef.current
    if(!el) return

    const io = new IntersectionObserver(entries=>{

      if(entries[0].isIntersecting && hasMore && !loading){
        fetchVideos(page)
      }

    })

    io.observe(el)
  }

  return (

    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">

      <Header/>

      <main className="pt-16">

        {videos.map((video,i)=>(

          <div
            key={video.id}
            className="video-container h-screen w-screen snap-start relative flex items-center justify-center bg-black"
          >

            <video
              ref={(el)=>observeVideo(el)}
              src={video.video_url}
              autoPlay
              loop
              muted
              playsInline
              preload={i < 3 ? "auto" : "metadata"}
              className="h-full w-full object-cover"
            />

            <VideoOverlay/>

            <div className="absolute bottom-24 left-6 text-white z-20">

              <div className="font-bold">
                @{profiles[video.user_id] || "anon"}
              </div>

              <div>{video.caption}</div>

            </div>

          </div>

        ))}

        <div
          ref={sentinelRef}
          className="h-20 flex items-center justify-center text-white"
        >
          {loading && "Loading more..."}
        </div>

      </main>

    </div>

  )
}