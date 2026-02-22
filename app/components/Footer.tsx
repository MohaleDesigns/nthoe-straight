'use client';

import { useState } from 'react';
import SizeGuideModal from './SizeGuideModal';
import SitemapModal from './SitemapModal';
import Link from 'next/link';

export default function Footer() {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* column #2 */}
        <div>
          <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">The Company</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="/company?tab=careers" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="/company?tab=legal" className="hover:text-white transition-colors">Legal & Privacy</a></li>
            <li><a href="/company?tab=cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
            <li>
              <button 
                onClick={() => setIsSitemapOpen(true)} 
                className="hover:text-white hover:cursor-pointer transition-colors text-left"
              >
                Sitemap
              </button>
            </li>
          </ul>
        </div>
        {/* column #3 */}
        <div>
          <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Follow Us</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
          </ul>
        </div>
        {/* column #3 */}
        <div>
          <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Customer Care</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="/company?tab=shipping" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li>
              <button 
                onClick={() => setIsSizeGuideOpen(true)} 
                className="hover:text-white hover:cursor-pointer transition-colors text-left"
              >
                Size Guide
              </button>
            </li>
            <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
        {/* column #4 */}
        <div>
          <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Contact Us</h4>
          <p className="text-gray-400 text-sm mb-4">Our Client Advisors will be delighted to assist you on +44 207 998 6286 , or on WhatsApp +27 62 631 5233.</p>
          <p className="text-gray-400 text-sm mb-4">1255 Park Avenue, Sandton, South Africa</p>
          <Link href="mailto:info@nthoestraight.com" className="text-gray-400 text-sm mb-4 hover:text-white transition-colors">info@nthoestraight.com</Link>
        </div>
      </div>
      {/* copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Nthoe&apos;Straight. All rights reserved.
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <SitemapModal isOpen={isSitemapOpen} onClose={() => setIsSitemapOpen(false)} />
    </footer>
  );
}

