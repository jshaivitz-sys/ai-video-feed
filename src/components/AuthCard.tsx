"use client"

export default function AuthCard({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">

        <div className="text-center mb-6">

          <div className="text-green-400 text-3xl font-bold tracking-wider">
            BOTFLIXER
          </div>

          <div className="text-zinc-400 text-sm">
            AI Video Feed
          </div>

        </div>

        <h1 className="text-xl text-white font-semibold mb-6 text-center">
          {title}
        </h1>

        {children}

      </div>

    </div>
  )
}