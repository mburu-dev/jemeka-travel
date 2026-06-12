import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Jemeka Tours & Travel",
  description:
    "Read the terms and conditions governing your use of Jemeka Tours & Travel services and website.",
};

export default function TermsOfServicePage() {
  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1
        className="text-4xl font-bold text-[#0F4C75] mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Terms of Service
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
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Jemeka Tours &amp; Travel website (<strong>jemekatours.com</strong>)
            or making a booking with us, you agree to be bound by these Terms of Service and our{" "}
            <Link href="/privacy-policy" className="text-[#2A9D8F] underline">
              Privacy Policy
            </Link>
            . If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">2. Booking &amp; Reservations</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              A booking is confirmed only when you receive a written confirmation email containing your
              unique booking reference number.
            </li>
            <li>
              You must be at least 18 years old to make a booking. Minors may travel only with a consenting
              adult guardian included in the booking.
            </li>
            <li>
              Prices quoted are per person unless stated otherwise and are subject to change until a deposit
              is paid and a confirmation is issued.
            </li>
            <li>
              It is your responsibility to ensure all traveller names and details provided at booking match
              your valid travel documents.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">3. Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              A non-refundable deposit of 30% of the total tour price is required to secure your booking.
            </li>
            <li>The remaining balance is due no later than 30 days before the travel start date.</li>
            <li>
              Bookings made within 30 days of departure require full payment at the time of booking.
            </li>
            <li>
              Payments are processed securely via Paystack. Jemeka Tours does not store your card details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">4. Cancellations &amp; Refunds</h2>
          <p>Cancellation charges apply based on the notice period before the departure date:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>More than 60 days:</strong> Loss of deposit only.
            </li>
            <li>
              <strong>31–60 days:</strong> 50% of the total tour price.
            </li>
            <li>
              <strong>15–30 days:</strong> 75% of the total tour price.
            </li>
            <li>
              <strong>14 days or less:</strong> 100% of the total tour price (no refund).
            </li>
          </ul>
          <p className="mt-3">
            All cancellation requests must be submitted in writing to{" "}
            <a href="mailto:njoros2025@gmail.com" className="text-[#2A9D8F] underline">
              njoros2025@gmail.com
            </a>
            . The cancellation date is the date we receive your written notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">5. Changes to Bookings</h2>
          <p>
            Amendment requests (date changes, traveller substitutions) must be made in writing and are
            subject to availability and an administration fee of KES 2,500 per amendment. Changes within 14
            days of departure may be treated as cancellations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">
            6. Travel Documents &amp; Insurance
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              It is your sole responsibility to obtain a valid passport, visas, vaccinations, and any other
              entry requirements for your destinations. Jemeka Tours provides general guidance only.
            </li>
            <li>
              Comprehensive travel insurance covering medical emergencies, trip cancellation, and baggage
              loss is <strong>strongly recommended</strong> and may be required for certain packages.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">7. Our Responsibilities</h2>
          <p>
            Jemeka Tours acts as an agent for third-party service providers (hotels, airlines, ground
            operators). We take reasonable care in selecting reputable partners but are not liable for acts
            or omissions of these independent suppliers, force majeure events (natural disasters, political
            unrest, pandemics), or any injury, loss, or damage arising from activities inherently risky in
            nature (wildlife safaris, adventure sports).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">8. Itinerary Changes</h2>
          <p>
            We reserve the right to modify itineraries due to weather, safety concerns, or circumstances
            beyond our control. Where a significant change is made before departure, we will offer you an
            equivalent alternative or a full refund of amounts paid to us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">9. Website Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You may not use our website for any unlawful purpose or in a way that could damage, disable, or
              impair the site.
            </li>
            <li>
              All content on this site (text, images, logos) is the intellectual property of Jemeka Tours
              &amp; Travel and may not be reproduced without written permission.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Republic of Kenya. Any disputes shall be subject to
            the exclusive jurisdiction of the courts of Nairobi, Kenya.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#264653] mb-3">11. Contact</h2>
          <p>
            Questions about these Terms should be directed to{" "}
            <a href="mailto:njoros2025@gmail.com" className="text-[#2A9D8F] underline">
              njoros2025@gmail.com
            </a>{" "}
            or <strong>+254 726 912577</strong>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6 text-sm text-[#2A9D8F]">
        <Link href="/privacy-policy" className="underline hover:text-[#0F4C75]">
          Privacy Policy
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
