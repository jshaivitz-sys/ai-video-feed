"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"
import AuthCard from "@/components/AuthCard"

export default function LoginPage(){

 const [email,setEmail] = useState("")
 const [displayName,setDisplayName] = useState("")
 const [loading,setLoading] = useState(false)

 async function login(){

  if(!email) return alert("Enter email")
  if(!displayName) return alert("Enter display name")

  setLoading(true)

  localStorage.setItem("display_name",displayName)

  const { error } = await supabase.auth.signInWithOtp({
   email
  })

  if(error){
   console.error(error)
   alert("Login failed")
  } else {
   alert("Check your email for the login link")
  }

  setLoading(false)

 }

 return(

 <AuthCard title="Login">

  <div className="space-y-4">

   <input
    type="text"
    placeholder="Display Name"
    value={displayName}
    onChange={(e)=>setDisplayName(e.target.value)}
    className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white"
   />

   <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    className="w-full bg-black border border-zinc-700 rounded px-4 py-3 text-white"
   />

   <button
    onClick={login}
    disabled={loading}
    className="w-full bg-green-400 text-black font-semibold py-3 rounded hover:bg-green-300 transition"
   >
    {loading ? "Sending link..." : "Login"}
   </button>

  </div>

 </AuthCard>

 )

}