// src/components/Header.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status
  const checkAuthStatus = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    setIsLoggedIn(!!token);
    
    // Redirect to login if trying to access Questions page without login
    if (pathname === "/questions" && !token) {
      router.push("/login");
    }
  };

  // Check auth status on component mount and when pathname changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage events to detect login/logout from other tabs
    window.addEventListener("storage", (event) => {
      if (event.key === "authChange") {
        checkAuthStatus();
      }
    });

    // Set up a custom event listener for auth changes within the same tab
    window.addEventListener("authStateChanged", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("authStateChanged", checkAuthStatus);
    };
  }, [pathname]);

  // Handle logout
  const handleLogout = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        // Dispatch auth change event
        window.localStorage.setItem("authChange", Date.now().toString());
        window.dispatchEvent(new Event("authStateChanged"));
        
        // Update state and redirect
        setIsLoggedIn(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle the questions link click to check auth before navigation
  const handleQuestionsClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Your App
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>
              
              {/* Show Questions link for all users but handle auth check on click */}
              <Link
                href="/questions"
                onClick={handleQuestionsClick}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Questions
              </Link>
              
              <Link
                href="/users"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Users
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}