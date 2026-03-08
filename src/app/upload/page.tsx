"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import AuthCard from "@/components/AuthCard"

export default function UploadPage() {

  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [uploading, setUploading] = useState(false)

  async function uploadVideo() {

    if (!file) {
      alert("Please select a video file")
      return
    }

    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(fileName, file)

    if (error) {
      console.error(error)
      alert("Upload failed")
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from("videos")
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData.publicUrl

    const { error: insertError } = await supabase
      .from("videos")
      .insert({
        video_url: publicUrl,
        caption
      })

    if (insertError) {
      console.error(insertError)
      alert("Database insert failed")
    } else {
      alert("Video uploaded!")
      setFile(null)
      setCaption("")
    }

    setUploading(false)
  }

  return (
    <AuthCard title="Upload Video">

      <div className="space-y-4">

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white"
        />

        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white"
        />

        <button
          onClick={uploadVideo}
          disabled={uploading}
          className="w-full bg-green-400 text-black font-semibold py-3 rounded hover:bg-green-300 transition"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>

      </div>

    </AuthCard>
  )
}