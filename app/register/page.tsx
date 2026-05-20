'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomerInfo from '@/components/CustomerInfo';
import DealerInfo from '@/components/DealerInfo';
import ProductInfo from '@/components/ProductInfo';
import StepIndicator from '@/components/StepIndicator';

const schema = yup.object({
  // Step 1: Customer Info
  applicationType: yup.string().required('Application type is required'),
  ownerName: yup.string().required('Owner name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  installationDate: yup.date().required('Installation date is required'),
  addressLine1: yup.string().required('Address is required'),
  addressLine2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  
  // Step 2: Dealer Info
  dealerName: yup.string().required('Dealer name is required'),
  dealerEmail: yup.string().email('Invalid email').required('Dealer email is required'),
  dealerPhone: yup.string().required('Dealer phone is required'),
  
  // Step 3: Products
  products: yup.array().of(
    yup.object({
      serialNumber: yup.string().required('Serial number is required'),
    })
  ).min(1, 'At least one product is required').required(),
  
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
}).required();

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      applicationType: 'residential',
      ownerName: '',
      email: '',
      phone: '',
      installationDate: new Date(),
      
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
    mode: 'onChange',
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['applicationType', 'ownerName', 'email', 'phone', 'installationDate', 'addressLine1', 'city', 'state', 'zipCode'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['dealerName', 'dealerEmail', 'dealerPhone'];
    }

    const valid = await methods.trigger(fieldsToValidate as any);
    if (valid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/warranty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to success page with warranty ID
        window.location.href = `/success?id=${result.warrantyId}`;
      } else {
        alert('Failed to register warranty. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Left sidebar */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-2xl shadow p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold">Register in Minutes</h3>
                <p className="text-sm text-gray-600">Simple 3-step process</p>
              </div>

              <div className="space-y-4">
                <div className={`flex gap-4 ${currentStep === 1 ? 'text-primary' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">1</div>
                  <div>
                    <p className="font-medium">Customer Info</p>
                    <p className="text-sm text-muted-foreground">Owner details</p>
                  </div>
                </div>

                <div className={`flex gap-4 ${currentStep === 2 ? 'text-primary' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">2</div>
                  <div>
                    <p className="font-medium">Dealer Info</p>
                    <p className="text-sm text-muted-foreground">Contractor details</p>
                  </div>
                </div>

                <div className={`flex gap-4 ${currentStep === 3 ? 'text-primary' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">3</div>
                  <div>
                    <p className="font-medium">Products</p>
                    <p className="text-sm text-muted-foreground">Equipment registration</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t space-y-3">
                <h4 className="font-semibold text-sm">Registration Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Up to 10 years extended coverage</li>
                  <li>• Priority customer support</li>
                  <li>• Instant digital certificate</li>
                  <li>• Easy online access 24/7</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main form area */}
          <section className="lg:col-span-3">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-3xl font-bold text-sun-blue mb-2">Register Your Warranty</h2>
              <p className="text-gray-600">Complete all steps to register your SUN AIR equipment warranty</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                {currentStep === 1 && <CustomerInfo />}
                {currentStep === 2 && <DealerInfo />}
                {currentStep === 3 && <ProductInfo />}

                <div className="flex justify-between mt-6 pt-6 border-t">
                  {currentStep > 1 ? (
                    <button type="button" onClick={prevStep} className="btn-secondary">← Previous</button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button type="button" onClick={nextStep} className="btn-primary">Next →</button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Submitting...' : 'Submit Registration'}
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
