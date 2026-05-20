'use client';

import { useFormContext } from 'react-hook-form';

export default function DealerInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-sun-blue">Step 2: Dealer/Contractor Information</h3>
        <p className="text-gray-600 text-sm mt-1">Enter the installing dealer's details</p>
      </div>

      {/* Dealer Name */}
      <div>
        <label className="label" htmlFor="dealerName">
          Dealer/Contractor Name *
        </label>
        <input
          id="dealerName"
          type="text"
          {...register('dealerName')}
          className={`input-field ${errors.dealerName ? 'border-sun-yellow ring-2 ring-sun-yellow/20' : ''}`}
          placeholder="ABC HVAC Solutions"
        />
        {errors.dealerName && (
          <p className="mt-1 text-sm text-sun-blue">{String(errors.dealerName?.message)}</p>
        )}
      </div>

      {/* Dealer Email */}
      <div>
        <label className="label" htmlFor="dealerEmail">
          Dealer Email Address *
        </label>
        <input
          id="dealerEmail"
          type="email"
          {...register('dealerEmail')}
          className={`input-field ${errors.dealerEmail ? 'border-sun-yellow ring-2 ring-sun-yellow/20' : ''}`}
          placeholder="contact@abchvac.com"
        />
        {errors.dealerEmail && (
          <p className="mt-1 text-sm text-sun-blue">{String(errors.dealerEmail?.message)}</p>
        )}
      </div>

      {/* Dealer Phone */}
      <div>
        <label className="label" htmlFor="dealerPhone">
          Dealer Phone Number *
        </label>
        <input
          id="dealerPhone"
          type="tel"
          {...register('dealerPhone')}
          className={`input-field ${errors.dealerPhone ? 'border-sun-yellow ring-2 ring-sun-yellow/20' : ''}`}
          placeholder="(555) 987-6543"
        />
        {errors.dealerPhone && (
          <p className="mt-1 text-sm text-sun-blue">{String(errors.dealerPhone?.message)}</p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex">
          <svg className="w-5 h-5 text-sun-blue mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Important Information</p>
            <p>The dealer information is required for warranty validation. Please ensure the dealer who installed your equipment is listed correctly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
