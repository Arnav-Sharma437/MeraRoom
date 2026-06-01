'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Check, CheckCircle, Pencil } from 'lucide-react';
import { LucideByName } from '@/components/ui/LucideByName';
import PostRoomPhotoStep, { type PhotoItem } from '@/components/dashboard/owner/PostRoomPhotoStep';
import toast from 'react-hot-toast';
import {
  POST_ROOM_TYPES,
  POST_AMENITIES,
  POST_FURNISHING,
  ALLOWED_FOR_CHIPS,
  DHARAMSHALA_AREAS,
  GENDER_OPTIONS,
  DEFAULT_AMENITIES,
} from '@/constants';
import { cn, formatRent, normalizePhone } from '@/lib/utils';
import type { RoomType, Furnishing, GenderPreference, IRoomAmenities, IRoomAllowedFor } from '@/models/Room';
import Loader from '@/components/ui/Loader';

const STEPS = ['Basic Info', 'Location', 'Amenities', 'Photos', 'Review'];

interface FormState {
  title: string;
  description: string;
  roomType: RoomType;
  rent: string;
  deposit: string;
  allowedFor: IRoomAllowedFor;
  gender: GenderPreference;
  area: string;
  address: string;
  whatsappNumber: string;
  furnishing: Furnishing;
  amenities: IRoomAmenities;
  images: string[];
  terms: boolean;
}

const initialForm: FormState = {
  title: '',
  description: '',
  roomType: 'single',
  rent: '',
  deposit: '',
  allowedFor: { students: false, working: false, family: false, bachelors: false },
  gender: 'any',
  area: '',
  address: '',
  whatsappNumber: '',
  furnishing: 'furnished',
  amenities: { ...DEFAULT_AMENITIES },
  images: [],
  terms: false,
};

