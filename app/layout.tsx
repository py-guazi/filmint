import type { Metadata } from 'next'
import './globals.css'
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: 'Filmint - NFT Collection Creator',
  description: 'Create and mint your own NFT collections on Filecoin',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
