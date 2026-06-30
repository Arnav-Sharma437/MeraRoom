import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACTS } from '@/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | MeraRoom',
  description: 'How MeraRoom collects, uses, and protects your personal information.',
};

const LAST_UPDATED = 'May 21, 2026';
const arnav = CONTACTS.find((c) => c.name === 'Arnav') ?? CONTACTS[0];

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
        <section>
          <p>
            MeraRoom (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates a room-listing platform
            that connects property owners with people looking for accommodation in Dharamshala
            and nearby areas. This Privacy Policy explains what information we collect, how we
            use it, and your rights regarding your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Information We Collect
          </h2>
          <p className="mb-3">When you use MeraRoom, we may collect the following information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-[#0F2E1E] dark:text-white">Account details:</strong> your
              name and phone number when you register or log in.
            </li>
            <li>
              <strong className="text-[#0F2E1E] dark:text-white">Listing information:</strong> room
              details, photos, rent, location, amenities, and contact preferences submitted by
              property owners.
            </li>
            <li>
              <strong className="text-[#0F2E1E] dark:text-white">Usage data:</strong> basic
              information about how you interact with our website, such as pages visited and
              searches performed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            How We Use Your Information
          </h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Display room listings and help seekers find suitable accommodation.</li>
            <li>Enable direct contact between room seekers and property owners via WhatsApp.</li>
            <li>Review and moderate listings before they appear on the platform.</li>
            <li>Improve our services and user experience.</li>
            <li>Communicate important updates about your account or listings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            WhatsApp Communication
          </h2>
          <p>
            MeraRoom uses WhatsApp links to facilitate direct contact between users. When you
            click a WhatsApp button, you are redirected to WhatsApp to message the property
            owner or our team directly. We do not store, read, or monitor your WhatsApp
            conversations. All communication via WhatsApp is between you and the other party
            and is subject to WhatsApp&apos;s own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Data Sharing
          </h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. We may
            share limited information only when required by law or to protect the rights and
            safety of MeraRoom, our users, or others.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Cookies
          </h2>
          <p>
            We use basic cookies and similar technologies to keep you logged in, remember your
            preferences, and ensure the site functions properly. These cookies are essential for
            the operation of MeraRoom and are not used for advertising purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Your Rights
          </h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and associated data.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, please contact us via WhatsApp (see Contact
            below). We will respond to your request within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Data Security
          </h2>
          <p>
            We take reasonable measures to protect your information from unauthorized access,
            alteration, or disclosure. However, no method of transmission over the internet is
            completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated &quot;Last updated&quot; date. Continued use of MeraRoom after changes
            constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or wish to request deletion of your
            data, please contact:
          </p>
          <p className="mt-3">
            <strong className="text-[#0F2E1E] dark:text-white">{arnav.name}</strong>
            <br />
            WhatsApp:{' '}
            <Link
              href={arnav.href}
              className="text-[#16A34A] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {arnav.phone}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
