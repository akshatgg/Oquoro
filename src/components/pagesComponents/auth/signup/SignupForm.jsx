'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    about: '',
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpKey, setOtpKey] = useState(null);
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tags') {
      setFormData({ 
        ...formData, 
        [name]: value.split(',').map(tag => tag.trim()) 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name is required (min 2 characters)';
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOtpKey(data.data.otp_key);
        setShowOtpForm(true);
      } else {
        setErrors({ form: data.message || 'Signup failed' });
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' });
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit OTP' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp_key: otpKey,
          otp: otp
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to login page after successful verification
        router.push('/login?verified=true');
      } else {
        setErrors({ otp: data.message || 'OTP verification failed' });
      }
    } catch (error) {
      setErrors({ otp: 'An error occurred. Please try again.' });
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {showOtpForm ? 'Verify Your Email' : 'Create an Account'}
      </h1>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.form}
        </div>
      )}
      
      {!showOtpForm ? (
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Minimum 8 characters"
            />
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone Number (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="10-digit phone number"
            />
            {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="about">
              About (optional)
            </label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Tell us about yourself"
              rows="3"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="tags">
              Skills/Tags (optional)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="javascript, react, node (comma separated)"
            />
            <p className="mt-1 text-gray-500 text-xs">Separate tags with commas</p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="mb-6">
            <p className="mb-4 text-gray-600">
              We've sent a verification code to <strong>{formData.email}</strong>. Please enter the 6-digit code below.
            </p>
            
            <label className="block text-gray-700 mb-2" htmlFor="otp">
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (errors.otp) setErrors({ ...errors, otp: '' });
              }}
              className={`w-full px-3 py-2 border rounded-md text-center text-xl tracking-widest ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="000000"
              maxLength="6"
            />
            {errors.otp && <p className="mt-1 text-red-500 text-sm">{errors.otp}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;