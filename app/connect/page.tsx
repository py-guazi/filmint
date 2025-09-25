"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Wallet } from "lucide-react"
import { useAccount, useConnect } from "wagmi"
import { metaMask } from "wagmi/connectors"
import { useEffect } from "react"

export const runtime = "edge";

export default function ConnectWalletPage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { connect, isPending, error } = useConnect()

  const handleConnect = () => {
    connect({ connector: metaMask() })
  }

  // Redirect to dashboard if already connected
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  const wallets = [
    {
      name: "MetaMask",
      icon: "/placeholder.svg?height=40&width=40&text=MM",
      description: "Connect to your MetaMask wallet",
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
            <CardDescription>Connect MetaMask to start creating and minting NFTs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4 px-4"
              onClick={handleConnect}
              disabled={isPending}
            >
              <div className="flex items-center w-full">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-orange-500 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">MetaMask</div>
                  <div className="text-xs text-muted-foreground">Connect to your MetaMask wallet</div>
                </div>
                {isPending && (
                  <div className="ml-2 h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                )}
              </div>
            </Button>

            {error && <div className="text-sm text-red-500 text-center">{error.message}</div>}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>
              Don't have MetaMask?{" "}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Download here
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
