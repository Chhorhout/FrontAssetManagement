'use client';

import { BellIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">KCL System</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <BellIcon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">JD</span>
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
} 