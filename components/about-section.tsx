import Link from "next/link"

export function AboutSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-950/20" id="about">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800/30 mb-4">About Us</div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">A Project by Ancients Research</h2>
          <p className="text-muted-foreground md:text-xl/relaxed">
            We are a team of highly motivated individuals in Web3 industry with decades of combined experience in investing, mining and building businesses. Learn more about
            FIL Builder Next Step Grants{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              here
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
