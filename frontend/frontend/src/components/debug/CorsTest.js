import React, { useState } from 'react';
import { testCorsConnection } from '../../services/api';

/**
 * CORS Test Component
 * Debug component for testing CORS connection with the backend
 * Only renders in development mode
 */
const CorsTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleTestConnection = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      const testResult = await testCorsConnection();
      setResult(testResult);
    } catch (error) {
      console.error('CORS test component error:', error);
      setResult({
        success: false,
        error: {
          message: error.message || 'Unknown error occurred',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="my-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">CORS Connection Test</h2>
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className="mt-2 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Testing connection...</span>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.success ? (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Connection Successful' : 'Connection Failed'}
                </h3>
                <div className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  <p>
                    {result.success
                      ? `Successfully connected to API. Server response received.`
                      : `Failed to connect: ${result.error?.message || 'Unknown error'}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Toggle details button */}
          <button
            onClick={toggleDetails}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          {/* Details section */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Response Details:</h4>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(result.success ? result.data : result.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      {/* Help text */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          This test component helps diagnose CORS issues between frontend and backend.
          If the test fails, check your CORS configuration in both applications.
        </p>
      </div>
    </div>
  );
};

export default CorsTest;

