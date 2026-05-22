'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Phone } from 'lucide-react';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import { FormField } from '@/components/ui/FormField';
import Loader from '@/components/ui/Loader';
import { slideInRight } from '@/lib/animations';

interface LoginFormData {
  phone: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (session?.user) {
      const userRole = (session.user as { role?: string }).role;
      router.replace(userRole === 'owner' ? '/dashboard/owner' : '/dashboard/user');
    }
  }, [session, router]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      phone: data.phone,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (!result?.ok) {
      setError('Invalid phone or password');
      return;
    }

    router.push('/dashboard');
    router.refresh();
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
          <div className="lg:hidden flex flex-col items-center mb-8">
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
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mb-8 mt-2">
            Login to manage your listings
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={Phone}
              {...register('phone', { required: 'Phone number is required' })}
              error={errors.phone?.message}
            />
            <FormField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              leftIcon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />

            <div className="text-right mb-6 -mt-2">
              <Link
                href="/forgot-password"
                className="text-[#16A34A] text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

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
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-sm my-6">— or —</p>

          <p className="text-center text-gray-500 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#16A34A] font-semibold hover:underline">
              Register here →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
