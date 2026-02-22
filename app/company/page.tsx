'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CompanyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Use URL param as the single source of truth, default to 'careers'
  const activeTab = searchParams.get('tab') || 'careers';

  const handleTabChange = (tabId: string) => {
    // Update URL without full reload using router.push
    router.push(`?tab=${tabId}`, { scroll: false });
  };

  const tabs = [
    { id: 'careers', label: 'Careers' },
    { id: 'legal', label: 'Legal & Privacy' },
    { id: 'cookies', label: 'Cookies' },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'careers':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold font-playfair mb-4">Join Our Team</h2>
            <p className="text-gray-600">
              At Nthoe&apos;Straight, we are always looking for passionate individuals who share our vision for minimalist luxury.
            </p>
            <div className="bg-gray-50 p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2">Current Openings</h3>
              <p className="text-gray-500 italic">There are currently no open positions. Please check back later.</p>
            </div>
          </div>
        );
      case 'legal':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold font-playfair mb-4">Legal & Privacy Policy</h2>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>
                Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
              </p>
              <h3 className="font-bold text-gray-900">Information Collection</h3>
              <p>
                We collect information you provide directly to us when you make a purchase, create an account, or contact us.
              </p>
              <h3 className="font-bold text-gray-900">Data Protection</h3>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information.
              </p>
            </div>
          </div>
        );
      case 'cookies':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold font-playfair mb-4">Cookie Policy</h2>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
              </p>
              <h3 className="font-bold text-gray-900">What are cookies?</h3>
              <p>
                Cookies are small text files stored on your device that help us remember your preferences and improve our website.
              </p>
              <h3 className="font-bold text-gray-900">Managing Cookies</h3>
              <p>
                You can choose to disable cookies through your browser settings, though this may affect site functionality.
              </p>
            </div>
          </div>
        );
      case 'shipping':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold font-playfair mb-4">Shipping & Returns</h2>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <h3 className="font-bold text-gray-900">Shipping Information</h3>
              <p>
                We offer worldwide shipping. Orders are typically processed within 1-2 business days.
                Standard shipping times vary by location (3-7 business days).
              </p>
              <h3 className="font-bold text-gray-900">Return Policy</h3>
              <p>
                We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached.
              </p>
              <h3 className="font-bold text-gray-900">How to Return</h3>
              <p>
                To initiate a return, please contact our support team at info@nthoestraight.com with your order number.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold font-playfair mb-4">Join Our Team</h2>
            <p className="text-gray-600">
              At Nthoe&apos;Straight, we are always looking for passionate individuals who share our vision for minimalist luxury.
            </p>
            <div className="bg-gray-50 p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2">Current Openings</h3>
              <p className="text-gray-500 italic">There are currently no open positions. Please check back later.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <h1 className="text-4xl font-playfair font-bold text-center mb-12">Company Information</h1>
      
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`text-left px-4 py-3 transition-colors duration-200 hover:cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="grow bg-white p-8 border border-gray-100 shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function CompanyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyContent />
    </Suspense>
  );
}
