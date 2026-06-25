"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@jemeka/ui/components/ui/card";
import { Button } from "@jemeka/ui/components/ui/button";
import { Input } from "@jemeka/ui/components/ui/input";
import { Label } from "@jemeka/ui/components/ui/label";
import { signIn } from "next-auth/react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const result = await signIn("resend", {
        email,
        callbackUrl: "/admin",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to send magic link. Please try again.");
      } else {
        toast.success("Check your email for a magic link!");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 bg-[#0F4C75] rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#264653]">Welcome to Jemeka</CardTitle>
          <CardDescription>Sign in to your traveler account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Social Login */}
          <Button
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 transition-all"
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
          >
            <Image 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              width={16} 
              height={16} 
              className="w-4 h-4" 
            />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-[#0F4C75] hover:bg-[#0a3a5a] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 px-4">
            We'll send a secure login link to your inbox. No password required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
