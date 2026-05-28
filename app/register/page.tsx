'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import StepIndicator from '@/components/StepIndicator';
import CustomerInfo from '@/components/CustomerInfo';
import DealerInfo from '@/components/DealerInfo';
import ProductInfo from '@/components/ProductInfo';

type WarrantyFormValues = {
  applicationType: string;
  ownerName: string;
  email: string;
  phone: string;
  installationDate: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: string;
  products: Array<{ serialNumber: string }>;
  acceptTerms: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  const methods = useForm<WarrantyFormValues>({
    defaultValues: {
      applicationType: 'residential',
      ownerName: '',
      email: '',
      phone: '',
      installationDate: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      dealerName: '',
      dealerEmail: '',
      dealerPhone: '',
      products: [{ serialNumber: '' }],
      acceptTerms: false,
    },
  });
  const { handleSubmit, trigger, formState: { isSubmitting } } = methods;
  const [currentStep, setCurrentStep] = useState(1);

  const stepFields: Record<number, (keyof WarrantyFormValues)[]> = {
    1: ['applicationType', 'ownerName', 'email', 'phone', 'installationDate', 'addressLine1', 'city', 'state', 'zipCode'],
    2: ['dealerName', 'dealerEmail', 'dealerPhone'],
    3: ['products', 'acceptTerms'],
  };

  const goNext = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid) {
      setCurrentStep((step) => Math.min(step + 1, 3));
    }
  };

  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 1));

  const onSubmit = async (values: WarrantyFormValues) => {
    const response = await fetch('/api/warranty/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || 'Failed to register warranty');
    }

    const data = await response.json();
    router.push(`/success?id=${encodeURIComponent(data.warrantyId)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/95 backdrop-blur">
        <div className="container-custom flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/sunair-wordmark.webp" alt="SunAir supply INC" width={180} height={56} className="h-12 w-auto object-contain" />
            <div>
              <span className="block text-xl font-bold leading-none">SunAir supply INC</span>
              <span className="text-xs text-muted-foreground">Warranty Registration</span>
            </div>
          </Link>
          <Link href="/" className="btn-secondary text-sm">
            Back Home
          </Link>
        </div>
      </header>

      <main className="container-custom py-10 lg:py-12">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_2fr] lg:items-start">
          <aside className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Register Warranty
            </p>
            <h1 className="text-3xl font-bold">Complete your registration</h1>
            <p className="mt-3 text-muted-foreground">
              Fill out the customer, dealer, and product details to create your warranty record.
            </p>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>• Instant confirmation</p>
              <p>• Digital warranty record</p>
              <p>• Easy warranty lookup later</p>
            </div>
          </aside>

          <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
            <FormProvider {...methods}>
              <StepIndicator currentStep={currentStep} />
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <div className="rounded-2xl border bg-background p-5 sm:p-6">
                  {currentStep === 1 && <CustomerInfo />}
                  {currentStep === 2 && <DealerInfo />}
                  {currentStep === 3 && <ProductInfo />}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <button type="button" onClick={goBack} className="btn-secondary">
                        Back
                      </button>
                    )}
                    <Link href="/lookup" className="btn-secondary">
                      Lookup Warranty
                    </Link>
                  </div>

                  {currentStep < 3 ? (
                    <button type="button" onClick={goNext} className="btn-primary">
                      Continue
                    </button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
                      {isSubmitting ? 'Submitting…' : 'Submit Registration'}
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
          </section>
        </div>
      </main>
    </div>
  );
}