export default function PostRoomForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photoItems, setPhotoItems] = useState<PhotoItem[]>([]);

  const inputCls =
    'w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-[#111A11] border border-gray-200 dark:border-[#1F2E1F] text-[#1A1A1A] dark:text-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:outline-none';

  useEffect(() => {
    async function loadPhone() {
      const res = await fetch('/api/users/me');
      const json = await res.json();
      if (json.success && json.data?.phone) {
        setForm((f) => ({
          ...f,
          whatsappNumber: f.whatsappNumber || json.data.phone,
        }));
      }
    }
    if (session?.user) loadPhone();
  }, [session]);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.title.trim()) {
        e.title = 'Title is required';
      } else if (form.title.trim().length < 10) {
        e.title = 'Title must be at least 10 characters';
      }
      if (!form.description.trim()) {
        e.description = 'Description is required';
      }
      const rentNum = Number(form.rent);
      if (!form.rent) {
        e.rent = 'Rent is required';
      } else if (isNaN(rentNum) || rentNum < 1000 || rentNum > 100000) {
        e.rent = 'Rent must be between ₹1,000 and ₹1,00,000';
      }
    }
    if (step === 1) {
      if (!form.area) e.area = 'Area is required';
      if (!form.address.trim()) e.address = 'Address is required';
      
      const cleanWa = form.whatsappNumber.trim().replace(/\D/g, '');
      const waDigits = cleanWa.length === 12 && cleanWa.startsWith('91') ? cleanWa.slice(2) : cleanWa;
      if (!form.whatsappNumber.trim()) {
        e.whatsapp = 'WhatsApp number is required';
      } else if (!/^[6-9]\d{9}$/.test(waDigits)) {
        e.whatsapp = 'Enter valid Indian mobile number';
      }
    }
    if (step === 3) {
      const urls = photoItems.filter((i) => i.url).map((i) => i.url!);
      if (urls.length < 1) {
        e.images = 'At least 1 photo is required';
      } else {
        setForm(f => ({ ...f, images: urls }));
      }
    }
    if (step === 4) {
      if (!form.terms) e.terms = 'Please confirm accuracy';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    const imageUrls = photoItems.filter((i) => i.url).map((i) => i.url!);
    if (imageUrls.length < 1) {
      setErrors({ images: 'At least 1 photo is required' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          roomType: form.roomType,
          rent: Number(form.rent),
          deposit: Number(form.deposit) || 0,
          area: form.area,
          address: form.address,
          whatsappNumber: normalizePhone(form.whatsappNumber),
          furnishing: form.furnishing,
          gender: form.gender,
          amenities: form.amenities,
          allowedFor: form.allowedFor,
          images: imageUrls,
          status: 'pending',
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Room posted successfully');
        setSuccess(true);
      } else {
        toast.error(json.error ?? 'Submit failed');
      }
    } catch {
      toast.error('Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 4) setStep((s) => s + 1);
    else handleSubmit();
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 max-w-md mx-auto"
      >
        <CheckCircle className="w-20 h-20 text-[#16A34A] mx-auto mb-6" />
        <h2 className="font-display text-3xl text-[#0F2E1E] dark:text-white mb-2">
          Room submitted for review!
        </h2>
        <p className="text-gray-500 mb-8">
          Admin will approve within 24hrs
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/owner')}
            className="bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold min-h-[44px]"
          >
            View My Listings
          </button>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setStep(0);
              setForm(initialForm);
              setPhotoItems([]);
            }}
            className="border border-[#0F2E1E] dark:border-[#D4AF37] text-[#0F2E1E] dark:text-[#D4AF37] rounded-xl py-3.5 font-semibold"
          >
            Post Another
          </button>
        </div>
      </motion.div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl text-[#0F2E1E] dark:text-white mb-6">Post New Room</h1>

      <div className="h-2 bg-gray-200 dark:bg-[#1F2E1F] rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-[#16A34A]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex justify-between mb-8 overflow-x-auto gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center min-w-[56px]">
            <span
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                i < step && 'bg-[#16A34A] text-white',
                i === step && 'bg-[#D4AF37] text-[#0F2E1E]',
                i > step && 'bg-gray-200 dark:bg-[#1F2E1F] text-gray-400'
              )}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </span>
            <span className="text-[10px] text-gray-500 mt-1 text-center hidden sm:block">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111A11] rounded-2xl p-6 border border-gray-100 dark:border-[#1F2E1F] mb-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#0F2E1E] dark:text-white">Room Title</label>
              <input
                maxLength={80}
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. Furnished Single Room near McLeod Ganj"
                className={cn(inputCls, 'mt-1')}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Describe your room — nearby landmarks, floor, building type..."
                className={cn(inputCls, 'mt-1 resize-none')}
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Room Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POST_ROOM_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update({ roomType: t.value as RoomType })}
                    className={cn(
                      'border-2 rounded-xl p-3 text-center text-sm transition-default',
                      form.roomType === t.value
                        ? 'border-[#16A34A] bg-[#F0FDF4] dark:bg-[#0F2E1E]/30'
                        : 'border-gray-200 dark:border-[#1F2E1F]'
                    )}
                  >
                    <LucideByName name={t.icon} size={24} className="mx-auto mb-1 text-[#16A34A]" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={form.rent}
                  onChange={(e) => update({ rent: e.target.value })}
                  placeholder="7500"
                  className={cn(inputCls, 'mt-1')}
                />
                {errors.rent && <p className="text-red-500 text-xs">{errors.rent}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={form.deposit}
                  onChange={(e) => update({ deposit: e.target.value })}
                  placeholder="15000"
                  className={cn(inputCls, 'mt-1')}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Available For</label>
              <div className="flex flex-wrap gap-2">
                {ALLOWED_FOR_CHIPS.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() =>
                      update({
                        allowedFor: {
                          ...form.allowedFor,
                          [chip.key]: !form.allowedFor[chip.key as keyof IRoomAllowedFor],
                        },
                      })
                    }
                    className={cn(
                      'rounded-full px-4 py-1.5 text-sm border transition-default',
                      form.allowedFor[chip.key as keyof IRoomAllowedFor]
                        ? 'bg-[#16A34A] text-white border-[#16A34A]'
                        : 'border-gray-300 dark:border-[#1F2E1F]'
                    )}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Gender Preference</label>
              <div className="flex gap-4">
                {GENDER_OPTIONS.map((g) => (
                  <label key={g.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={form.gender === g.value}
                      onChange={() => update({ gender: g.value as GenderPreference })}
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Area</label>
              <select
                value={form.area}
                onChange={(e) => update({ area: e.target.value })}
                className={cn(inputCls, 'mt-1')}
              >
                <option value="">Select area</option>
                {DHARAMSHALA_AREAS.map((a) => (
                  <option key={a.slug} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
              {errors.area && <p className="text-red-500 text-xs">{errors.area}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Full Address</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => update({ address: e.target.value })}
                placeholder="House no, Street, Near landmark..."
                className={cn(inputCls, 'mt-1 resize-none')}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">WhatsApp Number</label>
              <input
                type="tel"
                value={form.whatsappNumber}
                onChange={(e) => update({ whatsappNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className={cn(inputCls, 'mt-1')}
              />
              <p className="text-[#16A34A] text-xs mt-1">
                Users will WhatsApp this number directly
              </p>
              {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">What does your room offer?</h3>
            <div>
              <label className="text-sm font-medium mb-2 block">Furnishing</label>
              <div className="grid grid-cols-3 gap-2">
                {POST_FURNISHING.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => update({ furnishing: f.value as Furnishing })}
                    className={cn(
                      'border-2 rounded-xl p-3 text-center text-sm',
                      form.furnishing === f.value
                        ? 'border-[#16A34A] bg-[#F0FDF4] dark:bg-[#0F2E1E]/30'
                        : 'border-gray-200 dark:border-[#1F2E1F]'
                    )}
                  >
                    <LucideByName name={f.icon} size={22} className="mx-auto mb-1 text-[#16A34A]" />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POST_AMENITIES.map((a) => {
                const key = a.key as keyof IRoomAmenities;
                const active = form.amenities[key];
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() =>
                      update({
                        amenities: { ...form.amenities, [key]: !active },
                      })
                    }
                    className={cn(
                      'rounded-xl p-3 text-sm border-2 text-left transition-default',
                      active
                        ? 'border-[#16A34A] bg-[#F0FDF4] dark:bg-[#0F2E1E]/40 text-[#16A34A]'
                        : 'border-gray-200 dark:border-[#1F2E1F] bg-white dark:bg-[#111A11]'
                    )}
                  >
                    <LucideByName name={a.icon} size={16} className="inline mr-1.5" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <PostRoomPhotoStep
            images={photoItems}
            setImages={setPhotoItems}
            error={errors.images}
          />
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1F2E1F]">
              {form.images[0] && (
                <div className="relative h-48">
                  <Image src={form.images[0]} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-display text-xl">{form.title || 'Untitled'}</h3>
                <p className="text-[#16A34A] font-semibold">{form.rent ? formatRent(Number(form.rent)) : '—'}/mo</p>
                <p className="text-gray-500 text-sm mt-2">{form.area} · {form.address}</p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{form.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-1 text-[#16A34A] text-sm"
            >
              <Pencil size={14} />
              Edit Basic Info
            </button>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => update({ terms: e.target.checked })}
              />
              <span className="text-sm text-gray-500">
                I confirm all information is accurate
              </span>
            </label>
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
            <p className="text-gray-400 text-sm">
              Your listing will be reviewed and published within 24 hours.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 border border-gray-300 dark:border-[#1F2E1F] rounded-xl py-3.5 font-medium text-[#0F2E1E] dark:text-white"
          >
            ← Back
          </button>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={next}
          disabled={submitting}
          className="flex-1 bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold hover:bg-[#D4AF37] hover:text-[#0F2E1E] disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader size="sm" className="!w-5 !h-5 border-2 border-white border-t-transparent" />
              Submitting...
            </>
          ) : step === 4 ? (
            'Submit for Review'
          ) : (
            'Next →'
          )}
        </motion.button>
      </div>

    </div>
  );
}
