'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from './dashboard/Header/page';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  const router = useRouter();
  const currentPath = router.asPath; // Get the current route path

  useEffect(() => {
    if (!user && currentPath !== '/login') {
      // Redirect to login page only if user is not logged in and not on the login page
      router.push('/Login');
    }
  }, [user, currentPath, router]);

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
