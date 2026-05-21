import Link from 'next/link';

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const warrantyId = typeof params.id === 'string' ? params.id : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container-custom flex min-h-screen items-center justify-center py-16">
        <div className="max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold">Warranty registered</h1>
          <p className="mt-3 text-muted-foreground">
            Your warranty was submitted successfully.
          </p>
          {warrantyId && (
            <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm">
              Warranty ID: <span className="font-semibold">{warrantyId}</span>
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/register" className="btn-primary">
              Register another warranty
            </Link>
            <Link href="/lookup" className="btn-secondary">
              Lookup warranty
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
