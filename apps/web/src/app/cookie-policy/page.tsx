import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Jemeka Tours & Travel",
  description:
    "Understand how Jemeka Tours & Travel uses cookies and how you can manage your cookie preferences.",
};

export default function CookiePolicyPage() {
  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1
        className="text-4xl font-bold text-[#0F4C75] mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Cookie Policy
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-KE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They are widely used
            to make websites work correctly, improve performance, and provide information to the site owner.
            Cookies cannot execute programs or deliver viruses; they simply store a small amount of data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">2. Cookies We Use</h2>

          <h3 className="text-lg font-semibold text-[#264653] mt-4 mb-2">
            2.1 Strictly Necessary Cookies
          </h3>
          <p>
            These cookies are essential for the website to function and cannot be switched off. They are set
            in response to actions you take, such as logging in or filling in a booking form.
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Cookie Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Purpose</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    <code>authjs.session-token</code>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    Maintains your authenticated session so you stay logged in.
                  </td>
                  <td className="border border-gray-200 px-4 py-2">Session / 30 days</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    <code>authjs.csrf-token</code>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    Prevents cross-site request forgery attacks during authentication.
                  </td>
                  <td className="border border-gray-200 px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    <code>authjs.callback-url</code>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    Remembers the page to return to after sign-in.
                  </td>
                  <td className="border border-gray-200 px-4 py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-[#264653] mt-6 mb-2">
            2.2 Functional Cookies
          </h3>
          <p>
            These cookies enable enhanced functionality and personalisation. They may be set by us or by
            third-party providers whose services we use.
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Cookie Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Purpose</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    <code>__stripe_mid</code>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    Used by Paystack for fraud prevention during payment processing.
                  </td>
                  <td className="border border-gray-200 px-4 py-2">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-[#264653] mt-6 mb-2">
            2.3 Analytics Cookies (Optional)
          </h3>
          <p>
            We may use analytics cookies to understand how visitors interact with our website so we can
            improve it. These are only set with your explicit consent.
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Cookie Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Purpose</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    <code>_ga</code>, <code>_ga_*</code>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    Google Analytics — counts and distinguishes unique visitors and sessions.
                  </td>
                  <td className="border border-gray-200 px-4 py-2">2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">3. Third-Party Cookies</h2>
          <p>
            When you sign in with Google, Google may set cookies in accordance with their own{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2A9D8F] underline"
            >
              Privacy Policy
            </a>
            . We do not control third-party cookies and recommend reviewing the relevant privacy policies
            directly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">4. Managing Your Cookies</h2>
          <p>
            You can control and manage cookies through your browser settings. Note that disabling strictly
            necessary cookies will prevent you from logging in or completing bookings.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A9D8F] underline"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A9D8F] underline"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A9D8F] underline"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A9D8F] underline"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">5. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy as our services change or regulations require. The &ldquo;Last
            updated&rdquo; date at the top of this page indicates when the policy was last revised. Continued
            use of the website after any update constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">6. Contact</h2>
          <p>
            Questions about our use of cookies should be sent to{" "}
            <a href="mailto:njoros2025@gmail.com" className="text-[#2A9D8F] underline">
              njoros2025@gmail.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6 text-sm text-[#2A9D8F]">
        <Link href="/privacy-policy" className="underline hover:text-[#0F4C75]">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" className="underline hover:text-[#0F4C75]">
          Terms of Service
        </Link>
        <Link href="/" className="underline hover:text-[#0F4C75]">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
