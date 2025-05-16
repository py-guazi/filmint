"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, Info } from "lucide-react"

export default function MintNFTPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const collectionId = params.id
  const [nftImage, setNftImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/dashboard/collection/${collectionId}`)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/dashboard/collection/${collectionId}`}
            className="flex items-center text-sm mb-8 hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Link>

          <h1 className="text-3xl font-bold mb-8">Mint New NFT</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <h2 className="text-lg font-medium mb-2">NFT Image</h2>
                <p className="text-sm text-muted-foreground mb-4">Upload the artwork for your NFT.</p>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    {nftImage ? (
                      <div className="relative aspect-square w-full max-w-[300px] mx-auto mb-4 rounded-lg overflow-hidden">
                        <Image src={nftImage || "/placeholder.svg"} alt="NFT preview" fill className="object-cover" />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => setNftImage(null)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <ImageUpload onImageSelected={(imageUrl) => setNftImage(imageUrl)} />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <h2 className="text-lg font-medium mb-2">NFT Details</h2>
                <p className="text-sm text-muted-foreground">Information about your NFT.</p>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="e.g. Cosmic Explorer #7" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your NFT..." className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (ERC-1155)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10000"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                        required
                      />
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        ERC-1155 allows multiple copies of the same NFT
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <h2 className="text-lg font-medium mb-2">Properties</h2>
                <p className="text-sm text-muted-foreground">Add traits and attributes to your NFT.</p>
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trait-type-1">Trait Type</Label>
                        <Input id="trait-type-1" placeholder="e.g. Background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trait-value-1">Value</Label>
                        <Input id="trait-value-1" placeholder="e.g. Blue" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trait-type-2">Trait Type</Label>
                        <Input id="trait-type-2" placeholder="e.g. Eyes" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trait-value-2">Value</Label>
                        <Input id="trait-value-2" placeholder="e.g. Green" />
                      </div>
                    </div>

                    <Button variant="outline" type="button" className="w-full">
                      + Add Property
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.push(`/dashboard/collection/${collectionId}`)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting || !nftImage}>
                {isSubmitting ? "Minting..." : "Mint NFT"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
