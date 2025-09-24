"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Grid3X3, Wallet } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useCollections, useUserStats } from "@/hooks/use-local-database"

export default function DashboardPage() {
  const { isConnected } = useAccount()
  const router = useRouter()

  const { collections, loading: collectionsLoading } = useCollections()
  const { stats, loading: statsLoading } = useUserStats()

  // Mock data for collections
  // const collections = [
  //   {
  //     id: 1,
  //     name: "Cosmic Explorers",
  //     description: "A collection of space explorers traversing the universe",
  //     items: 12,
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  //   {
  //     id: 2,
  //     name: "Digital Dreams",
  //     description: "Abstract digital art representing dreamscapes",
  //     items: 5,
  //     image: "/placeholder.svg?height=400&width=400",
  //   },
  // ]

  // Redirect to connect page if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/connect")
    }
  }, [isConnected, router])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/dashboard/create-collection">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="collections">
              <Grid3X3 className="mr-2 h-4 w-4" />
              My Collections
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="collections">
            {collectionsLoading ? (
              <div>Loading collections...</div>
            ) : collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <Link href={`/dashboard/collection/${collection.id}`} key={collection.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative">
                        <Image
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{collection.name}</CardTitle>
                        <CardDescription>{collection.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm text-muted-foreground">{collection.itemCount} items</div>
                        {/* <div className="text-xs text-muted-foreground">
                          {collection.status === "deployed" ? "✅ Deployed" : "🔄 Deploying"}
                        </div> */}
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}

                <Link href="/dashboard/create-collection">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center border-dashed">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                      <PlusCircle className="h-12 w-12 mb-4 text-muted-foreground" />
                      <CardTitle className="mb-2">Create New Collection</CardTitle>
                      <CardDescription>Start a new ERC-1155 collection to mint your NFTs</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Grid3X3 className="h-16 w-16 mb-6 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No Collections Yet</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Create your first ERC-1155 collection to start minting NFTs.
                </p>
                <Link href="/dashboard/create-collection">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Collection
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          <TabsContent value="activity">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Activity Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">Track your minting activity and collection performance.</p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Settings Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">Customize your profile and notification preferences.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
