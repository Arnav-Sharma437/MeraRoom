'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, leftIcon: LeftIcon, rightElement, className, id, ...props }, ref) => {
    const fieldId = id ?? label.replace(/\s/g, '-').toLowerCase();

    return (
      <div className="w-full mb-4">
        <label htmlFor={fieldId} className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1.5">
          {label}
        </label>
        <div className="relative">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          )}
          <input
            ref={ref}
            id={fieldId}
            className={cn(
              'w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-[#111A11] border text-[#1A1A1A] dark:text-white font-sans text-base transition-default',
              'border-gray-200 dark:border-[#1F2E1F] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none',
              error && 'border-red-400 focus:ring-red-400/20 focus:border-red-400',
              LeftIcon && 'pl-10',
              rightElement ? 'pr-12' : undefined,
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const fieldId = id ?? label.replace(/\s/g, '-').toLowerCase();

    return (
      <div className="w-full mb-4">
        <label htmlFor={fieldId} className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1.5">
          {label}
        </label>
        <select
          ref={ref}
          id={fieldId}
          className={cn(
            'w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-[#111A11] border text-[#1A1A1A] dark:text-white font-sans text-base transition-default',
            'border-gray-200 dark:border-[#1F2E1F] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none',
            error && 'border-red-400',
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id ?? label.replace(/\s/g, '-').toLowerCase();

    return (
      <div className="w-full mb-4">
        <label htmlFor={fieldId} className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1.5">
          {label}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(
            'w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-[#111A11] border text-[#1A1A1A] dark:text-white font-sans text-base resize-none transition-default',
            'border-gray-200 dark:border-[#1F2E1F] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
