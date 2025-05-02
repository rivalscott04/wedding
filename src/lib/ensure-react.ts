/**
 * This file ensures that React is properly loaded before any context is created.
 * It helps prevent "Cannot read properties of undefined (reading 'createContext')" errors
 * that can occur in production builds due to code splitting and bundling issues.
 */
import * as React from 'react';

// Export React to ensure it's included in the bundle
export default React;

// Export createContext as a utility function to ensure it's properly initialized
export const createContext = React.createContext;
