import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Layers, Zap, Shield } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800/30">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything You Need to Create NFTs
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools you need to create, mint, and manage your NFT collections without any
              coding knowledge.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Palette className="h-8 w-8 text-blue-500" />
              <CardTitle>Easy Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Create ERC-1155 collections with a simple, intuitive interface. Upload your artwork, set properties, and
                mint in minutes.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Layers className="h-8 w-8 text-blue-500" />
              <CardTitle>Batch Minting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Mint multiple copies of your NFTs at once with ERC-1155 support, perfect for collectibles, game items,
                and more.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Zap className="h-8 w-8 text-blue-500" />
              <CardTitle>Gas Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our platform optimizes gas usage for minting and transfers, saving you money on transaction fees.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Shield className="h-8 w-8 text-blue-500" />
              <CardTitle>Secure Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Your NFT metadata and images are stored securely on IPFS, ensuring your creations remain accessible and
                immutable.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
