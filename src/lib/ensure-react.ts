/**
 * This file ensures that React is properly loaded before any context is created.
 * It helps prevent "Cannot read properties of undefined (reading 'createContext')" errors
 * that can occur in production builds due to code splitting and bundling issues.
 */
import * as React from 'react';

// Create a global React instance to ensure it's available everywhere
if (typeof window !== 'undefined') {
  // @ts-ignore - Add React to window to ensure it's globally available
  window.React = React;
}

// Export a safe createContext function that checks if React is defined
export function safeCreateContext<T>(defaultValue: T) {
  if (!React || typeof React.createContext !== 'function') {
    console.error('React.createContext is not available. Using a fallback.');
    // Return a minimal implementation if React.createContext is not available
    return {
      Provider: ({ children }: { children: React.ReactNode }) => children,
      Consumer: ({ children }: { children: (value: T) => React.ReactNode }) =>
        children(defaultValue),
      displayName: 'FallbackContext',
      _currentValue: defaultValue,
    };
  }
  return React.createContext(defaultValue);
}

// Export React to ensure it's included in the bundle
export default React;
