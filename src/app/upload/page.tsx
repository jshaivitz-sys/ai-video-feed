"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")

  async function handleUpload() {
    if (!file) return

    const fileName = Date.now() + "-" + file.name

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(fileName, file)

    if (error) {
      alert("Upload failed")
      return
    }

    const videoUrl =
      "https://mxynpwgthwvnlcinetud.supabase.co/storage/v1/object/public/videos/" +
      fileName

    await supabase.from("videos").insert({
      video_url: videoUrl,
      caption: caption,
      likes: 0,
    })

    alert("Uploaded!")
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <input
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <button
        onClick={handleUpload}
        className="bg-black text-white p-3"
      >
        Upload Video
      </button>
    </div>
  )
}