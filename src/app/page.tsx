"use client"

import { useEffect,useRef,useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "@/components/Header"

const PAGE_SIZE = 10

export default function Home(){

const [videos,setVideos] = useState<any[]>([])
const [profiles,setProfiles] = useState<Record<string,string>>({})
const [user,setUser] = useState<any>(null)
const [page,setPage] = useState(0)
const [loading,setLoading] = useState(false)
const [hasMore,setHasMore] = useState(true)

const observerRef = useRef<IntersectionObserver | null>(null)
const sentinelRef = useRef<HTMLDivElement | null>(null)

useEffect(()=>{
 init()
},[])

useEffect(()=>{
 setupInfiniteScroll()
},[videos])

async function init(){

 const { data } = await supabase.auth.getUser()

 if(data.user){

   setUser(data.user)

   const displayName = localStorage.getItem("display_name")

   if(displayName){

     await supabase
       .from("profiles")
       .upsert({
         id:data.user.id,
         display_name:displayName
       })

   }

 }

 fetchVideos(0)

}

async function fetchVideos(pageNumber:number){

 if(loading) return

 setLoading(true)

 const from = pageNumber * PAGE_SIZE
 const to = from + PAGE_SIZE - 1

 const { data,error } = await supabase
   .from("videos")
   .select("*")
   .order("created_at",{ascending:false})
   .range(from,to)

 if(error || !data){
   console.error(error)
   setLoading(false)
   return
 }

 if(data.length < PAGE_SIZE) setHasMore(false)

 setVideos(prev=>[...prev,...data])
 setPage(pageNumber+1)

 const userIds = [...new Set(data.map(v=>v.user_id).filter(Boolean))]

 if(userIds.length > 0){

   const { data:profileData } = await supabase
     .from("profiles")
     .select("id,display_name")
     .in("id",userIds)

   const map:Record<string,string> = {}

   profileData?.forEach(p=>{
     if(p.display_name) map[p.id] = p.display_name
   })

   setProfiles(prev=>({...prev,...map}))
 }

 setLoading(false)

}

async function likeVideo(video:any){

 if(!user) return

 const { data:existing } = await supabase
   .from("likes")
   .select("id")
   .eq("user_id",user.id)
   .eq("video_id",video.id)
   .maybeSingle()

 if(existing){

   await supabase
     .from("likes")
     .delete()
     .eq("user_id",user.id)
     .eq("video_id",video.id)

   setVideos(prev =>
     prev.map(v =>
       v.id === video.id
         ? { ...v, likes:(v.likes||1)-1 }
         : v
     )
   )

 } else {

   await supabase
     .from("likes")
     .insert({
       user_id:user.id,
       video_id:video.id
     })

   setVideos(prev =>
     prev.map(v =>
       v.id === video.id
         ? { ...v, likes:(v.likes||0)+1 }
         : v
     )
   )

 }

}

function observeVideo(el:HTMLVideoElement|null){

 if(!el) return

 if(!observerRef.current){

   observerRef.current = new IntersectionObserver(entries=>{

     entries.forEach(entry=>{

       const video = entry.target as HTMLVideoElement

       if(entry.isIntersecting){
         video.play().catch(()=>{})
       } else {
         video.pause()
       }

     })

   },{threshold:0.7})

 }

 observerRef.current.observe(el)

}

function setupInfiniteScroll(){

 if(!sentinelRef.current) return

 const infiniteObserver = new IntersectionObserver(entries=>{

   if(entries[0].isIntersecting && hasMore){
     fetchVideos(page)
   }

 })

 infiniteObserver.observe(sentinelRef.current)

}

return(

<div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">

<Header/>

{videos.map((video,i)=>(
<div
 key={video.id}
 className="h-screen w-screen snap-start relative flex items-center justify-center bg-black"
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

<div className="absolute bottom-24 left-6 text-white">

<div className="font-bold">
@{profiles[video.user_id] ?? "anon"}
</div>

<div>{video.caption}</div>

</div>

<button
 onClick={()=>likeVideo(video)}
 className="absolute right-6 bottom-24 text-white text-3xl transition-transform active:scale-150"
>
❤️ {video.likes || 0}
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