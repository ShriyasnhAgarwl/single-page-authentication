import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';

// Password strength regex patterns
const containsUppercase = /[A-Z]/;
const containsLowercase = /[a-z]/;
const containsNumber = /[0-9]/;
const containsSpecial = /[!@#$%^&*(),.?":{}|<>]/;

// Validation schema
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(val => containsUppercase.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine(val => containsLowercase.test(val), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine(val => containsNumber.test(val), {
      message: 'Password must contain at least one number',
    })
    .refine(val => containsSpecial.test(val), {
      message: 'Password must contain at least one special character',
    }),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);

  // Initialize form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch password field for strength calculation
  const password = watch('password', '');

  // Calculate password strength
  React.useEffect(() => {
    let score = 0;
    if (password.length > 0) {
      // Basic length check
      if (password.length >= 8) score++;
      
      // Character type checks
      if (containsUppercase.test(password)) score++;
      if (containsLowercase.test(password)) score++;
      if (containsNumber.test(password)) score++;
      if (containsSpecial.test(password)) score++;
    }
    setPasswordScore(score);
  }, [password]);

  // Get password strength text and color
  const getPasswordStrengthInfo = () => {
    if (password.length === 0) return { text: '', color: 'gray-300' };
    
    if (passwordScore < 2) return { text: 'Weak', color: 'red-500' };
    if (passwordScore < 4) return { text: 'Moderate', color: 'yellow-500' };
    return { text: 'Strong', color: 'green-500' };
  };

  const strengthInfo = getPasswordStrengthInfo();

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setServerError('');

      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      if (result.success) {
        // Redirect to profile page on successful registration
        navigate('/profile');
      } else {
        setServerError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setServerError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Create an Account
      </h2>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center">
                <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div 
                    className={`h-full bg-${strengthInfo.color}`} 
                    style={{ width: `${(passwordScore / 5) * 100}%` }}
                  />
                </div>
                <span className={`ml-2 text-xs font-medium text-${strengthInfo.color}`}>
                  {strengthInfo.text}
                </span>
              </div>
              <ul className="mt-2 text-xs text-gray-600 space-y-1">
                <li className={password.length >= 8 ? "text-green-600" : ""}>
                  ✓ At least 8 characters
                </li>
                <li className={containsUppercase.test(password) ? "text-green-600" : ""}>
                  ✓ At least one uppercase letter
                </li>
                <li className={containsLowercase.test(password) ? "text-green-600" : ""}>
                  ✓ At least one lowercase letter
                </li>
                <li className={containsNumber.test(password) ? "text-green-600" : ""}>
                  ✓ At least one number
                </li>
                <li className={containsSpecial.test(password) ? "text-green-600" : ""}>
                  ✓ At least one special character
                </li>
              </ul>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

