import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { render } from "@react-email/render";
import nodemailer from "nodemailer";

type Props = {
  magicLink: string;
};

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export function MagicLinkEmail({ magicLink = "https://withbeacon.co" }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Sign in with this magic link.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://withbeacon.co/logo.svg"
            width={48}
            height={48}
            alt="Beacon"
          />
          <Heading style={heading}>🪄 Your magic link is here</Heading>
          <Section style={body}>
            <Text style={paragraph}>
              <Link style={link} href={magicLink}>
                🚀 Click here to sign in
              </Link>
            </Text>
            <Text style={paragraph}>
              If you didn't request this, please ignore this email.
            </Text>
          </Section>
          <Text style={paragraph}>
            Thanks,
            <br />☀ Vedant
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export async function sendMagicLinkEmail({
  email,
  from,
  magicLink,
  server,
}: {
  from?: string;
  email: string;
  magicLink: string;
  server: SMTPTransport.Options | string;
}) {
  const html = render(<MagicLinkEmail magicLink={magicLink} />);
  const transporter = nodemailer.createTransport(server);

  await transporter.sendMail({
    from,
    to: email,
    subject: "🪄 Sign in with this magic link",
    html,
  });
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#4178E1",
};
