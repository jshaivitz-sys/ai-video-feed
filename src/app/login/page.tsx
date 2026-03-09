"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {

  const [email,setEmail] = useState("")
  const [displayName,setDisplayName] = useState("")
  const [loading,setLoading] = useState(false)

  async function sendLogin() {

    if(!email || !displayName){
      alert("Enter email and display name")
      return
    }

    // store name locally so we can save it after login
    localStorage.setItem("display_name",displayName)

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

  // runs AFTER user clicks email login link
  useEffect(()=>{

    async function saveProfile(){

      const storedName = localStorage.getItem("display_name")
      if(!storedName) return

      const { data:{user} } = await supabase.auth.getUser()

      if(!user) return

      await supabase
        .from("profiles")
        .upsert({
          id:user.id,
          display_name:storedName
        })

      localStorage.removeItem("display_name")
    }

    saveProfile()

  },[])

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
          onClick={sendLogin}
          disabled={loading}
          className="w-full bg-green-400 text-black font-semibold p-3 rounded"
        >
          {loading ? "Sending..." : "Send Login Link"}
        </button>

      </div>

    </div>

  )
}