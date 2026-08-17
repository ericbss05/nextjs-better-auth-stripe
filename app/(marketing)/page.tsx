import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            YourApp
          </Link>

          <nav className="flex items-center gap-3">
            <Button variant="ghost" >
              <Link href="/login">Log in</Link>
            </Button>

            <Button >
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-sm font-medium text-muted-foreground">
            Built for modern teams
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Grow your business.
            <br />
            <span className="text-muted-foreground">
              Without the busywork.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            A simple platform to help you find opportunities, manage your
            workflow, and turn prospects into customers.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" >
              <Link href="/signup">Get started</Link>
            </Button>

            <Button size="lg" variant="outline" >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            No credit card required.
          </p>
        </div>
      </section>

      {/* Minimal feature section */}
      <section
        id="how-it-works"
        className="border-t bg-muted/30 px-6 py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              01
            </span>
            <h2 className="mt-3 text-lg font-semibold">
              Find opportunities
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Discover the people and companies that matter to your business.
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-muted-foreground">
              02
            </span>
            <h2 className="mt-3 text-lg font-semibold">
              Focus on the right ones
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Prioritize the opportunities with the strongest potential.
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-muted-foreground">
              03
            </span>
            <h2 className="mt-3 text-lg font-semibold">
              Turn them into customers
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Spend less time searching and more time having meaningful
              conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 YourApp</span>

          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}