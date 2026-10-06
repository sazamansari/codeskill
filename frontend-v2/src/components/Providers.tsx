"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "@/context/ThemeContext";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const content = (
    <AuthProvider>
      {children}
      <Toaster position="top-center" />
    </AuthProvider>
  );

  return (
    <ThemeProvider defaultTheme="light">
      {clientId ? (
        <GoogleOAuthProvider clientId={clientId}>
          {content}
        </GoogleOAuthProvider>
      ) : (
        content
      )}
    </ThemeProvider>
  );
}
