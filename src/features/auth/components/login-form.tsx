'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Shield, Search, Lock, ShieldAlert, Crosshair, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { TextInput } from '@/components/ui/text-input';
import { Button } from '@/components/ui/button';

// Demo credentials — in a real app this would be an API call
const VALID_EMAIL = 'admin@stackguard.io';
const VALID_PASSWORD = 'password123';

interface FormErrors {
  email?: string;
  password?: string;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email is required';
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return undefined;
}

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@stackguard.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate a single field on blur so the user gets instant feedback when leaving
  const handleBlur = (field: 'email' | 'password') => {
    const value = field === 'email' ? email : password;
    const error = field === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Clear field error as the user types (don't punish mid-input)
  const handleChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value);
    else setPassword(value);
    // Clear the field error and the auth error on any change
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run full validation before submitting
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      // Simulate network latency for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
        setAuthError('Invalid email or password. Please try again.');
        return;
      }

      // Set a session cookie readable by Next.js middleware
      document.cookie = 'sg_auth=true; path=/; max-age=86400; SameSite=Lax';

      // Redirect to the originally intended page, or dashboard
      const params = new URLSearchParams(window.location.search);
      router.push(params.get('next') || '/dashboard');
    } catch {
      setAuthError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left branding panel */}
      <div className="relative hidden w-full lg:w-1/2 flex-col items-center justify-center bg-[#1a0b2e] px-12 py-16 text-white text-center lg:flex overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-purple-800/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-purple-700/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-900/40 border border-purple-600/50 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] z-10 p-4">
            <Image src="/logo.png" alt="StackGuard Logo" width={80} height={80} className="object-contain" />
          </div>
        </div>

        <div className="relative z-20 mt-[-400px]">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Image src="/logo.png" alt="StackGuard Logo" width={32} height={32} className="object-contain" />
            <span className="text-2xl font-bold tracking-tight">StackGuard</span>
          </div>
          <h1 className="text-3xl font-medium leading-snug tracking-tight mb-4">
            Remediation First Platform for<br /> Non-Human Identities
          </h1>
        </div>
      </div>

      {/* Right login form panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white px-8 py-16 sm:px-12 md:px-16">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
              Let's login you first to your StackGuard account
            </h3>
            <p className="text-sm text-gray-500">Enter your credentials to get started</p>
          </div>

          {/* Auth-level error banner */}
          {authError && (
            <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <TextInput
                  id="email"
                  type="email"
                  placeholder="admin@stackguard.io"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={!!errors.email}
                  disabled={isLoading}
                  autoComplete="email"
                  className="bg-blue-50/50 border-gray-200 placeholder:text-gray-400 focus:bg-white"
                />
                {errors.email && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <TextInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={!!errors.password}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="bg-blue-50/50 border-gray-200 focus:bg-white"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-gray-700 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  }
                />
                {errors.password && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-[120px] bg-[#3a0e73] hover:bg-[#2d0a59] disabled:opacity-70"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </form>

          <div className="text-left text-sm text-gray-500 pt-4">
            Don&apos;t have an account?{' '}
            <Link href="#" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
