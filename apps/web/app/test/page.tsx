'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('TestPage: useEffect running');
    
    const testFetch = async () => {
      try {
        console.log('TestPage: Starting fetch to /api/jobs');
        const startTime = Date.now();
        const response = await fetch('/api/jobs');
        const endTime = Date.now();
        
        console.log(`TestPage: Fetch completed in ${endTime - startTime}ms`);
        console.log('TestPage: Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        
        const result = await response.json();
        console.log('TestPage: Parsed JSON:', result);
        
        setData(result);
        setStatus('success');
      } catch (err: any) {
        console.error('TestPage: Error:', err);
        setError(err.message);
        setStatus('error');
      }
    };

    testFetch();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Debug Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Test Instructions</h2>
        <p className="mb-2">Open browser console (F12) to see logs.</p>
        <p>Check for errors in Console tab.</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Status</h2>
        <div className={`p-4 rounded ${status === 'loading' ? 'bg-yellow-100' : status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="font-medium">Status: <span className="font-bold">{status.toUpperCase()}</span></p>
          {status === 'loading' && <p className="mt-2">Fetching from /api/jobs...</p>}
          {error && (
            <div className="mt-2">
              <p className="font-medium text-red-800">Error:</p>
              <pre className="mt-1 p-2 bg-red-50 text-red-700 rounded text-sm overflow-auto">{error}</pre>
            </div>
          )}
        </div>
      </div>
      
      {data && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">API Response</h2>
          <div className="p-4 bg-blue-50 rounded">
            <p><strong>Success:</strong> {data.success.toString()}</p>
            <p><strong>Job Count:</strong> {data.data?.length || 0}</p>
            <div className="mt-2">
              <p className="font-medium">Raw Response:</p>
              <pre className="mt-1 p-2 bg-gray-800 text-gray-100 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Manual Test Commands</h2>
        <p className="mb-2">Try these in browser console:</p>
        <pre className="p-2 bg-gray-100 rounded text-sm mb-2">
{`// Test 1: Simple fetch
fetch('/api/jobs').then(r => r.json()).then(d => console.log('Manual test:', d))

// Test 2: Check React
console.log('React:', typeof React)
console.log('useState:', typeof useState)

// Test 3: Check window location
console.log('Current URL:', window.location.href)`}
        </pre>
      </div>
    </div>
  );
}