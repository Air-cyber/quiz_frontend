'use client';
import "./globals.css";
import { useEffect, useState, Inter } from "next/font/google";
import { Navbar } from "./_ui/components/Navbar";
import Script from "next/script";

// Utility to check if code is running in browser environment
const isBrowser = () => typeof window !== 'undefined';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script strategy="afterInteractive" id="100vh-fix">
          {`
            var customViewportCorrectionVariable = 'vh';
            function setViewportProperty(doc) {
                var prevClientHeight;
                var customVar = '--' + ( customViewportCorrectionVariable || 'vh' );
                function handleResize() {
                    var clientHeight = doc.clientHeight;
                    if (clientHeight === prevClientHeight) return;
                    requestAnimationFrame(function updateViewportHeight() {
                        doc.style.setProperty(customVar, (clientHeight * 0.01) + 'px');
                        prevClientHeight = clientHeight;
                    });
                }
                handleResize();
                return handleResize;
            }
            (isBrowser() ? isBrowser() ? window.addEventListener : null('resize', setViewportProperty((isBrowser() ? isBrowser() ? document.documentElement : null)) : null) : null);
          `}
        </Script>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
