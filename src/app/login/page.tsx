"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {

  const [email,setEmail] = useState("")
  const [displayName,setDisplayName] = useState("")
  const [loading,setLoading] = useState(false)

  async function login() {

    if(!email || !displayName){
      alert("Please enter email and display name")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options:{
        emailRedirectTo: window.location.origin
      }
    })

    if(error){
      alert(error.message)
      setLoading(false)
      return
    }

    alert("Check your email for the login link")

    setLoading(false)

  }

  async function saveProfile() {

    const { data:{user} } = await supabase.auth.getUser()

    if(!user) return

    await supabase
      .from("profiles")
      .upsert({
        id:user.id,
        display_name:displayName
      })

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-80 space-y-4">

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          placeholder="Display Name"
          value={displayName}
          onChange={(e)=>setDisplayName(e.target.value)}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded"
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-green-400 text-black font-semibold p-3 rounded"
        >
          {loading ? "Sending..." : "Send Login Link"}
        </button>

        <button
          onClick={saveProfile}
          className="w-full bg-white text-black p-3 rounded"
        >
          Save Display Name
        </button>

      </div>

    </div>

  )
}