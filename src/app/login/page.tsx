"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import AuthCard from "@/components/AuthCard"

export default function LoginPage() {

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function login() {

    if (!displayName) {
      alert("Please choose a display name")
      return
    }

    if (!email) {
      alert("Enter your email")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    localStorage.setItem("pending_display_name", displayName)

    alert("Check your email for the login link")

    setLoading(false)

  }

  return (

    <AuthCard title="Login to Botflixer">

      <div className="space-y-4">

        <input
          value={displayName}
          onChange={(e)=>setDisplayName(e.target.value)}
          placeholder="Display name"
          className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white"
        />

        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white"
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-green-400 text-black font-semibold py-3 rounded hover:bg-green-300 transition"
        >
          {loading ? "Sending link..." : "Send Login Link"}
        </button>

      </div>

    </AuthCard>

  )

}