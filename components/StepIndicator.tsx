'use client';

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, name: 'Customer Info' },
    { number: 2, name: 'Dealer Info' },
    { number: 3, name: 'Products' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                currentStep > step.number
                  ? 'step-completed'
                  : currentStep === step.number
                  ? 'step-active'
                  : 'step-inactive'
              }`}
            >
              {currentStep > step.number ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-700 hidden md:block">
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 md:w-24 h-1 mx-2 md:mx-4 ${currentStep > step.number ? 'bg-sun-blue' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
