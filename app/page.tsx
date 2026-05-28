import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container-custom flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/sunair-wordmark.webp" alt="SunAir supply INC" width={180} height={56} priority className="h-12 w-auto object-contain" />
            <div>
              <span className="block text-xl font-bold leading-none">SunAir supply INC</span>
              <span className="text-xs text-muted-foreground">Heating &amp; A/C Supply</span>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
              Register Warranty
            </Link>
            <Link href="/lookup" className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium shadow-sm transition hover:bg-muted">
              Lookup
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/family-living-room.webp" alt="HVAC comfort in a modern home" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="relative z-10 container-custom py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /></svg>
              Official Warranty Registration Portal
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
              Protect Your HVAC Investment Today
            </h1>
            <p className="mb-8 text-xl text-muted-foreground text-pretty">
              Register your heating and cooling equipment online in minutes. Get instant access to your warranty certificate and enjoy peace of mind for years to come.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-lg font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
                Register Your Warranty
                <span className="ml-2">→</span>
              </Link>
              <Link href="/lookup" className="inline-flex h-14 items-center justify-center rounded-md border border-border bg-background px-8 text-lg font-medium shadow-sm transition hover:bg-muted">
                Find My Warranty
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-border/50 pt-10">
              <div className="flex items-center gap-2 text-muted-foreground"><span className="text-accent">✓</span><span className="text-sm">Instant Registration</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><span className="text-accent">✓</span><span className="text-sm">24/7 Online Access</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><span className="text-accent">✓</span><span className="text-sm">Extended Coverage</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container-custom grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          <div><p className="text-4xl font-bold">50K+</p><p className="mt-1 text-primary-foreground/80">Warranties Registered</p></div>
          <div><p className="text-4xl font-bold">10 Years</p><p className="mt-1 text-primary-foreground/80">Max Coverage</p></div>
          <div><p className="text-4xl font-bold">98%</p><p className="mt-1 text-primary-foreground/80">Customer Satisfaction</p></div>
          <div><p className="text-4xl font-bold">24/7</p><p className="mt-1 text-primary-foreground/80">Online Support</p></div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container-custom">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">Register your warranty in three simple steps</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-border" />

            {[
              { n: '1', title: 'Fill Out Form', body: 'Enter your information, dealer details, and equipment serial numbers in our easy-to-use form.' },
              { n: '2', title: 'Submit Registration', body: 'Review your details and submit. Your warranty is instantly activated in our system.' },
              { n: '3', title: 'Get Certificate', body: 'Download your warranty certificate immediately and access it anytime online.' },
            ].map((item, index) => (
              <div key={item.n} className="relative rounded-2xl border bg-card text-center shadow-sm transition hover:border-primary/50">
                <div className="px-6 pb-8 pt-10">
                  <div className="absolute left-1/2 top-[-20px] flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {item.n}
                  </div>
                  <div className={`mx-auto mb-5 inline-flex rounded-2xl p-4 ${index === 2 ? 'bg-accent/10' : 'bg-primary/10'}`}>
                    <svg className={`h-10 w-10 ${index === 2 ? 'text-accent' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />}
                      {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l9 7-9 13-9-13 9-7z" />}
                      {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3h14a2 2 0 012 2v14l-7-4-7 4V5a2 2 0 012-2z" />}
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Coverage for Every Need</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Whether you have a residential home or commercial property, our warranty registration system covers all types of HVAC installations.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 rounded-xl bg-muted/50 p-4">
                <div className="h-fit rounded-lg bg-primary/10 p-3">🏠</div>
                <div>
                  <h3 className="text-lg font-semibold">Residential</h3>
                  <p className="text-muted-foreground">Full coverage for home heating and cooling systems including split systems, heat pumps, and furnaces.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl bg-muted/50 p-4">
                <div className="h-fit rounded-lg bg-primary/10 p-3">🏢</div>
                <div>
                  <h3 className="text-lg font-semibold">Commercial</h3>
                  <p className="text-muted-foreground">Extended warranties for commercial HVAC units, rooftop systems, and industrial climate control equipment.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
            <Image src="/images/modern-home-comfort.webp" alt="Family enjoying comfortable home" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container-custom">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Why Register Your Warranty?</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">Protect your investment and enjoy peace of mind</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Extended Coverage', 'Up to 10 years of comprehensive parts and labor coverage.'],
              ['Priority Support', 'Registered customers get priority service and faster response times.'],
              ['Digital Records', 'Access your warranty certificate anytime from anywhere online.'],
              ['Full Protection', 'Coverage for compressors, coils, motors, and all major components.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border bg-card shadow-sm">
                <div className="p-6">
                  <div className="mb-4 text-3xl text-primary">★</div>
                  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl order-2 lg:order-1">
            <Image src="/images/hvac-technician-service.webp" alt="Professional HVAC technician" fill className="object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Trusted by Professionals</h2>
            <p className="mb-6 text-xl text-muted-foreground">
              Thousands of HVAC contractors and dealers trust our warranty registration system to protect their customers and streamline their business.
            </p>
            <blockquote className="border-l-4 border-primary py-2 pl-6">
              <p className="mb-4 text-lg italic text-foreground">
                &quot;The online registration process is incredibly simple. My customers appreciate the instant confirmation and easy access to their warranty certificates.&quot;
              </p>
              <footer className="text-muted-foreground">
                <strong className="text-foreground">Michael Rodriguez</strong><br />
                <span className="text-sm">HVAC Contractor, Climate Solutions Inc.</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <Image src="/images/sunair-wood-sign.webp" alt="SunAir brand display" fill className="object-cover" />
          <div className="absolute inset-0 bg-primary/95" />
        </div>
        <div className="relative z-10 container-custom text-center text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Register Your Warranty?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            It only takes a few minutes to register your equipment and secure your warranty coverage for years of peace of mind.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register" className="inline-flex h-14 items-center justify-center rounded-md bg-secondary px-8 text-lg font-medium text-secondary-foreground shadow-sm transition hover:opacity-90">
              Start Registration Now →
            </Link>
            <Link href="/lookup" className="inline-flex h-14 items-center justify-center rounded-md border border-primary-foreground/30 px-8 text-lg font-medium text-primary-foreground shadow-sm transition hover:bg-primary-foreground/10">
              Lookup Existing Warranty
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card py-12">
        <div className="container-custom grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3">
              <Image src="/images/sunair-wordmark.webp" alt="SunAir supply INC" width={150} height={48} className="h-10 w-auto object-contain" />
              <span className="text-lg font-bold">SunAir supply INC</span>
            </Link>
            <p className="text-sm text-muted-foreground">Professional HVAC warranty registration and management system.</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register" className="transition-colors hover:text-primary">Register Warranty</Link></li>
              <li><Link href="/lookup" className="transition-colors hover:text-primary">Lookup Warranty</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Customer Service</li>
              <li>Warranty Claims</li>
              <li>Product Registration Help</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>4244 Old Dixie Rd</li>
              <li>Atlanta, GA 30354</li>
              <li>info@sunairsupply.com</li>
              <li>(404) 363-1020</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
