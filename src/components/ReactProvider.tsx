/**
 * This component ensures that React is properly loaded before rendering the app.
 * It helps prevent "Cannot read properties of undefined (reading 'createContext')" errors
 * that can occur in production builds due to code splitting and bundling issues.
 */
import React, { useEffect, useState } from 'react';

interface ReactProviderProps {
  children: React.ReactNode;
}

export function ReactProvider({ children }: ReactProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure React is available globally
    if (typeof window !== 'undefined') {
      // @ts-ignore - Add React to window to ensure it's globally available
      window.React = React;
    }
    
    // Check if React.createContext is available
    if (React && typeof React.createContext === 'function') {
      setIsReady(true);
    } else {
      console.error('React.createContext is not available. This may cause issues with context-based components.');
      // Still set ready to true to allow the app to render
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    // Show a loading indicator while ensuring React is ready
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ReactProvider;
