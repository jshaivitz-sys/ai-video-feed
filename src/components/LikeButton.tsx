"use client";

import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  function toggleLike() {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    setLiked(!liked);
  }

  return (
    <div className="flex flex-col items-center gap-1">

      <button
        onClick={toggleLike}
        className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition"
      >
        {liked ? "❤️" : "🤍"}
      </button>

      <span className="text-xs text-white/70">{likes}</span>

    </div>
  );
}