"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface ConnectWalletButtonProps {
  onConnect: () => void
}

export function ConnectWalletButton({ onConnect }: ConnectWalletButtonProps) {
  const [connecting, setConnecting] = useState(false)

  const handleConnect = () => {
    setConnecting(true)

    // Simulate wallet connection
    setTimeout(() => {
      setConnecting(false)
      onConnect()
    }, 1500)
  }

  return (
    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleConnect} disabled={connecting}>
      {connecting ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
