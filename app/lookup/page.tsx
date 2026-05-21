'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

type LookupResult = {
  found: boolean;
  message?: string;
  warranty?: {
    id: string;
    status: string;
  };
};

export default function LookupPage() {
  const [lastName, setLastName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/warranty/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastName, serialNumber }),
      });

      const data = (await response.json()) as LookupResult;
      setResult(data);
      if (!response.ok && !data.message) {
        setError('Unable to find a warranty with those details.');
      }
    } catch {
      setError('Something went wrong while searching for the warranty.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/95 backdrop-blur">
        <div className="container-custom flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold">Sun Air</Link>
          <Link href="/register" className="btn-secondary text-sm">Register Warranty</Link>
        </div>
      </header>

      <main className="container-custom py-12">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold">Lookup a warranty</h1>
            <p className="mt-3 text-muted-foreground">
              Enter the owner last name and one product serial number to find the warranty record.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="label" htmlFor="lastName">Last name</label>
                <input id="lastName" className="input-field" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div>
                <label className="label" htmlFor="serialNumber">Serial number</label>
                <input id="serialNumber" className="input-field" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Searching…' : 'Lookup Warranty'}
                </button>
                <Link href="/register" className="btn-secondary">
                  Register a new warranty
                </Link>
              </div>
            </form>

            {error && <p className="mt-5 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

            {result?.message && <p className="mt-5 rounded-lg border bg-muted p-4 text-sm">{result.message}</p>}

            {result?.found && result.warranty && (
              <div className="mt-6 rounded-2xl border bg-muted/30 p-5">
                <h2 className="text-lg font-semibold">Warranty found</h2>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <p><span className="font-semibold">ID:</span> {result.warranty.id}</p>
                  <p><span className="font-semibold">Status:</span> {result.warranty.status}</p>
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-2xl border bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold">Need to register first?</h2>
            <p className="mt-3 text-primary-foreground/80">
              If you do not have a warranty record yet, start a new registration in a few minutes.
            </p>
            <Link href="/register" className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-secondary px-5 font-semibold text-secondary-foreground">
              Start registration
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
