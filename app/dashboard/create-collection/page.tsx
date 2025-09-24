"use client"

import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { DashboardHeader } from "@/components/dashboard-header"
import { ArrowLeft, Upload, Loader2, CheckCircle } from "lucide-react"
import { useAccount, useWalletClient, useWaitForTransactionReceipt, usePublicClient } from "wagmi"
// import { deployCollection } from "@/lib/contract-deployment"
import { useCollections } from "@/hooks/use-local-database"
import { createCollection } from "@/lib/local-database"
// import MyContract from './MyContract.json';
import {abi, bytecode} from '../../../lib/MyContract';

interface CollectionMetadata {
  name: string
  description: string
  image: string
}

interface DeploymentStep {
  id: string
  name: string
  status: "pending" | "loading" | "completed" | "error"
  error?: string
}

export default function CreateCollectionPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { addCollection } = useCollections()

  // wagmi related https://x.com/i/grok/share/RbI6Omfj8bh1m8TM6ApeIIw7f
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    symbol: "",
    image: "",
  })

  // Deployment state
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { id: "metadata", name: "Upload Collection Metadata", status: "pending" },
    { id: "contract", name: "Deploy Smart Contract", status: "pending" },
    { id: "verification", name: "Verify Contract", status: "pending" },
  ])
  const [deployedContractAddress, setDeployedContractAddress] = useState<string>("")

  const updateStepStatus = (stepId: string, status: DeploymentStep["status"], error?: string) => {
    setDeploymentSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, error } : step)))
  }

  const uploadMetadataToStorage = async (metadata: CollectionMetadata): Promise<string> => {
    // ******************************************
    // * ADD YOUR METADATA UPLOAD LOGIC HERE   *
    // ******************************************
    //
    // This function should:
    // 1. Take the metadata object and upload it to your storage service (IPFS, Arweave, etc.)
    // 2. Return the URI/URL where the metadata can be accessed
    // 3. Handle any upload errors appropriately
    //
    // Example implementation structure:
    // try {
    //   const response = await uploadToIPFS(metadata) // Your upload function
    //   return response.uri // Return the metadata URI
    // } catch (error) {
    //   throw new Error(`Failed to upload metadata: ${error.message}`)
    // }
    //
    const file = jsonToFile(metadata);
    console.log("+ Uploading metadata file:", metadata)
    // Replace with your actual upload logic
    const response = await uploadFileToIPFS(file)
    return response.url;

    // For now, we'll simulate the upload with a delay
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a mock URI - replace this with your actual upload logic
    // return `ipfs://QmYourMetadataHashHere/${Date.now()}`
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

  const jsonToFile = (metadata: CollectionMetadata) => {
    // Convert JSON to string
    const jsonString = JSON.stringify(metadata, null, 2);

    // Create a Blob with JSON content
    const blob = new Blob([jsonString], { type: 'application/json' });
    // Create a File object from the Blob
    const file = new File([blob], 'meta.json', { type: 'application/json' });

    return file;
  }

  const handleImageSelected = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    if (!formData.name || !formData.description || !formData.symbol || !formData.image) {
      alert("Please fill in all required fields")
      return
    }

    setIsDeploying(true)

    try {
      // Step 1: Upload metadata to storage
      updateStepStatus("metadata", "loading")

      const metadata: CollectionMetadata = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
      }

      let metadataUri: string
      try {
        metadataUri = await uploadMetadataToStorage(metadata)
        updateStepStatus("metadata", "completed")
      } catch (error) {
        updateStepStatus("metadata", "error", error instanceof Error ? error.message : "Failed to upload metadata")
        throw error
      }

      // Step 2: Deploy smart contract
      updateStepStatus("contract", "loading")

      let collectionId: string
      let contractAddress = ""
      try {
        console.log("+ About to deploy collection contract")
        // contractAddress = await deployCollection({
        //   name: formData.name,
        //   symbol: formData.symbol,
        //   metadataUri: metadataUri,
        //   owner: address,
        // })

        if (!walletClient) {
          updateStepStatus("contract", "error", "Wallet client not connected");
          return;
        }
        if (!publicClient) {
          updateStepStatus("contract", "error", "Public client not connected");
          return;
        }

        const constructorArgs = [
          formData.name,
          formData.symbol,
          metadataUri,
        ] as [string, string, string];

        try {
          // abi: MyContract.abi,
          // bytecode: MyContract.bytecode as `0x${string}`,
          const hash = await walletClient.deployContract({
            abi: abi,
            bytecode: bytecode as `0x${string}`,
            args: constructorArgs,
          });
          setTransactionHash(hash);
          console.log('+ Transaction submitted. Hash:', hash);

          const receipt = await publicClient.waitForTransactionReceipt({
            hash: hash,
            pollingInterval: 3000, // Poll every 3 seconds ?
          });

          const deployedAddress = receipt.contractAddress;
          if (!deployedAddress) {
            throw new Error('Contract address not found in receipt');
          }

          console.log('+ Transaction receipt:', {
            blockNumber: receipt.blockNumber.toString(),
            gasUsed: receipt.gasUsed.toString(),
            status: receipt.status,
          });

          contractAddress = deployedAddress; // This should be the deployed contract address
        } catch (error) {
          updateStepStatus("contract", "error", "wagmi contract deployment failed")
          throw error
        }

        console.log("+ Deployed contract address:", contractAddress)

        // optional for step 4

        setDeployedContractAddress(contractAddress)
        updateStepStatus("contract", "completed")

      } catch (error) {
        updateStepStatus("contract", "error", error instanceof Error ? error.message : "Failed to deploy contract")
        throw error
      }

      // Step 3: Contract verification (optional)
      updateStepStatus("verification", "loading")

      // Step 4: Save collection to local database
      try {
        const newCollection = createCollection({
          name: formData.name,
          description: formData.description,
          symbol: formData.symbol,
          image: formData.image,
          contractAddress: contractAddress,
          metadataUri: metadataUri,
          externalLink: "",
          royaltyPercentage: 0,
          ownerAddress: address,
          itemCount: 0,
          network: "filecoin", // or get from wagmi
          status: "deployed",
        })

        console.log("+ Saving collection contract address: ", contractAddress)
        // For redirecting to the collection page
        collectionId = newCollection.id
        await addCollection(newCollection)
      } catch (error) {
        console.error("Failed to save collection to local database:", error)
        // Don't throw here as the contract is already deployed
      }

      try {
        // ******************************************
        // * ADD CONTRACT VERIFICATION LOGIC HERE  *
        // ******************************************
        //
        // This is where you can add logic to verify your contract on Etherscan
        // or other block explorers. This step is optional but recommended.
        //
        // Example:
        // await verifyContract(deployedContractAddress, constructorArgs)

        // For now, we'll simulate verification
        await new Promise((resolve) => setTimeout(resolve, 1000))
        updateStepStatus("verification", "completed")
      } catch (error) {
        // Verification failure shouldn't stop the process
        updateStepStatus("verification", "error", "Contract verification failed (optional)")
        console.warn("Contract verification failed:", error)
      }

      // Success! Redirect to the collection page
      setTimeout(() => {
        router.push(`/dashboard/collection/${collectionId}`)
      }, 2000)
    } catch (error) {
      console.error("Collection creation failed:", error)
      setIsDeploying(false)
    }
  }

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
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="flex items-center text-sm mb-8 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold mb-8">Create New Collection</h1>

          {!isDeploying ? (
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
                      {formData.image ? (
                        <div className="relative aspect-square w-full max-w-[300px] mx-auto mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={formData.image || "/placeholder.svg"}
                            alt="Collection preview"
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-2 right-2"
                            onClick={() => setFormData({ ...formData, image: "" })}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <ImageUpload onImageSelected={(imageUrl) => setFormData({ ...formData, image: imageUrl })} />
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
                        <Input 
                          id="name" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Cosmic Explorers"
                          required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input 
                          id="symbol" 
                          name="symbol"
                          value={formData.symbol}
                          onChange={handleInputChange}
                          placeholder="e.g. CSMC" required />
                        <p className="text-xs text-muted-foreground">
                          A short identifier for your collection (1-10 characters)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your collection..." className="min-h-[100px]" />
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
                >
                  <Upload className="mr-2 h-4 w-4" />
                    Create Collection
                </Button>
              </div>
            </form> 
            ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Creating Your Collection</h3>
                <p className="text-muted-foreground">Please wait while we deploy your collection contract...</p>
              </div>

              <div className="space-y-4">
                {deploymentSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {step.status === "loading" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                      {step.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {step.status === "error" && (
                        <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                      )}
                      {step.status === "pending" && <div className="h-5 w-5 rounded-full bg-gray-300" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step.name}</p>
                        {step.error && <p className="text-sm text-red-500">{step.error}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {deployedContractAddress && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Collection Created Successfully!</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Contract Address: <code className="bg-green-100 px-1 rounded">{deployedContractAddress}</code>
                  </p>
                  <p className="text-sm text-green-700">Redirecting to your collection page...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
