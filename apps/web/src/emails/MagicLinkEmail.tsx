import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MagicLinkEmailProps {
  url: string;
}

export const MagicLinkEmail = ({ url }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Log in to your Jemeka Tours account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
           <Text style={logoText}>JEMEKA TOURS</Text>
        </Section>
        <Heading style={heading}>Your Magic Link</Heading>
        <Text style={paragraph}>
          Click the button below to log in securely to your Jemeka Tours account. 
          This link will expire in 24 hours.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            Log in to Jemeka
          </Button>
        </Section>
        <Text style={paragraph}>
          If you didn't request this email, you can safely ignore it.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Jemeka Tours & Travel — East Africa's Most Trusted Tour Operator.
          <br />
          Tanzania | Kenya | Uganda | Zanzibar
        </Text>
      </Container>
    </Body>
  </Html>
);

export default MagicLinkEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logoSection = {
  padding: "32px",
  textAlign: "center" as const,
  backgroundColor: "#0F4C75",
};

const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "2px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 32px 0",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
  padding: "0 32px",
};

const buttonContainer = {
  padding: "27px 32px",
};

const button = {
  backgroundColor: "#F4A261",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 0",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const footer = {
  fontSize: "12px",
  lineHeight: "1.6",
  color: "#8898aa",
  padding: "0 32px",
};
