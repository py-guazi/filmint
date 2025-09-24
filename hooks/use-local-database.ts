"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { localDB, type Collection, type Mint } from "@/lib/local-database"

export function useCollections() {
  const { address } = useAccount()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCollections = async () => {
    if (!address) {
      setCollections([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const userCollections = await localDB.getCollectionsByOwner(address)
      setCollections(userCollections.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load collections")
      setCollections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCollections()
  }, [address])

  const addCollection = async (collection: Collection) => {
    try {
      await localDB.saveCollection(collection)
      await loadCollections()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save collection")
      throw err
    }
  }

  const updateCollection = async (id: string, updates: Partial<Collection>) => {
    try {
      await localDB.updateCollection(id, updates)
      await loadCollections()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update collection")
      throw err
    }
  }

  const deleteCollection = async (id: string) => {
    try {
      await localDB.deleteCollection(id)
      await loadCollections()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete collection")
      throw err
    }
  }

  return {
    collections,
    loading,
    error,
    loadCollections,
    addCollection,
    updateCollection,
    deleteCollection,
  }
}

export function useMints(collectionId?: string) {
  const { address } = useAccount()
  const [mints, setMints] = useState<Mint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMints = async () => {
    if (!address) {
      setMints([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      let userMints: Mint[]

      if (collectionId) {
        userMints = await localDB.getMintsByCollection(collectionId)
      } else {
        userMints = await localDB.getMintsByOwner(address)
      }

      setMints(userMints.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mints")
      setMints([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMints()
  }, [address, collectionId])

  const addMint = async (mint: Mint) => {
    try {
      await localDB.saveMint(mint)
      await localDB.updateCollectionItemCount(mint.collectionId)
      await loadMints()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save mint")
      throw err
    }
  }

  const updateMint = async (id: string, updates: Partial<Mint>) => {
    try {
      await localDB.updateMint(id, updates)
      await loadMints()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update mint")
      throw err
    }
  }

  const deleteMint = async (id: string) => {
    try {
      const mint = await localDB.getMint(id)
      if (mint) {
        await localDB.deleteMint(id)
        await localDB.updateCollectionItemCount(mint.collectionId)
        await loadMints()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete mint")
      throw err
    }
  }

  return {
    mints,
    loading,
    error,
    loadMints,
    addMint,
    updateMint,
    deleteMint,
  }
}

export function useUserStats() {
  const { address } = useAccount()
  const [stats, setStats] = useState({
    totalCollections: 0,
    totalMints: 0,
    deployedCollections: 0,
    mintedItems: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!address) {
        setStats({ totalCollections: 0, totalMints: 0, deployedCollections: 0, mintedItems: 0 })
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userStats = await localDB.getUserStats(address)
        setStats(userStats)
      } catch (err) {
        console.error("Failed to load user stats:", err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [address])

  return { stats, loading }
}
