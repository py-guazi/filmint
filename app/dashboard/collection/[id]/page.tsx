"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, PlusCircle, ExternalLink, Share2, MoreHorizontal } from "lucide-react"

export default function CollectionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const collectionId = params.id

  // Mock data for the collection
  const collection = {
    id: collectionId,
    name: "Cosmic Explorers",
    description: "A collection of space explorers traversing the universe",
    items: 12,
    image: "/placeholder.svg?height=400&width=400",
    contractAddress: "0x1234...5678",
    creator: "0xabcd...ef12",
    createdAt: "2023-05-15",
  }

  // Mock data for NFTs in the collection
  const nfts = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Cosmic Explorer #${i + 1}`,
    description: "A brave explorer of the cosmic universe",
    image: `/placeholder.svg?height=400&width=400&text=NFT%20${i + 1}`,
    tokenId: i + 1,
    owner: i < 3 ? collection.creator : `0x9876...${i}432`,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-12">
        <Link href="/dashboard" className="flex items-center text-sm mb-8 hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image src={collection.image || "/placeholder.svg"} alt={collection.name} fill className="object-cover" />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{collection.name}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">{collection.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-muted-foreground">Items</div>
                <div className="font-medium">{collection.items}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="font-medium">{collection.createdAt}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">Contract Address</div>
                <div className="font-medium flex items-center">
                  {collection.contractAddress}
                  <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href={`/dashboard/collection/${collectionId}/mint`}>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Mint New NFT
                </Button>
              </Link>
              <Button variant="outline">View on OpenSea</Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{nft.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{nft.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Token ID: {nft.tokenId}</div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Link href={`/dashboard/collection/${collectionId}/mint`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center border-dashed">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <PlusCircle className="h-12 w-12 mb-4 text-muted-foreground" />
                    <CardTitle className="mb-2">Mint New NFT</CardTitle>
                    <CardDescription>Add a new item to your collection</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Activity Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">Track minting, transfers, and sales of your NFTs.</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Settings Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">Manage collection details and permissions.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
