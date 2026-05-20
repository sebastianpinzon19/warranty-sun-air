'use client';

import { useFormContext } from 'react-hook-form';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

export default function CustomerInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-sun-blue">Step 1: Customer Information</h3>
        <p className="text-gray-600 text-sm mt-1">Enter the property owner's details</p>
      </div>

      {/* Application Type */}
      <div>
        <label className="label">Application Type *</label>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="residential"
              {...register('applicationType')}
              className="w-4 h-4 text-sun-blue focus:ring-sun-blue"
            />
            <span className="ml-2 font-medium">Residential</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="commercial"
              {...register('applicationType')}
              className="w-4 h-4 text-sun-blue focus:ring-sun-blue"
            />
            <span className="ml-2 font-medium">Commercial</span>
          </label>
        </div>
      </div>

      {/* Owner Name */}
      <div>
        <label className="label" htmlFor="ownerName">
          Property Owner Name *
        </label>
        <input
          id="ownerName"
          type="text"
          {...register('ownerName')}
          className={`input-field ${errors.ownerName ? 'border-red-500' : ''}`}
          placeholder="John Doe"
        />
        {errors.ownerName && (
          <p className="mt-1 text-sm text-red-600">{String(errors.ownerName?.message)}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="label" htmlFor="email">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{String(errors.email?.message)}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="label" htmlFor="phone">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="(555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{String(errors.phone?.message)}</p>
        )}
      </div>

      {/* Installation Date */}
      <div>
        <label className="label" htmlFor="installationDate">
          Installation Date *
        </label>
        <input
          id="installationDate"
          type="date"
          {...register('installationDate')}
          className={`input-field ${errors.installationDate ? 'border-red-500' : ''}`}
        />
        {errors.installationDate && (
          <p className="mt-1 text-sm text-red-600">{String(errors.installationDate?.message)}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="label" htmlFor="addressLine1">
          Street Address *
        </label>
        <input
          id="addressLine1"
          type="text"
          {...register('addressLine1')}
          className={`input-field ${errors.addressLine1 ? 'border-red-500' : ''}`}
          placeholder="123 Main Street"
        />
        {errors.addressLine1 && (
          <p className="mt-1 text-sm text-red-600">{String(errors.addressLine1?.message)}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="label" htmlFor="addressLine2">
          Address Line 2 (Optional)
        </label>
        <input
          id="addressLine2"
          type="text"
          {...register('addressLine2')}
          className="input-field"
          placeholder="Apt 4B, Suite 100, etc."
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label" htmlFor="city">
            City *
          </label>
          <input
            id="city"
            type="text"
            {...register('city')}
            className={`input-field ${errors.city ? 'border-red-500' : ''}`}
            placeholder="Miami"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{String(errors.city?.message)}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="state">
            State *
          </label>
          <select
            id="state"
            {...register('state')}
            className={`input-field ${errors.state ? 'border-red-500' : ''}`}
          >
            <option value="">Select state</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{String(errors.state?.message)}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="zipCode">
            ZIP Code *
          </label>
          <input
            id="zipCode"
            type="text"
            {...register('zipCode')}
            className={`input-field ${errors.zipCode ? 'border-red-500' : ''}`}
            placeholder="33101"
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{String(errors.zipCode?.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
