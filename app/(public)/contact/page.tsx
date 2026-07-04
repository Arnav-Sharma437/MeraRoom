'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, Phone, MapPin, Clock, Lightbulb } from 'lucide-react';
import { CONTACTS, CONTACT_SUBJECTS, CITY } from '@/constants';
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations';
import { FormField, FormSelect, FormTextarea } from '@/components/ui/FormField';
import Loader from '@/components/ui/Loader';
import ContactFaq from '@/components/contact/ContactFaq';

interface ContactFormData {
  name: string;
  phone: string;
  subject: string;
  message?: string;
}

function ContactCard({
  name,
  role,
  phone,
  href,
  initial,
}: {
  name: string;
  role: string;
  phone: string;
  href: string;
  initial: string;
}) {
  const tel = phone.replace(/\s/g, '');

  return (
    <div className="bg-[#F9F6EF] dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 shrink-0 bg-[#0F2E1E] rounded-full flex items-center justify-center">
          <span className="font-display text-2xl text-[#D4AF37]">{initial}</span>
        </div>
        <div>
          <p className="font-semibold text-[#0F2E1E] dark:text-white">{name}</p>
          <p className="text-[#16A34A] text-sm">{role}</p>
          <p className="text-gray-500 text-sm">{phone}</p>
        </div>
      </div>
      <div className="flex gap-2 sm:flex-col sm:gap-2 shrink-0">
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.96 }}
          className="flex-1 sm:flex-none text-center bg-[#25D366] text-white rounded-lg px-3 py-1.5 text-sm font-semibold"
        >
          <MessageCircle size={14} className="inline mr-1" />
          WhatsApp
        </motion.a>
        <motion.a
          href={`tel:${tel}`}
          whileTap={{ scale: 0.96 }}
          className="flex-1 sm:flex-none text-center border border-[#0F2E1E] dark:border-white/20 text-[#0F2E1E] dark:text-white rounded-lg px-3 py-1.5 text-sm font-medium inline-flex items-center justify-center gap-1"
        >
          <Phone size={14} />
          Call
        </motion.a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: { subject: CONTACT_SUBJECTS[0].value },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setServerError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(
          json.error ?? 'Something went wrong. Please WhatsApp us directly.'
        );
        return;
      }

      setSuccess(true);
      reset();
    } catch {
      setServerError('Something went wrong. Please WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-[#0F2E1E] py-16 px-6 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center justify-center gap-2 text-[#D4AF37] text-sm mb-4">
            <Phone size={16} />
            We&apos;re here to help
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-white">Get in Touch</h1>
          <p className="text-white/60 mt-4 text-lg">
            Have a question? Want to list your property? We&apos;re just a WhatsApp
            message away.
          </p>
        </motion.div>
      </section>

      <section className="bg-white dark:bg-[#0A0F0A] py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="font-display text-2xl text-[#0F2E1E] dark:text-white">
                Reach Us Directly
              </h2>

              <ContactCard
                name="Arnav Sharma"
                role="Founder"
                phone={CONTACTS[0].phone}
                href={CONTACTS[0].href}
                initial="A"
              />
              <ContactCard
                name="Varun Choudhary"
                role="Founder"
                phone={CONTACTS[1].phone}
                href={CONTACTS[1].href}
                initial="V"
              />

              <div className="bg-[#0F2E1E] rounded-2xl p-5 space-y-3 text-sm">
                <p className="text-white/70 flex items-center gap-2">
                  <MapPin size={14} className="text-[#D4AF37] shrink-0" />
                  {CITY.name}, {CITY.state}
                </p>
                <p className="text-white/70 flex items-center gap-2">
                  <Clock size={14} className="text-[#D4AF37] shrink-0" />
                  Mon - Sat: 9AM to 7PM
                </p>
                <p className="text-[#D4AF37] flex items-center gap-2">
                  <MessageCircle size={14} className="shrink-0" />
                  Fastest reply: WhatsApp
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="font-display text-2xl text-[#0F2E1E] dark:text-white mb-4">
                Send a Message
              </h2>
              <p className="text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 mb-6">
                <span className="inline-flex items-center gap-1.5">
                  <Lightbulb size={14} />
                  For fastest response, use WhatsApp above
                </span>
              </p>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <CheckCircle className="text-[#16A34A] w-16 h-16 mb-4" />
                  <p className="font-semibold text-[#0F2E1E] dark:text-white text-lg">
                    Message sent! We&apos;ll reply soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <FormField
                    label="Your Name"
                    placeholder="Rahul Sharma"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                    error={errors.name?.message}
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter valid Indian mobile number',
                      },
                    })}
                    error={errors.phone?.message}
                  />
                  <FormSelect
                    label="What's this about?"
                    options={CONTACT_SUBJECTS.map((s) => ({
                      value: s.value,
                      label: s.label,
                    }))}
                    {...register('subject', { required: true })}
                    error={errors.subject?.message}
                  />
                  <FormTextarea
                    label="Message"
                    rows={4}
                    placeholder="Tell us more..."
                    {...register('message')}
                  />

                  {serverError && (
                    <p className="text-red-500 text-sm mb-4">{serverError}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileTap={{ scale: 0.96 }}
                    className="w-full bg-[#16A34A] text-white rounded-xl py-3.5 font-semibold hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-default disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {submitting ? (
                      <>
                        <Loader size="sm" className="!w-5 !h-5 border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ContactFaq />
    </div>
  );
}
