'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Phone, User, Search, Home } from 'lucide-react';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import { FormField } from '@/components/ui/FormField';
import Loader from '@/components/ui/Loader';
import { slideInRight } from '@/lib/animations';
import { cn } from '@/lib/utils';

type RegisterRole = 'user' | 'owner';

interface RegisterFormData {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  whatsappNumber?: string;
  terms: boolean;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'owner' ? 'owner' : 'user';
  const [role, setRole] = useState<RegisterRole>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          password: data.password,
          role,
          whatsappNumber: role === 'owner' ? data.whatsappNumber : undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? 'Registration failed');
        setLoading(false);
        return;
      }

      const signInResult = await signIn('credentials', {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        if (role === 'owner') {
          router.push('/dashboard/owner');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch {
      setError('Registration failed. Please try again.');
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
          <div className="md:hidden flex flex-col items-center mb-8">
            <Image
              src="/meraroom-icon.svg"
              alt="MeraRoom"
              width={48}
              height={48}
              className="mb-2"
            />
            <span className="font-display text-xl text-[#0F2E1E] dark:text-white">
              MeraRoom
            </span>
          </div>

          <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mb-8 mt-2">
            List your property or save your favourite rooms
          </p>

          <p className="text-sm font-medium text-[#0F2E1E] dark:text-white mb-3">I am a...</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {(
              [
                {
                  id: 'user' as const,
                  Icon: Search,
                  title: "I'm Looking for a Room",
                  subtitle: "Find & save rooms",
                  selectedClass: 'border-2 border-[#16A34A] bg-[#F0FDF4] dark:bg-[#0F2E1E]/30',
                },
                {
                  id: 'owner' as const,
                  Icon: Home,
                  title: "I Want to List My Room",
                  subtitle: "Post & manage listings",
                  selectedClass: 'border-2 border-[#D4AF37] bg-[#D4AF37]/10',
                },
              ] as const
            ).map((option) => {
              const RoleIcon = option.Icon;
              const isSelected = role === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  className={cn(
                    'flex-1 border-2 rounded-xl p-4 text-left cursor-pointer transition-default min-h-[44px] flex flex-col justify-between',
                    isSelected
                      ? option.selectedClass
                      : 'border-gray-200 dark:border-[#1F2E1F] bg-white dark:bg-[#111A11]'
                  )}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className={cn(
                      'p-2 rounded-lg shrink-0',
                      isSelected
                        ? option.id === 'user' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#D4AF37]/15 text-[#D4AF37]'
                        : 'bg-gray-100 dark:bg-[#1A2A1A] text-gray-400'
                    )}>
                      <RoleIcon className="w-6 h-6" aria-hidden />
                    </span>
                    <div>
                      <span className="font-semibold text-sm block text-[#0F2E1E] dark:text-white">
                        {option.title}
                      </span>
                      <span className="text-xs text-gray-500 block mt-0.5">
                        {option.subtitle}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
              label="Full Name"
              placeholder="Rahul Sharma"
              leftIcon={User}
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            <FormField
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={Phone}
              {...register('phone', {
                required: 'Phone is required',
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Enter valid Indian mobile number',
                },
              })}
              error={errors.phone?.message}
            />
            <p className="text-xs text-gray-400 -mt-2 mb-4">
              This will be your login ID
            </p>

            <FormField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              leftIcon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
              error={errors.password?.message}
            />

            <FormField
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              leftIcon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-gray-400"
                  aria-label="Toggle confirm password"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            {role === 'owner' && (
              <>
                <FormField
                  label="WhatsApp Number for Inquiries"
                  type="tel"
                  placeholder="+91 98765 43210"
                  leftIcon={Phone}
                  {...register('whatsappNumber', {
                    required: 'WhatsApp number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Enter valid Indian mobile number',
                    },
                  })}
                  error={errors.whatsappNumber?.message}
                />
                <p className="text-xs text-[#16A34A] -mt-2 mb-4">
                  Buyers will contact you here
                </p>
              </>
            )}

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                {...register('terms', { required: 'You must agree to the terms' })}
              />
              <span className="text-sm text-gray-500">
                I agree to Terms &amp; Conditions
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm -mt-4 mb-4">{errors.terms.message}</p>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-default disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px]"
            >
              {loading ? (
                <>
                  <Loader size="sm" className="!w-5 !h-5 border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#16A34A] font-semibold hover:underline">
              Login here →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0F0A]">
          <Loader />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
