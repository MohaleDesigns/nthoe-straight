'use client';

import React from 'react';
import Modal from './Modal';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide">
      <div className="space-y-6 text-gray-700">
        <p className="text-sm text-gray-500">
          Our t-shirts are designed with a regular fit. Use the chart below to determine your size.
          Measurements are in centimeters.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Size</th>
                <th scope="col" className="px-6 py-3">Chest</th>
                <th scope="col" className="px-6 py-3">Length</th>
                <th scope="col" className="px-6 py-3">Shoulder</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">S</td>
                <td className="px-6 py-4">96</td>
                <td className="px-6 py-4">70</td>
                <td className="px-6 py-4">43</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">M</td>
                <td className="px-6 py-4">102</td>
                <td className="px-6 py-4">72</td>
                <td className="px-6 py-4">45</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">L</td>
                <td className="px-6 py-4">108</td>
                <td className="px-6 py-4">74</td>
                <td className="px-6 py-4">47</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">XL</td>
                <td className="px-6 py-4">114</td>
                <td className="px-6 py-4">76</td>
                <td className="px-6 py-4">49</td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-4 font-medium text-gray-900">XXL</td>
                <td className="px-6 py-4">120</td>
                <td className="px-6 py-4">78</td>
                <td className="px-6 py-4">51</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <h4 className="font-bold mb-2">How to Measure</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest.</li>
            <li><strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem.</li>
            <li><strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
