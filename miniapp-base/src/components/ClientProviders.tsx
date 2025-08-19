"use client";
import React, { type PropsWithChildren } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { base } from 'wagmi/chains';
import { AppProvider } from '@/context/AppContext';

export default function ClientProviders({ children }: PropsWithChildren) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const apiKey =
    process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ||
    process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY ||
    "";

  return (
    <AppProvider>
      <MiniKitProvider apiKey={apiKey} chain={base}>
        <GoogleOAuthProvider clientId={clientId}>
          {children}
        </GoogleOAuthProvider>
      </MiniKitProvider>
    </AppProvider>
  );
}
