"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiCheck, FiArrowRight, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpKey, setOtpKey] = useState("");
  const [email, setEmail] = useState("");
  
  const { 
    register, 
    handleSubmit,   
    formState: { errors },
    watch,
    reset
  } = useForm();
  
  // Handle request OTP
  const handleRequestOtp = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "request_otp",
          email: data.email,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setOtpKey(result.data.otp_key);
        setEmail(data.email);
        setStep(2);
        toast.success("OTP sent to your email");
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle verify OTP
  const handleVerifyOtp = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verify_otp",
          email: email,
          otp_key: otpKey,
          otp: data.otp,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStep(3);
        toast.success("OTP verified successfully");
      } else {
        toast.error(result.message || "Failed to verify OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reset password
  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reset_password",
          email: email,
          otp_key: otpKey,
          otp: data.otp,
          newPassword: data.newPassword,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStep(4);
        toast.success("Password reset successfully");
        reset();
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Follow the steps to reset your password
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="relative mb-6 mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div 
                key={stepNumber}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  step >= stepNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > stepNumber ? <FiCheck className="h-5 w-5" /> : stepNumber}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className={step >= 1 ? "text-blue-600" : "text-gray-500"}>
              Email
            </span>
            <span className={step >= 2 ? "text-blue-600" : "text-gray-500"}>
              Verify OTP
            </span>
            <span className={step >= 3 ? "text-blue-600" : "text-gray-500"}>
              New Password
            </span>
            <span className={step >= 4 ? "text-blue-600" : "text-gray-500"}>
              Complete
            </span>
          </div>
        </div>
        
        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSubmit(handleRequestOtp)} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    id="email"
                    type="email"
                    className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send OTP"}
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiArrowRight className="h-5 w-5" />
                </span>
              </button>
            </div>
          </form>
        )}
        
        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleSubmit(handleVerifyOtp)} className="mt-8 space-y-6">
            <div>
              <p className="mb-4 text-sm text-gray-600">
                We've sent a verification code to {email}
              </p>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="mt-1">
                <input
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                    maxLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                  })}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                />
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="group relative flex w-1/3 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiArrowLeft className="h-5 w-5 text-gray-500" />
                </span>
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-2/3 justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify OTP"}
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiArrowRight className="h-5 w-5" />
                </span>
              </button>
            </div>
          </form>
        )}
        
        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleSubmit(handleResetPassword)} className="mt-8 space-y-6">
            <div>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Confirm OTP
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register("otp", {
                        required: "OTP is required",
                      })}
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Re-enter your OTP"
                    />
                    {errors.otp && (
                      <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("newPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        maxLength: {
                          value: 30,
                          message: "Password must be at most 30 characters",
                        },
                      })}
                      id="newPassword"
                      type="password"
                      className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter new password"
                    />
                    {errors.newPassword && (
                      <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("newPassword") || "Passwords do not match",
                      })}
                      id="confirmPassword"
                      type="password"
                      className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="group relative flex w-1/3 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiArrowLeft className="h-5 w-5 text-gray-500" />
                </span>
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-2/3 justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? "Resetting..." : "Reset Password"}
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiArrowRight className="h-5 w-5" />
                </span>
              </button>
            </div>
          </form>
        )}
        
        {/* Step 4: Success */}
        {step === 4 && (
          <div className="mt-6 space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FiCheck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Password Reset Successful</h3>
            <p className="text-sm text-gray-500">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <div className="pt-4">
              <a
                href="/login"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Login
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}