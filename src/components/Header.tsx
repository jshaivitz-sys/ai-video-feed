"use client";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">

        <div className="text-green-400 font-bold tracking-wider text-lg">
          BOTFLIXER
        </div>

        <div className="text-xs text-zinc-400">
          infinite ai video feed
        </div>

      </div>
    </div>
  );
}