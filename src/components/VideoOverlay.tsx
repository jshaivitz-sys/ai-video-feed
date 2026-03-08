"use client";

import LikeButton from "./LikeButton";

export default function VideoOverlay() {
  return (
    <div>

      {/* Right controls */}

      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-4">
        <LikeButton />
      </div>

      {/* watermark */}

      <div className="absolute bottom-3 left-3 text-xs text-green-400 opacity-70">
        botflixer.com
      </div>

      {/* instruction */}

      <div className="absolute bottom-3 right-3 text-xs text-zinc-400">
        swipe for more
      </div>

    </div>
  );
}