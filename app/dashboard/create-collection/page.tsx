"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/image-upload"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateCollectionPage() {
  const router = useRouter()
  const [collectionImage, setCollectionImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard/collection/3")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="flex items-center text-sm mb-8 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold mb-8">Create New Collection</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <h2 className="text-lg font-medium mb-2">Collection Image</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  This image will represent your collection on the marketplace.
                </p>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    {collectionImage ? (
                      <div className="relative aspect-square w-full max-w-[300px] mx-auto mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={collectionImage || "/placeholder.svg"}
                          alt="Collection preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => setCollectionImage(null)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <ImageUpload onImageSelected={(imageUrl) => setCollectionImage(imageUrl)} />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <h2 className="text-lg font-medium mb-2">Collection Details</h2>
                <p className="text-sm text-muted-foreground">Basic information about your collection.</p>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Collection Name</Label>
                      <Input id="name" placeholder="e.g. Cosmic Explorers" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symbol">Symbol</Label>
                      <Input id="symbol" placeholder="e.g. CSMC" required />
                      <p className="text-xs text-muted-foreground">
                        A short identifier for your collection (1-10 characters)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your collection..." className="min-h-[100px]" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <h2 className="text-lg font-medium mb-2">Collection Settings</h2>
                <p className="text-sm text-muted-foreground">Configure how your collection works.</p>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="royalties">Creator Royalties</Label>
                        <p className="text-sm text-muted-foreground">Earn a percentage of future sales</p>
                      </div>
                      <div className="flex items-center">
                        <Input id="royalties" type="number" className="w-20 mr-2" defaultValue="5" min="0" max="15" />
                        <span>%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="explicit-toggle">Explicit & Sensitive Content</Label>
                        <p className="text-sm text-muted-foreground">
                          Set this if your collection contains adult content
                        </p>
                      </div>
                      <Switch id="explicit-toggle" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="freeze-toggle">Freeze Metadata</Label>
                        <p className="text-sm text-muted-foreground">Lock metadata for all NFTs in this collection</p>
                      </div>
                      <Switch id="freeze-toggle" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting || !collectionImage}
              >
                {isSubmitting ? "Creating..." : "Create Collection"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
