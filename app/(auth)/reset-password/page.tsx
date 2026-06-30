'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import { FormField } from '@/components/ui/FormField';
import Loader from '@/components/ui/Loader';
import { slideInRight } from '@/lib/animations';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to reset password');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        className="flex-1 flex items-center justify-center min-h-screen px-6 py-10 bg-white dark:bg-[#0A0F0A]"
      >
        <div className="max-w-md w-full mx-auto">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#16A34A]/10 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white mb-2">
                Password Reset!
              </h1>
              <p className="text-gray-500 mb-8">
                Your password has been changed successfully. Redirecting you to the login page...
              </p>
              <Link href="/login" className="text-[#16A34A] font-semibold hover:underline">
                Click here to login now
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#16A34A] transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Login
              </Link>

              <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white mb-2">
                Create New Password
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                Your new password must be at least 6 characters long.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <FormField
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  leftIcon={Lock}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <FormField
                  label="Confirm New Password"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  leftIcon={Lock}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-400"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <motion.button
                  type="submit"
                  disabled={loading || !token}
                  whileTap={{ scale: 0.96 }}
                  className="w-full bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-default disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px] mt-6"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" className="!w-5 !h-5 border-2 border-white border-t-transparent" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0F0A]">
          <Loader />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
