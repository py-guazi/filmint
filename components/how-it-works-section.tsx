import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-950/50" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800/30">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Create Your NFT Collection in 3 Simple Steps
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform makes it easy to create and mint your own NFT collections without any technical knowledge.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                  <span className="text-2xl font-bold text-blue-500">1</span>
                </div>
                <h3 className="text-xl font-bold">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your wallet to get started. We currently support MetaMask only.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                  <span className="text-2xl font-bold text-blue-500">2</span>
                </div>
                <h3 className="text-xl font-bold">Create Your Collection</h3>
                <p className="text-muted-foreground">
                  Set up your ERC-1155 collection with a name, description, and cover image.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                  <span className="text-2xl font-bold text-blue-500">3</span>
                </div>
                <h3 className="text-xl font-bold">Mint Your NFTs</h3>
                <p className="text-muted-foreground">
                  Upload your artwork, set properties, and mint your NFTs with just a few clicks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
