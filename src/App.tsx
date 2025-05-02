
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReactProvider from "@/components/ReactProvider";

// Eager loaded components (critical path)
import Index from "./pages/Index";
import WeddingInvitation from "./pages/WeddingInvitation";

// Lazy loaded components
const NotFound = lazy(() => import("./pages/NotFound"));
const GuestList = lazy(() => import("./pages/GuestList"));
const TestApiConnection = lazy(() => import("./pages/TestApiConnection"));

// Admin pages (lazy loaded)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminGuestManagement = lazy(() => import("./pages/AdminGuestManagement"));
const AdminGuestData = lazy(() => import("./pages/AdminGuestData"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminEventSettings = lazy(() => import("./pages/AdminEventSettings"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));

const queryClient = new QueryClient();

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-sm text-muted-foreground">Memuat...</p>
    </div>
  </div>
);

const App = () => (
  <ReactProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Eager loaded routes (critical path) */}
              <Route path="/" element={<Index />} />
              <Route path="/undangan" element={<WeddingInvitation />} />

              {/* Lazy loaded routes */}
              <Route path="/guests" element={<GuestList />} />
              <Route path="/test-api" element={<TestApiConnection />} />

              {/* Admin routes (lazy loaded) */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/guests" element={<AdminGuestManagement />} />
              <Route path="/admin/guests-data" element={<AdminGuestData />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/events" element={<AdminEventSettings />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* Redirect /not-found to root */}
              <Route path="/not-found" element={<Navigate to="/" replace />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ReactProvider>
);

export default App;

