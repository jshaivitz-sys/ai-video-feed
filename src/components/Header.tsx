"use client";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

        {/* Brand */}
        <div className="text-green-400 font-bold tracking-wider text-lg">
          BOTFLIXER
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 text-sm text-zinc-400">

          <a
            href="/terms"
            className="hover:text-white transition-colors"
          >
            Terms
          </a>

        </div>

      </div>
    </div>
  );
}