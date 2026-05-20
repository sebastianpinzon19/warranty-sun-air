'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';

export default function ProductInfo() {
  const { register, control, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const addProduct = () => {
    append({ serialNumber: '' });
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-sun-blue">Step 3: Product Information</h3>
        <p className="text-gray-600 text-sm mt-1">Enter the serial numbers for your SUN AIR equipment</p>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="label mb-0">
            Registered Products ({fields.length})
          </label>
          <button
            type="button"
            onClick={addProduct}
            className="text-sm text-sun-blue hover:text-sun-blue-dark font-semibold flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Product #{index + 1}</span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            <input
              type="text"
              {...register(`products.${index}.serialNumber`)}
              className={`input-field ${(errors.products as any)?.[index]?.serialNumber ? 'border-red-500' : ''}`}
              placeholder="Enter serial number (e.g., SUN-2024-001234)"
            />
            {(errors.products as any)?.[index]?.serialNumber && (
              <p className="mt-1 text-sm text-red-600">
                {String((errors.products as any)?.[index]?.serialNumber?.message)}
              </p>
            )}
          </div>
        ))}

        {errors.products && typeof errors.products.message === 'string' && (
          <p className="text-sm text-red-600">{errors.products.message}</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-yellow-50 border-2 border-sun-yellow rounded-lg p-6 mt-8">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className="w-5 h-5 mt-0.5 text-sun-yellow focus:ring-sun-yellow rounded"
          />
          <span className="ml-3 text-sm text-gray-800">
            <span className="font-semibold block mb-1">Terms and Conditions *</span>
            By checking this box, I confirm that:
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>All information provided is accurate and complete</li>
              <li>The equipment was installed by a licensed HVAC contractor</li>
              <li>I understand the warranty terms and conditions</li>
              <li>The installation date provided is correct</li>
              <li>I agree to receive warranty-related communications via email</li>
            </ul>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-2 text-sm text-red-600 font-semibold">{String(errors.acceptTerms?.message)}</p>
        )}
      </div>

      {/* Important Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-red-800">
            <p className="font-semibold mb-1">Important: Registration Deadline</p>
            <p>Warranty must be registered within 60 days of installation date to receive full coverage. Late registrations may result in reduced warranty benefits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
