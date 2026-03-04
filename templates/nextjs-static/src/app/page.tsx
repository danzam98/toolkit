import { siteConfig } from '@/lib/constants'

export default function HomePage() {
  return (
    <main id="main" className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to{' '}
          <span className="gradient-text">{siteConfig.name}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="/about"
            className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started
          </a>
          <a
            href="/contact"
            className="rounded-md border border-border px-6 py-3 font-semibold transition-colors hover:bg-muted/10"
          >
            Contact
          </a>
        </div>
      </section>
    </main>
  )
}
