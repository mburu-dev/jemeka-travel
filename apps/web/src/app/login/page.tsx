import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login | Jemeka Tours",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Login() {
  return <LoginClient />;
}
