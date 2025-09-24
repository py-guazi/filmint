import { NextRequest, NextResponse } from 'next/server';

import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import * as Proof from '@web3-storage/w3up-client/proof'
import { Signer } from '@web3-storage/w3up-client/principal/ed25519'

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Access the environment variable securely on the server
    const key = process.env.KEY;
    if (!key) {
      return NextResponse.json({ error: 'Missing KEY environment variable' }, { status: 500 });
    }
    // Access the environment variable securely on the server
    const proof = process.env.PROOF;
    if (!proof) {
      return NextResponse.json({ error: 'Missing PROOF environment variable' }, { status: 500 });
    }

    // Example: Perform the upload to a third-party service (e.g., Cloudinary, S3)
    // Replace this with your actual upload logic from performUpload
    const uploadResult = await uploadToService(file, key, proof);

    // Return the result to the client
    return NextResponse.json({ success: true, url: uploadResult.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// Placeholder for your upload logic (adapt based on your service)
async function uploadToService(file: File, keyEnv: string, proofEnv: string) {
  // Load client with specific private key

  const principal = Signer.parse(keyEnv)
  const store = new StoreMemory()
  const client = await Client.create({ principal, store })
  // Add proof that this agent has been delegated capabilities on the space
  const proof = await Proof.parse(proofEnv)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())
  // READY to go!
  const fileCid = await client.uploadFile(file)
  // ex: https://bafkreic6p45trf5qbvftzfw3hazq32m336sehlqhsibt6pafxg5yv7z64e.ipfs.w3s.link/
  const ipfsPath = 'https://' + fileCid.toString() + '.ipfs.w3s.link/'
  return { url: ipfsPath };
}