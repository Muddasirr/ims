// app/layout.js
'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from './dashboard/Header/page';
import { AuthProvider, useAuth } from '../context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const RootLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {user && <Header />}
        {children}
      </body>
    </html>
  );
};

export default function App({ children }) {
  return (
    <AuthProvider>
      <RootLayout>{children}</RootLayout>
    </AuthProvider>
  );
}
