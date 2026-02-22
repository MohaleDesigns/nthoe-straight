"use client";

import Modal from "./Modal";

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sitemap">
      <div className="space-y-8">
        <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.667794017342!2d28.05608631502446!3d-26.105156983482025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9573307613399b%3A0x6a0a09e07f6f571!2s1255%20Park%20St%2C%20Sandton%2C%202196%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1675865239123!5m2!1sen!2sus"
          ></iframe>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          1255 Park Avenue, Sandton, South Africa
        </p>
      </div>
    </Modal>
  );
}
