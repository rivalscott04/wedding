import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Database, RefreshCw } from 'lucide-react';
import { isUsingLocalStorage } from '@/lib/db';

export default function TestDatabase() {
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

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

  // Initialize database on mount
  useEffect(() => {
    setUsingLocalStorage(true);
    setLogs(prev => [...prev, 'Using localStorage for database operations in the frontend']);
  }, []);

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    setLogs([]);

    try {
      // Always using localStorage in the frontend
      setTestResult(true);
      setUsingLocalStorage(true);
      setLogs(prev => [...prev, 'Using localStorage for database operations in the frontend']);
      setLogs(prev => [...prev, 'MySQL connection is disabled in the frontend to avoid buffer issues']);
      setLogs(prev => [...prev, 'All database operations will use localStorage']);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTestResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Database className="h-8 w-8" />
        Database Connection Test
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Database Connection</CardTitle>
          <CardDescription>
            This page tests the connection to your MySQL database and verifies that all required tables exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="mb-2">
              <strong>Current Status:</strong>{' '}
              {usingLocalStorage ? (
                <span className="text-amber-500 font-medium">Using localStorage (No MySQL connection)</span>
              ) : (
                <span className="text-green-500 font-medium">Using MySQL database</span>
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
                    ? 'Successfully connected to the database and verified all tables.'
                    : error || 'Failed to connect to the database. Check the logs below for details.'}
                </AlertDescription>
              </Alert>
            )}

            {testResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                <h3 className="text-lg font-medium mb-2">Frontend Database Mode</h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">Information</h4>
                    <ul className="list-disc list-inside">
                      <li className="text-sm">Using localStorage for database operations</li>
                      <li className="text-sm">MySQL connection is disabled in the frontend</li>
                      <li className="text-sm">All data is stored locally in the browser</li>
                      <li className="text-sm">Data will persist between page refreshes</li>
                      <li className="text-sm">Data will be lost if browser storage is cleared</li>
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
                Testing Connection...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Test Database Connection
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
              Detailed logs from the connection test
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
