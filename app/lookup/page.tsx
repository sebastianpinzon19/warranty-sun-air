'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type LookupResult = {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    ownerName: string;
    installationDate: string;
    products: Array<{ serialNumber: string }>;
    status: string;
  };
};

export default function LookupPage() {
  const [lastName, setLastName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearching(true);
    setResult(null);

    try {
      const response = await fetch('/api/warranty/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastName, serialNumber }),
      });

      const payload = await response.json();

      if (response.ok && payload.found) {
        setResult({
          success: true,
          data: {
            id: payload.warranty.id,
            ownerName: payload.warranty.ownerName,
            installationDate: payload.warranty.installationDate,
            products: payload.warranty.products,
            status: payload.warranty.status,
          },
        });
      } else {
        setResult({ success: false, message: payload.message || 'Warranty not found' });
      }
    } catch (error) {
      console.error(error);
      setResult({ success: false, message: 'An error occurred while searching.' });
    } finally {
      setIsSearching(false);
    }
  };

  const downloadPdf = async (warrantyId: string) => {
    const response = await fetch(`/api/warranty/download/${warrantyId}`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `warranty-${warrantyId}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container-custom flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <svg className="h-6 w-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <div>
              <span className="block text-xl font-bold leading-none">WarrantyPro</span>
              <span className="text-xs text-muted-foreground">HVAC Protection</span>
            </div>
          </Link>
          <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
            Register Warranty
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b bg-primary py-12 text-primary-foreground">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src="/images/hero-hvac.jpg" alt="HVAC background" fill className="object-cover" />
        </div>
        <div className="relative z-10 container-custom text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /></svg>
            Warranty Lookup
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Find Your Warranty</h1>
          <p className="mx-auto max-w-2xl text-lg opacity-90">
            Search using your last name and product serial number to download your certificate.
          </p>
        </div>
      </section>

      <main className="container-custom py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSearch} className="rounded-2xl border bg-card p-6 shadow-lg lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">🔎</div>
              <div>
                <h2 className="text-xl font-bold">Search Your Warranty</h2>
                <p className="text-sm text-muted-foreground">Enter your details below</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="lastName" className="label">Last Name <span className="text-destructive">*</span></label>
                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" placeholder="Enter your last name" />
              </div>

              <div>
                <label htmlFor="serialNumber" className="label">Serial Number <span className="text-destructive">*</span></label>
                <input id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="input-field" placeholder="Enter equipment serial number" />
              </div>

              <button type="submit" disabled={isSearching} className="btn-primary w-full">
                {isSearching ? 'Searching...' : 'Search Warranty'}
              </button>
            </div>

            {result && !result.success && (
              <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                <p className="font-medium text-sm">No Results Found</p>
                <p className="text-sm opacity-90">{result.message}</p>
              </div>
            )}
          </form>

          <div className="min-h-[420px] rounded-2xl border bg-card shadow-lg">
            {!result && (
              <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center">
                <div>
                  <div className="relative mx-auto mb-6 h-48 w-48 opacity-80">
                    <Image src="/images/warranty-certificate.jpg" alt="Warranty Certificate" fill className="rounded-xl object-cover" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Ready to Search</h3>
                  <p className="mx-auto max-w-xs text-sm text-muted-foreground">Enter your last name and serial number to find and download your warranty certificate.</p>
                </div>
              </div>
            )}

            {result && result.success && result.data && (
              <div className="p-6 lg:p-8">
                <div className="rounded-t-xl bg-primary px-6 py-5 text-primary-foreground">
                  <p className="text-sm opacity-90">Warranty Found</p>
                  <p className="text-lg font-bold">{result.data.id}</p>
                </div>
                <div className="space-y-4 border-x border-b p-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p>
                    <p className="font-semibold">{result.data.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Installation Date</p>
                    <p className="font-medium">{new Date(result.data.installationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Products</p>
                    <p className="font-medium">{result.data.products.length} registered</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => downloadPdf(result.data!.id)} className="btn-secondary">Download Certificate</button>
                    <button onClick={() => setResult(null)} className="rounded-lg bg-muted px-6 py-3 font-semibold text-foreground transition hover:bg-muted/80">New Search</button>
                  </div>
                </div>
              </div>
            )}

            {result && !result.success && (
              <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Warranty Not Found</h3>
                  <p className="mx-auto mb-6 max-w-xs text-sm text-muted-foreground">Please check your information and try again, or contact support for assistance.</p>
                  <button onClick={() => setResult(null)} className="btn-secondary">Try Again</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-2 font-bold text-primary">Need Help?</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Your serial number can be found on the product label</li>
            <li>• Use the last name used during registration</li>
            <li>• Contact support if you need assistance with your warranty</li>
          </ul>
        </div>
      </main>
    </div>
  );
}