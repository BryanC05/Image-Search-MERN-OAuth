"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true)
    window.location.href = `/api/auth/${provider}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-slate-800 border-purple-500/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Image Search</h1>
          <p className="text-slate-400">Sign in to explore and save images</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
            className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold"
          >
            Sign in with Google
          </Button>

          <Button
            onClick={() => handleOAuthLogin("facebook")}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Sign in with Facebook
          </Button>

          <Button
            onClick={() => handleOAuthLogin("github")}
            disabled={isLoading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold"
          >
            Sign in with GitHub
          </Button>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">By signing in, you agree to our Terms of Service</p>
      </Card>
    </main>
  )
}
