"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@jemeka/ui/components/ui/card";
import { Button } from "@jemeka/ui/components/ui/button";

function getOAuthUrl() {
  const kimiAuthUrl = process.env.NEXT_PUBLIC_KIMI_AUTH_URL || "https://auth.kimi.com";
  const appID = process.env.NEXT_PUBLIC_APP_ID || "jemeka-app";
  const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/api/oauth/callback` : "";
  const state = typeof window !== "undefined" ? btoa(redirectUri) : "";

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Sign in with Kimi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
