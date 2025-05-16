"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function ConnectWalletPage() {
  const router = useRouter()
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = (walletName: string) => {
    setConnecting(walletName)

    // Simulate connection
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const wallets = [
    {
      name: "MetaMask",
      icon: "/placeholder.svg?height=40&width=40&text=MM",
      description: "Connect to your MetaMask wallet",
    },
    {
      name: "Coinbase Wallet",
      icon: "/placeholder.svg?height=40&width=40&text=CB",
      description: "Connect to your Coinbase wallet",
    },
    {
      name: "WalletConnect",
      icon: "/placeholder.svg?height=40&width=40&text=WC",
      description: "Connect using WalletConnect",
    },
    {
      name: "Phantom",
      icon: "/placeholder.svg?height=40&width=40&text=PH",
      description: "Connect to your Phantom wallet",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl">
              Filmint
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center text-sm mb-4 hover:text-primary justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Connect your wallet to start creating and minting NFTs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4"
                onClick={() => handleConnect(wallet.name)}
                disabled={connecting !== null}
              >
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image src={wallet.icon || "/placeholder.svg"} alt={wallet.name} width={40} height={40} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-xs text-muted-foreground">{wallet.description}</div>
                  </div>
                  {connecting === wallet.name && (
                    <div className="ml-2 h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                  )}
                </div>
              </Button>
            ))}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>
              New to Ethereum?{" "}
              <a
                href="https://ethereum.org/wallets/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Learn about wallets
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
