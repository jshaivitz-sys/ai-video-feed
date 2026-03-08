"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")

  async function signIn() {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    })

    alert("Check your email for the login link!")
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col gap-4 w-72">
        <input
          className="p-2 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={signIn}
          className="bg-green-500 p-2 rounded"
        >
          Sign In / Sign Up
        </button>
      </div>
    </div>
  )
}
