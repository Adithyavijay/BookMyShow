// app/components/GoogleOAuthProviderWrapper.tsx
'use client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import React from 'react';

// Define the props for the ErrorFallback component
function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}


interface GoogleOAuthProviderWrapperProps {
  children: React.ReactNode; 
}

export default function GoogleOAuthProviderWrapper({ children }: GoogleOAuthProviderWrapperProps) {

   return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
        {children}
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}
