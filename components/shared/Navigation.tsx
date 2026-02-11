'use client';

import Link from 'next/link';
import RepSelector from './RepSelector';

interface NavigationProps {
  currentRepId?: string;
}

export default function Navigation({ currentRepId }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">
              Sales Forecast Tool
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Manager View
            </Link>
            <RepSelector currentRepId={currentRepId} />
          </div>
        </div>
      </div>
    </nav>
  );
}
