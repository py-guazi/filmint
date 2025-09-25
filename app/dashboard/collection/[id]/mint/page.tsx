"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, Plus, Info, Loader2 } from "lucide-react"
import { useAccount, useWalletClient, usePublicClient } from "wagmi"
import { useCollections, useMints } from "@/hooks/use-local-database"
import { createMint } from "@/lib/local-database"
import { abi } from '../../../../../lib/MyContract'; // Adjust path
import { parseEventLogs, parseEther } from 'viem';

interface MintAttribute {
  trait_type: string
  value: string
}

export const runtime = "edge";

export default function MintNFTPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params.id as string
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { collections } = useCollections()
  const { addMint, updateMint } = useMints(collectionId)

  const collection = collections.find((c) => c.id === collectionId)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    recipientAddress: address || "",
    supply: "1",
  })

  const [attributes, setAttributes] = useState<MintAttribute[]>([{ trait_type: "", value: "" }])

  const [isMinting, setIsMinting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelected = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleAttributeChange = (index: number, field: "trait_type" | "value", value: string) => {
    setAttributes((prev) => prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)))
  }

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { trait_type: "", value: "" }])
  }

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadNFTMetadata = async (metadata: any): Promise<string> => {
    // ******************************************
    // * ADD YOUR NFT METADATA UPLOAD LOGIC HERE *
    // ******************************************
    //
    // This function should:
    // 1. Upload the NFT metadata to your storage service
    // 2. Return the metadata URI
    //
    // Example metadata structure:
    // {
    //   "name": "NFT Name",
    //   "description": "NFT Description",
    //   "image": "ipfs://...",
    //   "attributes": [
    //     {"trait_type": "Color", "value": "Blue"},
    //     {"trait_type": "Rarity", "value": "Common"}
    //   ]
    // }

    const file = jsonToFile(metadata);
    console.log("+ Uploading metadata file:", metadata)
    // Replace with your actual upload logic
    const response = await uploadFileToIPFS(file)
    return response.url;

    // console.log("Uploading NFT metadata:", metadata)
    // await new Promise((resolve) => setTimeout(resolve, 1500))
    // return `ipfs://QmNFTMetadataHash${Date.now()}`
  }

  // Send file to API route
  const uploadFileToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data; // { success: true, url: '...' }
  };

  const jsonToFile = (metadata: any) => {
    // Convert JSON to string
    const jsonString = JSON.stringify(metadata, null, 2);

    // Create a Blob with JSON content
    const blob = new Blob([jsonString], { type: 'application/json' });
    // Create a File object from the Blob
    const file = new File([blob], 'meta.json', { type: 'application/json' });

    return file;
  }

  const mintNFT = async (metadataUri: string, supply: string): Promise<{ transactionHash: `0x${string}`; tokenId: string }> => {
    // ******************************************
    // * ADD YOUR NFT MINTING LOGIC HERE       *
    // ******************************************
    //
    // This function should:
    // 1. Call your smart contract's mint function
    // 2. Pass the metadata URI and other parameters
    // 3. Return the transaction hash
    //
    // Example using wagmi:
    // const hash = await writeContract(config, {
    //   address: collection.contractAddress,
    //   abi: ERC1155_ABI,
    //   functionName: 'mint',
    //   args: [formData.recipientAddress, tokenId, formData.supply, metadataUri],
    // })
    if (!walletClient) {
      throw new Error("Wallet client not connected");
    }

    if (!publicClient) {
      throw new Error("Public client not connected");
    }

    let contract_address = collection?.contractAddress;
    let tokenId = "0"; // Default token ID for ERC-1155
    try {
      // Call the mint function
      const hash = await walletClient.writeContract({
        address: contract_address as `0x${string}`, // Contract address
        abi,
        functionName: 'mint',
        args: [address as `0x${string}`, BigInt(supply), metadataUri ], // Convert tokenId to BigInt for uint256
        account: address, // Wallet address
        // value: parseEther('0.01'), // Uncomment if mint is payable (e.g., 0.01 ETH)
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        pollingInterval: 3000, // Optional: adjust polling interval
      });

      if (receipt.status === 'success') {
        // Parse Transfer event logs
        const logs = parseEventLogs({
          abi,
          eventName: 'TransferSingle', // Use the correct event name from your ABI
          logs: receipt.logs,
        });

        // Find the Transfer event (should be emitted on mint)
        const transferLog = logs.find(
          (log) => log.eventName === 'TransferSingle' && log.args.from === '0x0000000000000000000000000000000000000000'
        );

        if (transferLog && 'tokenId' in transferLog.args) {
          tokenId = (transferLog.args.tokenId as bigint).toString(); // Convert BigInt to string
        } else {
          console.error('No TransferSingle event found in receipt...');
        }
      } else {
        console.error('Transaction failed...');
      }

      console.log('Minted NFT with tokenId:', tokenId);
      return { transactionHash: receipt.transactionHash, tokenId: tokenId };
    } catch (err: any) {
      console.error("Minting failed:", err.message);
      throw new Error(err.message || "Minting failed...");
    }

    // console.log("Minting NFT:", { metadataUri, tokenId, collection: collection?.contractAddress })
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    // return `0x${Math.random().toString(16).substr(2, 64)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address || !collection) {
      alert("Please connect your wallet and ensure collection exists")
      return
    }

    if (!formData.name || !formData.description || !formData.image) {
      alert("Please fill in all required fields")
      return
    }

    setIsMinting(true)

    try {
      // Generate token ID (you might want to get this from your contract)
      const tokenId = `${Date.now()}`

      // Prepare metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        attributes: attributes.filter((attr) => attr.trait_type && attr.value),
      }

      // Upload metadata
      const metadataUri = await uploadNFTMetadata(metadata)

      // Create mint record in local database (before actual minting)
      const newMint = createMint({
        collectionId: collection.id,
        tokenId,
        name: formData.name,
        description: formData.description,
        image: formData.image,
        metadataUri,
        attributes: metadata.attributes,
        ownerAddress: address,
        recipientAddress: "",
        status: "minting",
      })

      await addMint(newMint)

      // Mint NFT on blockchain
      const receipt = await mintNFT(metadataUri, formData.supply)

      // Update mint record with transaction hash and success status
      await updateMint(newMint.id, {
        tokenId: receipt.tokenId,
        transactionHash: receipt.transactionHash,
        status: "minted",
      })

      // Redirect to collection page
      router.push(`/dashboard/collection/${collectionId}`)
    } catch (error) {
      console.error("Minting failed:", error)
      alert(`Minting failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsMinting(false)
    }
  }

  if (!collection) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container py-12">
          <div className="flex flex-col items-center justify-center h-[70vh] max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">Collection Not Found</h1>
            <p className="text-muted-foreground mb-8">The collection you're looking for doesn't exist.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Redirect to connect page if not connected
  // useEffect(() => {
  //   if (!isConnected) {
  //     router.push("/connect")
  //   }
  // }, [isConnected, router]) 

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

          {!isMinting ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-1">
                  <h2 className="text-lg font-medium mb-2">NFT Image</h2>
                  <p className="text-sm text-muted-foreground mb-4">Upload the artwork for your NFT.</p>
                </div>
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="pt-6">
                      {formData.image ? (
                        <div className="relative aspect-square w-full max-w-[300px] mx-auto mb-4 rounded-lg overflow-hidden">
                          <Image src={formData.image || "/placeholder.svg"} alt="NFT preview" fill className="object-cover" />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-2 right-2"
                            onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <ImageUpload onImageSelected={(imageUrl) => setFormData((prev) => ({ ...prev, image: imageUrl }))} />
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
                        <Input 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange} 
                          placeholder="e.g. Cosmic Explorer #7" 
                          required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your NFT..." 
                          rows={3}
                          className="min-h-[100px]" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity (ERC-1155)</Label>
                        <Input
                          id="supply"
                          name="supply"
                          type="number"
                          min="1"
                          max="10000"
                          value={formData.supply}
                          onChange={handleInputChange}
                          placeholder="1"
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
                      <div className="flex items-center justify-between">
                        <Label>Attributes</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Attribute
                        </Button>
                      </div>
                      {attributes.map((attribute, index) => (
                        <div key={index} className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Trait type (e.g., Color)"
                            value={attribute.trait_type}
                            onChange={(e) => handleAttributeChange(index, "trait_type", e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Value (e.g., Blue)"
                              value={attribute.value}
                              onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                            />
                            {attributes.length > 1 && (
                              <Button type="button" variant="outline" size="sm" onClick={() => removeAttribute(index)}>
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => router.push(`/dashboard/collection/${collectionId}`)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Mint NFT
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Minting Your NFT</h3>
                <p className="text-muted-foreground">Please wait while we upload metadata and mint your NFT... You may get prompted to sign the mint transaction with your wallet during the process...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
