"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage(){

  const [email,setEmail] = useState("")
  const [displayName,setDisplayName] = useState("")

  async function login(){

    const { error } = await supabase.auth.signInWithOtp({
      email
    })

    if(error){
      alert(error.message)
    }else{
      alert("Check your email for login link")
    }

  }

  async function saveProfile(){

    const {data:{user}} = await supabase.auth.getUser()

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

      <div className="space-y-4 w-80">

        <input
          placeholder="Display name"
          value={displayName}
          onChange={(e)=>setDisplayName(e.target.value)}
          className="w-full p-3 bg-zinc-900"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-3 bg-zinc-900"
        />

        <button
          onClick={login}
          className="w-full bg-green-400 text-black p-3"
        >
          Login
        </button>

        <button
          onClick={saveProfile}
          className="w-full bg-white text-black p-3"
        >
          Save Display Name
        </button>

      </div>

    </div>

  )
}