import { Resend } from "resend";
import { env } from "./env";
import { logger } from "./logger";

// Initialize Resend with the API key from env
// If not available, we'll log a warning and skip sending
const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

interface BookingConfirmationProps {
  customerName: string;
  customerEmail: string;
  bookingReference: string;
  travelDate: string;
  packageTitle: string;
  totalPrice: string;
}

export async function sendBookingConfirmation(props: BookingConfirmationProps) {
  if (!resend) {
    logger.warn("Resend API key not configured. Skipping email send.");
    return;
  }

  const { customerName, customerEmail, bookingReference, travelDate, packageTitle, totalPrice } = props;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px;border:1px solid #e6ebf1;border-radius:5px;max-width:600px;">
          <h1 style="color:#0F4C75;font-size:24px;font-weight:600;line-height:40px;padding:0 48px;">Booking Received!</h1>
          <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:left;padding:0 48px;">Hi ${customerName},</p>
          <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:left;padding:0 48px;">
            Thank you for choosing Jemeka Tours. We have received your booking request for the <strong>${packageTitle}</strong>.
          </p>
          <div style="padding:24px 48px;background-color:#f8f9fa;margin:24px 48px;border-radius:8px;">
            <p style="color:#525f7f;font-size:16px;line-height:24px;margin:8px 0;"><strong>Booking Reference:</strong> ${bookingReference}</p>
            <p style="color:#525f7f;font-size:16px;line-height:24px;margin:8px 0;"><strong>Travel Date:</strong> ${new Date(travelDate).toLocaleDateString()}</p>
            <p style="color:#525f7f;font-size:16px;line-height:24px;margin:8px 0;"><strong>Total Price:</strong> $${totalPrice}</p>
          </div>
          <hr style="border-color:#e6ebf1;margin:20px 0;">
          <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:left;padding:0 48px;">
            Our team is reviewing your request and will contact you shortly to confirm your itinerary and process your deposit.
          </p>
          <p style="color:#8898aa;font-size:14px;line-height:24px;padding:0 48px;">
            Best regards,<br>
            The Jemeka Tours Team
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "Jemeka Tours <bookings@jemekatoursandtravel.com>", // Make sure to use your verified Resend domain
      to: customerEmail,
      subject: `Your Booking Request Received - ${bookingReference}`,
      html: html,
    });
    logger.info({ bookingReference, customerEmail }, "Booking confirmation email sent successfully");
  } catch (error) {
    logger.error({ error, bookingReference, customerEmail }, "Failed to send booking confirmation email");
  }
}

interface BookingStatusUpdateProps {
  customerName: string;
  customerEmail: string;
  bookingReference: string;
  travelDate: string;
  packageTitle: string;
  totalPrice: string;
  newStatus: "confirmed" | "cancelled" | "completed";
}

const STATUS_CONFIG = {
  confirmed: {
    subject: "Your Booking is Confirmed! 🎉",
    heading: "Booking Confirmed!",
    color: "#16a34a",
    message: "Great news! Your booking has been confirmed by the Jemeka Tours team. We look forward to making your safari unforgettable.",
    cta: "Please keep your booking reference safe. Our team will be in touch soon with detailed itinerary information.",
  },
  cancelled: {
    subject: "Your Booking Has Been Cancelled",
    heading: "Booking Cancelled",
    color: "#dc2626",
    message: "We're sorry to inform you that your booking has been cancelled. If you believe this is a mistake or would like to rebook, please don't hesitate to contact us.",
    cta: "We apologise for any inconvenience. Please reach out to us at info@jemekatoursandtravel.com or call +254 726 912577 for assistance.",
  },
  completed: {
    subject: "Thank You for Traveling with Jemeka Tours! 🌍",
    heading: "Trip Completed!",
    color: "#0F4C75",
    message: "We hope you had an incredible experience! Your booking has been marked as completed. Thank you for choosing Jemeka Tours.",
    cta: "We'd love to hear about your experience. Please consider leaving us a review — it helps other travellers and supports our small team.",
  },
};

export async function sendBookingStatusUpdate(props: BookingStatusUpdateProps) {
  if (!resend) {
    logger.warn("Resend API key not configured. Skipping status update email.");
    return;
  }

  const { customerName, customerEmail, bookingReference, travelDate, packageTitle, totalPrice, newStatus } = props;
  const config = STATUS_CONFIG[newStatus];

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px;border:1px solid #e6ebf1;border-radius:5px;max-width:600px;">
          <div style="background-color:${config.color};padding:24px 48px;border-radius:5px 5px 0 0;">
            <h1 style="color:#ffffff;font-size:24px;font-weight:600;line-height:40px;margin:0;">${config.heading}</h1>
          </div>
          <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:left;padding:24px 48px 0;">Hi ${customerName},</p>
          <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:left;padding:0 48px;">${config.message}</p>
          <div style="padding:24px 48px;background-color:#f8f9fa;margin:24px 48px;border-radius:8px;">
            <p style="color:#525f7f;font-size:16px;line-height:24px;margin:8px 0;"><strong>Booking Reference:</strong> ${bookingReference}</p>
            <p style="color:#525f7f;font-size:16px;line-height:24px;margin:8px 0;"><strong>Package:</strong> ${packageTitle}</p>
            <p style="color:#525f7f;font-size:16px;line-height:24px;margin:8px 0;"><strong>Travel Date:</strong> ${new Date(travelDate).toLocaleDateString("en-KE", { dateStyle: "long" })}</p>
            <p style="color:#525f7f;font-size:16px;line-height:24px;margin:8px 0;"><strong>Total Price:</strong> $${totalPrice}</p>
          </div>
          <hr style="border-color:#e6ebf1;margin:20px 0;">
          <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:left;padding:0 48px;">${config.cta}</p>
          <p style="color:#8898aa;font-size:14px;line-height:24px;padding:0 48px;">
            Best regards,<br>The Jemeka Tours Team<br>
            <a href="mailto:info@jemekatoursandtravel.com" style="color:#0F4C75;">info@jemekatoursandtravel.com</a> | +254 726 912577
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "Jemeka Tours <bookings@jemekatoursandtravel.com>",
      to: customerEmail,
      subject: `${config.subject} - ${bookingReference}`,
      html,
    });
    logger.info({ bookingReference, customerEmail, newStatus }, "Booking status update email sent");
  } catch (error) {
    logger.error({ error, bookingReference, customerEmail, newStatus }, "Failed to send booking status update email");
  }
}

