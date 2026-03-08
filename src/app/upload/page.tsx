"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import AuthCard from "@/components/AuthCard"

export default function UploadPage() {

  const [videoUrl, setVideoUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)

  async function uploadVideo() {

    setLoading(true)

    const { error } = await supabase
      .from("videos")
      .insert({
        video_url: videoUrl,
        caption
      })

    if (error) {
      alert("Upload failed")
      console.error(error)
    } else {
      alert("Video uploaded!")
      setVideoUrl("")
      setCaption("")
    }

    setLoading(false)
  }

  return (
    <AuthCard title="Upload Video">

      <div className="space-y-4">

        <input
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white outline-none focus:border-green-400"
        />

        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white outline-none focus:border-green-400"
        />

        <button
          onClick={uploadVideo}
          disabled={loading}
          className="w-full bg-green-400 text-black font-semibold py-3 rounded hover:bg-green-300 transition"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>

      </div>

    </AuthCard>
  )
}