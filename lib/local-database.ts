"use client"

// Database schema interfaces
export interface Collection {
  id: string
  name: string
  description: string
  symbol: string
  image: string
  contractAddress: string
  metadataUri: string
  externalLink?: string
  royaltyPercentage: number
  ownerAddress: string
  itemCount: number
  createdAt: Date
  updatedAt: Date
  network: string
  status: "deploying" | "deployed" | "failed"
}

export interface Mint {
  id: string
  collectionId: string
  tokenId: string
  name: string
  description: string
  image: string
  metadataUri: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  ownerAddress: string
  recipientAddress?: string
  transactionHash?: string
  createdAt: Date
  updatedAt: Date
  status: "minting" | "minted" | "failed"
}

export interface UserData {
  address: string
  collections: Collection[]
  mints: Mint[]
  lastUpdated: Date
}

class LocalDatabase {
  private dbName = "filmint-nft-db"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create collections store
        if (!db.objectStoreNames.contains("collections")) {
          const collectionsStore = db.createObjectStore("collections", { keyPath: "id" })
          collectionsStore.createIndex("ownerAddress", "ownerAddress", { unique: false })
          collectionsStore.createIndex("contractAddress", "contractAddress", { unique: false })
          collectionsStore.createIndex("createdAt", "createdAt", { unique: false })
        }

        // Create mints store
        if (!db.objectStoreNames.contains("mints")) {
          const mintsStore = db.createObjectStore("mints", { keyPath: "id" })
          mintsStore.createIndex("collectionId", "collectionId", { unique: false })
          mintsStore.createIndex("ownerAddress", "ownerAddress", { unique: false })
          mintsStore.createIndex("tokenId", "tokenId", { unique: false })
          mintsStore.createIndex("createdAt", "createdAt", { unique: false })
        }

        // Create user data store
        if (!db.objectStoreNames.contains("userData")) {
          db.createObjectStore("userData", { keyPath: "address" })
        }
      }
    })
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init()
    }
    return this.db!
  }

  // Collection CRUD operations
  async saveCollection(collection: Collection): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["collections"], "readwrite")
    const store = transaction.objectStore("collections")

    return new Promise((resolve, reject) => {
      const request = store.put(collection)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCollection(id: string): Promise<Collection | null> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["collections"], "readonly")
    const store = transaction.objectStore("collections")

    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getCollectionsByOwner(ownerAddress: string): Promise<Collection[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["collections"], "readonly")
    const store = transaction.objectStore("collections")
    const index = store.index("ownerAddress")

    return new Promise((resolve, reject) => {
      const request = index.getAll(ownerAddress)
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async updateCollection(id: string, updates: Partial<Collection>): Promise<void> {
    const collection = await this.getCollection(id)
    if (!collection) throw new Error("Collection not found")

    const updatedCollection = {
      ...collection,
      ...updates,
      updatedAt: new Date(),
    }

    await this.saveCollection(updatedCollection)
  }

  async deleteCollection(id: string): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["collections", "mints"], "readwrite")
    const collectionsStore = transaction.objectStore("collections")
    const mintsStore = transaction.objectStore("mints")

    // Delete collection
    collectionsStore.delete(id)

    // Delete all mints for this collection
    const mintsIndex = mintsStore.index("collectionId")
    const mintsRequest = mintsIndex.getAll(id)

    mintsRequest.onsuccess = () => {
      const mints = mintsRequest.result
      mints.forEach((mint) => {
        mintsStore.delete(mint.id)
      })
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  // Mint CRUD operations
  async saveMint(mint: Mint): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["mints"], "readwrite")
    const store = transaction.objectStore("mints")

    return new Promise((resolve, reject) => {
      const request = store.put(mint)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getMint(id: string): Promise<Mint | null> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["mints"], "readonly")
    const store = transaction.objectStore("mints")

    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getMintsByCollection(collectionId: string): Promise<Mint[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["mints"], "readonly")
    const store = transaction.objectStore("mints")
    const index = store.index("collectionId")

    return new Promise((resolve, reject) => {
      const request = index.getAll(collectionId)
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getMintsByOwner(ownerAddress: string): Promise<Mint[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["mints"], "readonly")
    const store = transaction.objectStore("mints")
    const index = store.index("ownerAddress")

    return new Promise((resolve, reject) => {
      const request = index.getAll(ownerAddress)
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async updateMint(id: string, updates: Partial<Mint>): Promise<void> {
    const mint = await this.getMint(id)
    if (!mint) throw new Error("Mint not found")

    const updatedMint = {
      ...mint,
      ...updates,
      updatedAt: new Date(),
    }

    await this.saveMint(updatedMint)
  }

  async deleteMint(id: string): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["mints"], "readwrite")
    const store = transaction.objectStore("mints")

    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Utility methods
  async updateCollectionItemCount(collectionId: string): Promise<void> {
    const mints = await this.getMintsByCollection(collectionId)
    // const itemCount = mints.filter((mint) => mint.status === "minted").length
    // For simplicity, we count all mints regardless of status
    const itemCount = mints.length

    await this.updateCollection(collectionId, { itemCount })
  }

  async getUserStats(ownerAddress: string): Promise<{
    totalCollections: number
    totalMints: number
    deployedCollections: number
    mintedItems: number
  }> {
    const collections = await this.getCollectionsByOwner(ownerAddress)
    const mints = await this.getMintsByOwner(ownerAddress)

    return {
      totalCollections: collections.length,
      totalMints: mints.length,
      deployedCollections: collections.filter((c) => c.status === "deployed").length,
      mintedItems: mints.filter((m) => m.status === "minted").length,
    }
  }

  // Export/Import functionality for backup
  async exportUserData(ownerAddress: string): Promise<UserData> {
    const collections = await this.getCollectionsByOwner(ownerAddress)
    const mints = await this.getMintsByOwner(ownerAddress)

    return {
      address: ownerAddress,
      collections,
      mints,
      lastUpdated: new Date(),
    }
  }

  async importUserData(userData: UserData): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(["collections", "mints"], "readwrite")

    // Save collections
    const collectionsStore = transaction.objectStore("collections")
    userData.collections.forEach((collection) => {
      collectionsStore.put(collection)
    })

    // Save mints
    const mintsStore = transaction.objectStore("mints")
    userData.mints.forEach((mint) => {
      mintsStore.put(mint)
    })

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  // Clear all data for a user
  async clearUserData(ownerAddress: string): Promise<void> {
    const collections = await this.getCollectionsByOwner(ownerAddress)
    const mints = await this.getMintsByOwner(ownerAddress)

    const db = await this.ensureDB()
    const transaction = db.transaction(["collections", "mints"], "readwrite")
    const collectionsStore = transaction.objectStore("collections")
    const mintsStore = transaction.objectStore("mints")

    collections.forEach((collection) => {
      collectionsStore.delete(collection.id)
    })

    mints.forEach((mint) => {
      mintsStore.delete(mint.id)
    })

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

// Create singleton instance
export const localDB = new LocalDatabase()

// Utility functions for easier usage
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const createCollection = (data: Omit<Collection, "id" | "createdAt" | "updatedAt">): Collection => {
  const now = new Date()
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    ...data,
  }
}

export const createMint = (data: Omit<Mint, "id" | "createdAt" | "updatedAt">): Mint => {
  const now = new Date()
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    ...data,
  }
}
