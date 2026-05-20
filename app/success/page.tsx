'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const warrantyId = searchParams.get('id');

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/warranty/download/${warrantyId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warranty-${warrantyId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>

      <h2 className="text-4xl font-bold text-sun-blue mb-4">
        Warranty Registered Successfully!
      </h2>
      
      <p className="text-xl text-gray-600 mb-8">
        Your SUN AIR equipment warranty has been registered
      </p>

      {warrantyId && (
        <div className="bg-blue-50 border-2 border-sun-blue rounded-lg p-6 mb-8 inline-block">
          <p className="text-sm text-gray-600 mb-1">Warranty Registration ID</p>
          <p className="text-2xl font-bold text-sun-blue">{warrantyId}</p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        <p className="text-gray-700">
          A confirmation email has been sent to your email address with all warranty details.
        </p>
        <p className="text-sm text-gray-600">
          Please save your Warranty Registration ID for future reference. You can use it to lookup your warranty or download your warranty certificate.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadPDF}
          className="btn-secondary"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Warranty Certificate
        </button>
        
        <a
          href="/lookup"
          className="btn-primary"
        >
          Lookup Warranty
        </a>
        
        <a
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Back to Home
        </a>
      </div>

      <div className="mt-12 bg-yellow-50 border border-sun-yellow rounded-lg p-6 max-w-2xl mx-auto">
        <h3 className="font-bold text-sun-blue mb-2">What's Next?</h3>
        <ul className="text-sm text-gray-700 space-y-2 text-left">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Keep your warranty certificate in a safe place
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Schedule regular maintenance for your equipment
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Contact us if you need to file a warranty claim
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="bg-sun-blue text-white py-6 shadow-lg">
        <div className="container-custom">
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-sun-yellow rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-sun-blue" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold">SUN AIR Warranty System</h1>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-16">
        <Suspense fallback={
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-sun-blue text-white py-6 mt-16">
        <div className="container-custom text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} SUN AIR Warranty System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
