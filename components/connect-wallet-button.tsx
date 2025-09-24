"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { metaMask } from "wagmi/connectors"

interface ConnectWalletButtonProps {
  onConnect?: () => void
}

export function ConnectWalletButton({ onConnect }: ConnectWalletButtonProps) {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    connect(
      { connector: metaMask() },
      {
        onSuccess: () => {
          onConnect?.()
        },
      },
    )
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground" hidden={!isConnected}>0x</span>
      <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleConnect} disabled={isPending}>
        {isPending ? (
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
    </div>
  )
}
