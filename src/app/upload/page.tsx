"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function UploadPage(){

  const [file,setFile] = useState<File | null>(null)
  const [caption,setCaption] = useState("")
  const [createdBy,setCreatedBy] = useState("")
  const [uploading,setUploading] = useState(false)

  async function uploadVideo(){

    if(!file){
      alert("Select a video")
      return
    }

    if(!createdBy){
      alert("Enter creator name")
      return
    }

    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("videos")
      .upload(fileName,file)

    if(error){
      alert("Upload failed")
      setUploading(false)
      return
    }

    const {data:publicUrlData} = supabase.storage
      .from("videos")
      .getPublicUrl(fileName)

    const videoUrl = publicUrlData.publicUrl

    await supabase
      .from("videos")
      .insert({
        video_url:videoUrl,
        caption,
        created_by:createdBy
      })

    alert("Uploaded!")

    setFile(null)
    setCaption("")
    setCreatedBy("")
    setUploading(false)

  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-80 space-y-4">

        <h1 className="text-2xl font-bold text-center">
          Upload Video
        </h1>

        <input
          type="text"
          placeholder="Created By"
          value={createdBy}
          onChange={(e)=>setCreatedBy(e.target.value)}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded"
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
          className="w-full"
        />

        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e)=>setCaption(e.target.value)}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded"
        />

        <button
          onClick={uploadVideo}
          disabled={uploading}
          className="w-full bg-green-400 text-black p-3 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        <p className="text-xs text-zinc-400 text-center">
          If we love your robot content, we may reach out about developing your robot IP for Botflix Live.
        </p>

      </div>

    </div>

  )
}