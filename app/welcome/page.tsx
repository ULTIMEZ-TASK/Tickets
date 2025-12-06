'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden text-center transform hover:scale-105 transition-transform duration-300">
        
        <div className="bg-indigo-600 p-6">
          <h1 className="text-4xl font-bold text-white tracking-wide">Hi!</h1>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome To <span className="text-indigo-600">Ultimez Technology</span>
          </h2>

          <div className="h-1 w-20 bg-indigo-500 mx-auto rounded mb-6"></div>

          <p className="text-gray-600 leading-relaxed text-lg">
            Ultimez Technology is a premier software development company delivering innovative web and mobile solutions to elevate your digital business presence.
          </p>
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <button 
            onClick={() => router.push('/')} 
            className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            Go to Dashboard &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}