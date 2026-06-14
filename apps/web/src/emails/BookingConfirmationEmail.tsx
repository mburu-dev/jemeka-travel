import * as React from "react";
import { Html, Head, Body, Container, Text, Heading, Section, Hr, Img } from "@react-email/components";

interface BookingConfirmationProps {
  customerName: string;
  bookingReference: string;
  travelDate: string;
  packageTitle: string;
  totalPrice: string;
}

export default function BookingConfirmationEmail({
  customerName = "Valued Customer",
  bookingReference = "JMK-TEST1234",
  travelDate = new Date().toISOString(),
  packageTitle = "Amazing Safari",
  totalPrice = "1500.00",
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Received!</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for choosing Jemeka Tours. We have received your booking request for the <strong>{packageTitle}</strong>.
          </Text>
          <Section style={detailsSection}>
            <Text style={detailText}><strong>Booking Reference:</strong> {bookingReference}</Text>
            <Text style={detailText}><strong>Travel Date:</strong> {new Date(travelDate).toLocaleDateString()}</Text>
            <Text style={detailText}><strong>Total Price:</strong> ${totalPrice}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={text}>
            Our team is reviewing your request and will contact you shortly to confirm your itinerary and process your deposit.
          </Text>
          <Text style={footer}>
            Best regards,<br />
            The Jemeka Tours Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #e6ebf1",
  borderRadius: "5px",
};

const h1 = {
  color: "#0F4C75",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  padding: "0 48px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  padding: "0 48px",
};

const detailsSection = {
  padding: "24px 48px",
  backgroundColor: "#f8f9fa",
  margin: "24px 48px",
  borderRadius: "8px",
};

const detailText = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 48px",
};
