"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "@/components/Header"
import VideoOverlay from "@/components/VideoOverlay"

const PAGE_SIZE = 6

export default function Home(){

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

    const normalized = data.map(v=>({
      ...v,
      likes: typeof v.likes === "number" ? v.likes : 0
    }))

    const ids = normalized.map(v=>v.user_id).filter(Boolean)

    if(ids.length){

      const {data:profileRows} = await supabase
        .from("profiles")
        .select("id,display_name")
        .in("id",ids)

      if(profileRows){

        const map:Record<string,string> = {}

        profileRows.forEach((p:any)=>{
          if(p.id && p.display_name){
            map[p.id] = p.display_name
          }
        })

        setProfiles(prev=>({...prev,...map}))
      }
    }

    if(normalized.length < PAGE_SIZE) setHasMore(false)

    if(reset){
      setVideos(normalized)
      setPage(1)
    }else{
      setVideos(prev=>[...prev,...normalized])
      setPage(pageNumber+1)
    }

    setLoading(false)
  }

  async function toggleLike(video:any){

    const {data:{user}} = await supabase.auth.getUser()

    if(!user){
      alert("Login to like videos")
      return
    }

    const {data:existing} = await supabase
      .from("likes")
      .select("id")
      .eq("user_id",user.id)
      .eq("video_id",video.id)
      .maybeSingle()

    if(existing){

      await supabase
        .from("likes")
        .delete()
        .eq("id",existing.id)

      setVideos(prev =>
        prev.map(v =>
          v.id === video.id
            ? {...v,likes:Math.max((v.likes||1)-1,0)}
            : v
        )
      )

    }else{

      await supabase
        .from("likes")
        .insert({
          user_id:user.id,
          video_id:video.id
        })

      setVideos(prev =>
        prev.map(v =>
          v.id === video.id
            ? {...v,likes:(v.likes||0)+1}
            : v
        )
      )
    }
  }

  function observeVideo(el:HTMLVideoElement | null){

    if(!el) return

    if(!observerRef.current){

      observerRef.current = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

          const video = entry.target as HTMLVideoElement

          if(entry.isIntersecting){

            document.querySelectorAll("video").forEach(v=>{
              const vid = v as HTMLVideoElement
              if(vid !== video){
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

    if(!sentinelRef.current) return

    const io = new IntersectionObserver(entries=>{

      if(entries[0].isIntersecting && hasMore && !loading){
        fetchVideos(page)
      }

    })

    io.observe(sentinelRef.current)
  }

  return(

    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">

      <Header/>

      <main className="pt-16">

        {videos.map((video,i)=>(

          <div
            key={video.id}
            className="h-screen w-screen snap-start relative flex items-center justify-center bg-black"
          >

            <video
              ref={(el)=>observeVideo(el)}
              src={video.video_url}
              autoPlay
              loop
              defaultMuted
              playsInline
              preload={i < 3 ? "auto" : "metadata"}
              className="h-full w-full object-cover"
            />

            <VideoOverlay/>

            {/* LIKE BUTTON */}

            <div className="absolute right-6 bottom-32 flex flex-col items-center z-30">

              <button
                onClick={()=>toggleLike(video)}
                className="text-white text-4xl active:scale-150 transition"
              >
                ❤️
              </button>

              <div className="text-white text-sm mt-1">
                {video.likes || 0}
              </div>

            </div>

            {/* USERNAME + CAPTION */}

            <div className="absolute bottom-24 left-6 text-white z-20">

              <div className="font-bold">
                @{video.user_id && profiles[video.user_id] ? profiles[video.user_id] : "anon"}
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