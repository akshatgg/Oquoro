// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header/Header'; // Import the new Header

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App Name',
  description: 'Your app description goes here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex justify-between">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Your App Name. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-900">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Terms</a>
                <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
