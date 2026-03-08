"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import AuthCard from "@/components/AuthCard"

export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function signIn() {
    setLoading(true)

    await supabase.auth.signInWithOtp({
      email
    })

    alert("Check your email for the login link.")

    setLoading(false)
  }

  return (
    <AuthCard title="Login">

      <div className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white outline-none focus:border-green-400"
        />

        <button
          onClick={signIn}
          disabled={loading}
          className="w-full bg-green-400 text-black font-semibold py-3 rounded hover:bg-green-300 transition"
        >
          {loading ? "Sending..." : "Send Login Link"}
        </button>

      </div>

    </AuthCard>
  )
}