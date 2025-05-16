import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-950/20" id="about">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800/30">About Us</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Empowering Creators in the Digital World
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Filmint was founded with a simple mission: to make NFT creation accessible to everyone. We believe in a
                future where digital ownership is seamless, transparent, and available to all creators.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-blue-500"
                  >
                    <path d="M12 22v-5" />
                    <path d="M9 8V2" />
                    <path d="M15 8V2" />
                    <path d="M18 8v4" />
                    <path d="M6 8v4" />
                    <path d="M12 8v8" />
                    <path d="M21 8H3" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To create a world where artists, creators, and collectors can seamlessly participate in the digital
                    economy without technical barriers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-blue-500"
                  >
                    <path d="M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.85 1 4.55" />
                    <path d="M19.8 17.8a7.5 7.5 0 0 0 .003-10.603" />
                    <path d="M17 15a3.5 3.5 0 0 0-.025-4.975" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium">Our Values</h3>
                  <p className="text-muted-foreground">
                    We're committed to accessibility, sustainability, and fair compensation for creators in the digital
                    art space.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-xl lg:mx-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10" />
            <div className="relative grid grid-cols-2 gap-2 p-4">
              <div className="grid gap-2">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Team"
                    alt="Team member"
                    width={200}
                    height={200}
                    className="aspect-square h-auto w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Office"
                    alt="Office space"
                    width={200}
                    height={200}
                    className="aspect-square h-auto w-full object-cover"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Work"
                    alt="Team working"
                    width={200}
                    height={200}
                    className="aspect-square h-auto w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Art"
                    alt="Digital art"
                    width={200}
                    height={200}
                    className="aspect-square h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card className="bg-white dark:bg-slate-950/50 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-blue-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Founded in 2023</h3>
              <p className="mt-2 text-muted-foreground">
                Started by a team of blockchain enthusiasts and digital artists who saw the need for a more accessible
                NFT creation platform.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-950/50 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-blue-500"
                >
                  <path d="M12 2v20" />
                  <path d="m17 5-5-3-5 3" />
                  <path d="m17 19-5 3-5-3" />
                  <path d="M12 11.15V13" />
                  <path d="m20 5-8 3-8-3" />
                  <path d="m20 19-8-3-8 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Global Community</h3>
              <p className="mt-2 text-muted-foreground">
                Supporting creators in over 50 countries with a platform that breaks down technical and geographical
                barriers.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-950/50 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-blue-500"
                >
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Sustainable Future</h3>
              <p className="mt-2 text-muted-foreground">
                Committed to environmentally responsible blockchain solutions and supporting the transition to more
                energy-efficient NFT technologies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
