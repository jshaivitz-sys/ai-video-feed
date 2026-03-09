"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function UploadPage(){

  const [file,setFile] = useState<File | null>(null)
  const [caption,setCaption] = useState("")

  async function uploadVideo(){

    if(!file) return

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("videos")
      .upload(fileName,file)

    if(error){
      alert("Upload failed")
      return
    }

    const {data:publicUrlData} = supabase.storage
      .from("videos")
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData.publicUrl

    const {data:{user}} = await supabase.auth.getUser()

    await supabase
      .from("videos")
      .insert({
        video_url:publicUrl,
        caption,
        user_id:user?.id
      })

    alert("Uploaded!")

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="space-y-4 w-80">

        <input
          type="file"
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
        />

        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e)=>setCaption(e.target.value)}
          className="w-full p-3 bg-zinc-900"
        />

        <button
          onClick={uploadVideo}
          className="w-full bg-green-400 text-black p-3"
        >
          Upload
        </button>

      </div>

    </div>

  )
}