'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import { FormField } from '@/components/ui/FormField';
import Loader from '@/components/ui/Loader';
import { slideInRight } from '@/lib/animations';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to send reset link');
      } else {
        setSuccess('Password reset link has been sent to your email.');
        setEmail('');
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
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#16A34A] transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Enter the email address associated with your account, and we&apos;ll send you a link to reset your password.
          </p>

          {success ? (
            <div className="bg-[#16A34A]/10 text-[#16A34A] p-4 rounded-xl text-sm font-medium mb-6 text-center border border-[#16A34A]/20">
              {success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <FormField
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                leftIcon={Mail}
              />

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <motion.button
                type="submit"
                disabled={loading || !email}
                whileTap={{ scale: 0.96 }}
                className="w-full bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-default disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px] mt-6"
              >
                {loading ? (
                  <>
                    <Loader size="sm" className="!w-5 !h-5 border-2 border-white border-t-transparent" />
                    Sending link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
