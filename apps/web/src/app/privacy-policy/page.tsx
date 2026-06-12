import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Jemeka Tours & Travel",
  description:
    "Learn how Jemeka Tours & Travel collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1
        className="text-4xl font-bold text-[#0F4C75] mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">1. Who We Are</h2>
          <p>
            Jemeka Tours &amp; Travel (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is a
            travel agency registered in Nairobi, Kenya (P.O. Box 46376-00100). We operate the website at{" "}
            <strong>jemekatours.com</strong> and related services. You may contact our data controller at{" "}
            <a href="mailto:njoros2025@gmail.com" className="text-[#2A9D8F] underline">
              njoros2025@gmail.com
            </a>{" "}
            or <strong>+254 726 912577</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account data:</strong> name, email address, and password (hashed) when you create an
              account or sign in with Google.
            </li>
            <li>
              <strong>Booking data:</strong> package selection, travel dates, number of travellers, special
              requests, and payment reference numbers.
            </li>
            <li>
              <strong>Enquiry data:</strong> name, email, phone number, and message content submitted via our
              contact or enquiry forms.
            </li>
            <li>
              <strong>Usage data:</strong> pages visited, browser type, IP address, referring URL, and session
              duration, collected via server logs and analytics tools.
            </li>
            <li>
              <strong>Cookies:</strong> authentication session cookies and optional analytics cookies. See our{" "}
              <Link href="/cookie-policy" className="text-[#2A9D8F] underline">
                Cookie Policy
              </Link>{" "}
              for details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and manage your tour bookings and send confirmation emails.</li>
            <li>To respond to enquiries and provide customer support.</li>
            <li>To operate, maintain, and improve our website and services.</li>
            <li>To send transactional communications (booking confirmations, itinerary updates).</li>
            <li>
              To send promotional communications — only where you have given explicit consent, which you may
              withdraw at any time.
            </li>
            <li>To comply with legal obligations and resolve disputes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">4. Legal Basis for Processing</h2>
          <p>We process your personal data on the following grounds:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Contract performance:</strong> processing necessary to complete your booking.
            </li>
            <li>
              <strong>Legitimate interests:</strong> operating and securing our platform.
            </li>
            <li>
              <strong>Consent:</strong> marketing communications and optional analytics cookies.
            </li>
            <li>
              <strong>Legal obligation:</strong> tax records and fraud prevention.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">5. Data Sharing</h2>
          <p>We do not sell your personal data. We share it only with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Payment processors</strong> (Paystack) to handle secure transactions.
            </li>
            <li>
              <strong>Email providers</strong> (Resend) to deliver transactional emails.
            </li>
            <li>
              <strong>Authentication providers</strong> (Google OAuth via Auth.js) if you choose Google sign-in.
            </li>
            <li>
              <strong>Cloud hosting infrastructure</strong> for server and database operations.
            </li>
            <li>
              <strong>Legal authorities</strong> when required by law or to protect our rights.
            </li>
          </ul>
          <p className="mt-3">All third-party processors are bound by data processing agreements.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">6. Data Retention</h2>
          <p>
            Booking and financial records are retained for 7 years in accordance with Kenyan tax legislation.
            Account data is retained for as long as your account remains active and for 2 years after closure.
            Marketing consent records are retained for 3 years. You may request deletion at any time (subject
            to legal retention requirements).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access a copy of the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data (subject to legal retention requirements).</li>
            <li>Object to or restrict processing in certain circumstances.</li>
            <li>Data portability — receive your data in a structured, machine-readable format.</li>
            <li>Withdraw consent for marketing at any time.</li>
          </ul>
          <p className="mt-3">
            To exercise any right, email{" "}
            <a href="mailto:njoros2025@gmail.com" className="text-[#2A9D8F] underline">
              njoros2025@gmail.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">8. Security</h2>
          <p>
            We implement industry-standard security measures including HTTPS/TLS encryption, hashed
            passwords, HTTP security headers, and rate limiting. However, no transmission over the internet is
            100% secure and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Material changes will be communicated via email or a
            prominent notice on our website. The &ldquo;Last updated&rdquo; date at the top of this page
            reflects the most recent revision.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">10. Contact</h2>
          <p>
            Questions or complaints about this policy should be directed to{" "}
            <a href="mailto:njoros2025@gmail.com" className="text-[#2A9D8F] underline">
              njoros2025@gmail.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6 text-sm text-[#2A9D8F]">
        <Link href="/terms-of-service" className="underline hover:text-[#0F4C75]">
          Terms of Service
        </Link>
        <Link href="/cookie-policy" className="underline hover:text-[#0F4C75]">
          Cookie Policy
        </Link>
        <Link href="/" className="underline hover:text-[#0F4C75]">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
