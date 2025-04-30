import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Database, RefreshCw, Server } from 'lucide-react';

export default function TestApiConnection() {
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');

  // Capture console logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = (...args) => {
      originalConsoleLog(...args);
      setLogs(prev => [...prev, args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')]);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      setLogs(prev => [...prev, `ERROR: ${args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`]);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  // Get API base URL on mount
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
    setApiBaseUrl(apiUrl);
    setLogs(prev => [...prev, `API Base URL: ${apiUrl || 'Not configured'}`]);
  }, []);

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    setLogs([]);

    try {
      // Check if API base URL is configured
      if (!apiBaseUrl) {
        throw new Error('API base URL is not configured. Please check your .env file.');
      }

      setLogs(prev => [...prev, `Testing API connection to: ${apiBaseUrl}`]);
      
      // Try to fetch from the API
      try {
        const response = await fetch(`${apiBaseUrl}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Add a timeout to avoid long waits
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          setLogs(prev => [...prev, `API response: ${JSON.stringify(data)}`]);
          setTestResult(true);
        } else {
          throw new Error(`API returned status: ${response.status}`);
        }
      } catch (fetchError) {
        // If health endpoint doesn't exist, try a different endpoint
        setLogs(prev => [...prev, `Health endpoint failed, trying alternative endpoint...`]);
        
        const response = await fetch(`${apiBaseUrl}/api/wedding/guests/stats`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setLogs(prev => [...prev, `Alternative API endpoint successful`]);
          setTestResult(true);
        } else {
          throw new Error(`API returned status: ${response.status}`);
        }
      }
      
      setLogs(prev => [...prev, 'API connection test successful']);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLogs(prev => [...prev, `ERROR: ${err instanceof Error ? err.message : String(err)}`]);
      setTestResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Server className="h-8 w-8" />
        API Connection Test
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test API Connection</CardTitle>
          <CardDescription>
            This page tests the connection to your API server and verifies that it's responding correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="mb-2">
              <strong>API Base URL:</strong>{' '}
              {apiBaseUrl ? (
                <span className="text-green-500 font-medium">{apiBaseUrl}</span>
              ) : (
                <span className="text-red-500 font-medium">Not configured</span>
              )}
            </p>

            {testResult !== null && (
              <Alert className={testResult ? 'bg-green-50' : 'bg-red-50'}>
                <div className="flex items-center gap-2">
                  {testResult ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <AlertTitle>
                    {testResult ? 'Connection Successful' : 'Connection Failed'}
                  </AlertTitle>
                </div>
                <AlertDescription>
                  {testResult
                    ? 'Successfully connected to the API server.'
                    : error || 'Failed to connect to the API server. Check the logs below for details.'}
                </AlertDescription>
              </Alert>
            )}

            {testResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                <h3 className="text-lg font-medium mb-2">API Connection Information</h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">Information</h4>
                    <ul className="list-disc list-inside">
                      <li className="text-sm">API connection is working correctly</li>
                      <li className="text-sm">All data operations will use the API</li>
                      <li className="text-sm">Local data will be used as fallback if API is unavailable</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={runTest}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing API Connection...
              </>
            ) : (
              <>
                <Server className="mr-2 h-4 w-4" />
                Test API Connection
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connection Logs</CardTitle>
            <CardDescription>
              Detailed logs from the API connection test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto max-h-96">
              {logs.map((log, index) => (
                <div key={index} className={log.startsWith('ERROR') ? 'text-red-400' : ''}>
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setLogs([])}>
              Clear Logs
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
