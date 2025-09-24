import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Create and Mint Your Own NFT Collections
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Build, deploy, and manage your ERC-1155 NFT collections on Filecoin with our easy-to-use platform. No
                coding required.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <ConnectWalletButton />
              <Link href="#how-it-works">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            <div className="absolute -top-12 -left-12 h-72 w-72 bg-blue-200 rounded-full blur-3xl opacity-30 dark:bg-blue-900/30" />
            <div className="absolute -bottom-16 -right-12 h-72 w-72 bg-blue-300 rounded-full blur-3xl opacity-30 dark:bg-blue-900/30" />
            <div className="relative z-10 overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="grid grid-cols-2 gap-2 p-2">
                {/* Replace these placeholder images with your actual NFT images */}
                <div className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    // src="https://gateway.lighthouse.storage/ipfs/QmPWRfN6E5xzuHiyot1XtBzWQjL2vFKsVMeiUs7A8vqiED"
                    // src="https://bafkreihnmks5636kdztkzh2qxqef2di3zovbzypy4hz4rhr6x3abhmeo6e.ipfs.w3s.link/"
                    src="https://bafkreic6cfavebbgqwadyrygdberypoz3vtgaat3dsp35apdmz525mccuy.ipfs.w3s.link/"
                    alt="NFT artwork 1"
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    src="https://bafkreig6ceig6v2divzovbdre5lx4wlr3rc2jeef3ewckilafgtirlce7a.ipfs.w3s.link/"
                    alt="NFT artwork 2"
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    // src="https://ipfs.io/ipfs/QmWW6mhZtGQ8HA7cA7bxe8egi4G7CYQeQCEr726pGPxw5R/145.png"
                    src="https://gateway.lighthouse.storage/ipfs/QmVR6rKJ8ecDoVFYQGe1ZyLCrkHTdhEoqXK3mx1NTxZwHA"
                    alt="NFT artwork 3"
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    src="https://bafkreigz72atic3cxiwjpcse4bwrjdpl3y6msenf77e6fdpxbmqxswx7ji.ipfs.w3s.link/"
                    alt="NFT artwork 4"
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
