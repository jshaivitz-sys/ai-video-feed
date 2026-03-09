"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import Link from "next/link"

export default function Header() {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-zinc-800">

      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

        {/* Brand */}
        <div className="flex items-center gap-2 text-green-400 font-bold tracking-wider">
          BOTFLIXER
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 text-sm">

          {/* BOTFLIX LIVE */}
          <a
            href="https://www.youtube.com/@botflixtvhq/live"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white font-semibold hover:text-red-400 transition"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Botflix LIVE
          </a>

          <Link
            href="/terms"
            className="text-zinc-400 hover:text-white transition"
          >
            Terms
          </Link>

          {user ? (
            <Link
              href="/upload"
              className="bg-green-400 text-black px-3 py-1.5 rounded font-semibold hover:bg-green-300 transition"
            >
              Upload
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-white text-black px-3 py-1.5 rounded font-semibold"
            >
              Login
            </Link>
          )}

        </div>

      </div>

    </div>
  )
}