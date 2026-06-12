import Link from 'next/link';
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppLayout as Layout } from "@/components/AppLayout";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  const isAdmin = session.user && (session.user as any).role === "admin";

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8">
              <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#264653] mb-2">
                Access Denied
              </h1>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page. Admin access
                required.
              </p>
              <Link href="/">
                <Button className="bg-[#0F4C75]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminClient userName={session.user?.name} />
    </Layout>
  );
}
