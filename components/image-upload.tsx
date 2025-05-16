"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"

import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import * as Proof from '@web3-storage/w3up-client/proof'
import { Signer } from '@web3-storage/w3up-client/principal/ed25519'

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void
}

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // In a real app, you would upload the file to a server or IPFS
    // For this demo, we'll just create a local URL
    // const imageUrl = URL.createObjectURL(file)
    // onImageSelected(imageUrl)
    // Load client with specific private key
    const principal = Signer.parse(process.env.KEY)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })
    // Add proof that this agent has been delegated capabilities on the space
    const proof = await Proof.parse(process.env.PROOF)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())

    // console.info('client:', client)
    console.info('Uploading to space:', space.did())

    // READY to go!
    const fileCid = await client.uploadFile(file)
    const ipfsPath = 'ipfs://' + fileCid.toString() + '/'
    console.info('IPFS path:', ipfsPath)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-background p-3 border">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Upload your image</h3>
          <p className="text-sm text-muted-foreground">Drag and drop your image here or click to browse</p>
          <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max. 10MB)</p>
        </div>
        <Button type="button" variant="outline" onClick={handleButtonClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    </div>
  )
}
