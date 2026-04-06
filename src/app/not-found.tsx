import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center px-4">
        {/* 404 SVG */}
        <svg
          className="w-64 h-64 mx-auto mb-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="11" stroke="#3B82F6" strokeWidth="2" />
          <path
            d="M8 8L16 16M16 8L8 16"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Error Text */}
        <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the URL or go back to the homepage.
        </p>

        {/* Back to Home Button */}
        <Link 
          href="/"
          className="inline-block px-8 py-3 text-white bg-blue-600 rounded-lg 
                   hover:bg-blue-700 transition-all duration-200 
                   hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}