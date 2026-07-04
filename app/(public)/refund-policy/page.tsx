import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACTS } from '@/constants';

export const metadata: Metadata = {
  title: 'Refund Policy | MeraRoom',
  description: 'Refund policy for MeraRoom paid services and featured listings.',
};

const LAST_UPDATED = 'May 21, 2026';
const arnav = CONTACTS.find((c) => c.name === 'Arnav Sharma') ?? CONTACTS[0];

export default function RefundPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white">
        Refund Policy
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
        <section>
          <p>
            This Refund Policy explains how refunds are handled for services offered on
            MeraRoom. Please read it carefully before purchasing any paid feature.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Free Services
          </h2>
          <p>
            Searching for rooms, browsing listings, saving favourites, and contacting property
            owners via WhatsApp are completely free on MeraRoom. No payment is required for
            these features, and therefore no refund is applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Featured Listing Payments
          </h2>
          <p>
            Featured Listing is a paid promotional service that gives your room listing
            increased visibility on MeraRoom. Once a Featured Listing is activated and your
            listing is promoted, the payment is <strong className="text-[#0F2E1E] dark:text-white">non-refundable</strong>.
          </p>
          <p className="mt-3">
            We do not offer partial refunds for unused days or early cancellation of a featured
            period once the service has been activated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Verified Badge Payments
          </h2>
          <p>
            Verified badge fees, where applicable, follow the same non-refundable policy once
            the verification process has been initiated and the badge has been applied to your
            listing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Listings Removed for Policy Violations
          </h2>
          <p>
            If your listing is removed by our admin team due to a violation of our Terms &amp;
            Conditions — including false information, inappropriate content, or misuse of the
            platform — <strong className="text-[#0F2E1E] dark:text-white">no refund will be issued</strong> for
            any paid services associated with that listing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Payment Disputes
          </h2>
          <p>
            If you believe a payment was made in error or you have a genuine dispute regarding
            a paid service, please contact us directly. We will review your case on an
            individual basis.
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

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Changes to This Policy
          </h2>
          <p>
            We may update this Refund Policy from time to time. Any changes will be posted on
            this page with an updated &quot;Last updated&quot; date.
          </p>
        </section>
      </div>
    </main>
  );
}
