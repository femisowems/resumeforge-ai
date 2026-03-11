import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeForge AI | Engineer Your Perfect Resume",
  description: "AI-powered resume optimization tool that tailors your CV to any job description for maximum ATS compatibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f1f5f9',
              border: '1px solid #1e293b',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
            },
            success: {
              iconTheme: {
                primary: '#4f46e5',
                secondary: '#ffffff',
              },
            },
          }} 
        />
        {children}
      </body>
    </html>
  );
}
