"use client"

import { useState, useEffect } from "react"
import AnimatedBackground from "../components/AnimatedComponent"
import LoginForm from "../components/LoginForm"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 2000) // Show login after 2 seconds
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <AnimatedBackground />
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${showLogin ? "opacity-100" : "opacity-0"}`}
      >
        <LoginForm />
      </div>
    </div>
  )
}

