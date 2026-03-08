"use client"

export default function VideoOverlay({
  video,
  toggleLike
}: {
  video: any
  toggleLike: (video: any) => void
}) {
  return (
    <>
      {/* Like Button */}
      <div className="absolute right-6 bottom-24 flex flex-col items-center text-white">

        <button
          onClick={() => toggleLike(video)}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-2xl transition-transform active:scale-150"
        >
          ❤️
        </button>

        <div className="text-sm mt-1">
          {video.likes?.[0]?.count || 0}
        </div>

      </div>

      {/* Watermark */}
      <div className="absolute bottom-6 left-6 text-green-400 text-sm opacity-80">
        botflixer.com
      </div>

      {/* Swipe hint */}
      <div className="absolute bottom-6 right-6 text-white text-sm opacity-70">
        swipe for more
      </div>
    </>
  )
}