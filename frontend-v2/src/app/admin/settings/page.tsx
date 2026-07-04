export default function PlaceholderPage() {
  return (
    <div className="p-8 font-sans max-w-7xl mx-auto h-full flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings (Coming Soon)</h1>
      <p className="text-gray-500 max-w-md">
        Configure platform settings, branding, and system preferences. This feature is scheduled to be built in an upcoming development phase.
      </p>
    </div>
  );
}
