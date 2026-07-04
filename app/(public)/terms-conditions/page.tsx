import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACTS } from '@/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions | MeraRoom',
  description: 'Terms and conditions for using the MeraRoom room-listing platform.',
};

const LAST_UPDATED = 'May 21, 2026';
const arnav = CONTACTS.find((c) => c.name === 'Arnav Sharma') ?? CONTACTS[0];

export default function TermsConditionsPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="font-display text-3xl text-[#0F2E1E] dark:text-white">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
        <section>
          <p>
            By accessing or using MeraRoom, you agree to these Terms &amp; Conditions. Please
            read them carefully before using our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Platform Nature
          </h2>
          <p>
            MeraRoom is a listing platform only. We connect property owners with people
            seeking rooms in Dharamshala and nearby areas. We do not own, manage, or operate
            any of the properties listed on our platform. We are not a real estate broker,
            landlord, or property manager.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            No Responsibility for Transactions
          </h2>
          <p>
            MeraRoom is not responsible for any transactions, agreements, disputes, or
            interactions between property owners and room seekers. All dealings — including
            rent negotiations, deposits, and move-in arrangements — happen directly between
            the parties involved, outside of our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Listing Accuracy
          </h2>
          <p>
            All listings on MeraRoom are submitted by property owners. While we review
            listings before they go live, we do not guarantee that every detail — including
            photos, rent, amenities, or availability — is accurate or up to date. Users must
            verify all property details in person before making any payment or commitment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            No Booking or Payment on Platform
          </h2>
          <p>
            MeraRoom does not process bookings, rent payments, or security deposits. There is
            no payment gateway on our platform. Any financial transaction between an owner and
            a seeker is entirely at their own risk and discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Featured &amp; Verified Badges
          </h2>
          <p>
            Featured and Verified badges are paid promotional services offered by MeraRoom.
            These badges indicate that a listing has opted for additional visibility or has
            undergone a basic verification check. They do not guarantee the quality, safety,
            or legality of any property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            User Responsibilities
          </h2>
          <p className="mb-3">When using MeraRoom, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and truthful information in your profile and listings.</li>
            <li>Not post fraudulent, misleading, or duplicate listings.</li>
            <li>Not use the platform for any unlawful purpose.</li>
            <li>Respect other users and communicate in good faith.</li>
            <li>Verify any property in person before making payments.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Listing Removal
          </h2>
          <p>
            We reserve the right to remove, suspend, or reject any listing or user account at
            our sole discretion, without prior notice, if we believe it violates these terms,
            contains false information, or is reported as problematic by other users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Account Suspension
          </h2>
          <p>
            Misuse of the platform — including spam, harassment, fake listings, or repeated
            policy violations — may result in permanent suspension or ban from MeraRoom.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, MeraRoom and its team shall not be liable
            for any direct, indirect, incidental, or consequential damages arising from your
            use of the platform or any interaction with other users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Changes to These Terms
          </h2>
          <p>
            We may update these Terms &amp; Conditions at any time. Continued use of MeraRoom
            after changes are posted constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#0F2E1E] dark:text-white mb-3">
            Contact
          </h2>
          <p>For questions about these terms, contact:</p>
          <p className="mt-3">
            <strong className="text-[#0F2E1E] dark:text-white">{arnav.name}</strong>
            <br />
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
