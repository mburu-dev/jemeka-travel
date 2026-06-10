"use client";

import Link from 'next/link';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { trpc } from "@/providers/trpc";
import { Layout } from "@jemeka/ui/components/Layout";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@jemeka/ui/components/ui/card";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@jemeka/ui/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jemeka/ui/components/ui/table";
import {
  Mail,
  CalendarCheck,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Shield,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Admin() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "admin";

  const { data: bookings, isLoading: bookingsLoading } =
    (trpc as any).booking.list.useQuery(undefined, { enabled: !!isAdmin });
  const { data: enquiries, isLoading: enquiriesLoading } =
    (trpc as any).enquiry.list.useQuery(undefined, { enabled: !!isAdmin });

  const utils = (trpc as any).useUtils();

  const updateBookingStatus = (trpc as any).booking.updateStatus.useMutation({
    onSuccess: () => {
      utils.booking.list.invalidate();
      toast.success("Booking status updated");
    },
  });

  const updateEnquiryStatus = (trpc as any).enquiry.updateStatus.useMutation({
    onSuccess: () => {
      utils.enquiry.list.invalidate();
      toast.success("Enquiry status updated");
    },
  });

  if (status === "loading") {
    return null;
  }

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

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

  // Stats
  const totalBookings = bookings?.length || 0;
  const totalEnquiries = enquiries?.length || 0;
  const pendingBookings =
    bookings?.filter((b: any) => b.status === "pending").length || 0;
  const totalRevenue = bookings
    ?.filter((b: any) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum: number, b: any) => sum + Number(b.totalPrice), 0);

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: CalendarCheck,
      color: "bg-[#0F4C75]",
    },
    {
      title: "Total Enquiries",
      value: totalEnquiries,
      icon: Mail,
      color: "bg-[#2A9D8F]",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      color: "bg-[#F4A261]",
    },
    {
      title: "Revenue",
      value: `$${(totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-600",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      new: "bg-red-100 text-red-800",
      read: "bg-yellow-100 text-yellow-800",
      responded: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-[#0F4C75] pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-heading)'  }}
              >
                Admin Dashboard
              </h1>
              <p className="text-white/70 mt-1">
                Welcome back, {session?.user?.name || "Admin"}
              </p>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0F4C75]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-[#264653] mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="bookings" className="gap-2">
                <CalendarCheck className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="enquiries" className="gap-2">
                <Mail className="w-4 h-4" />
                Enquiries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle
                    className="text-xl"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    All Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded" />
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Package</TableHead>
                            <TableHead>Travel Date</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking: any) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-mono text-sm">
                                {booking.bookingReference}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {booking.customerName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.customerEmail}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/packages/${booking.packageId}`}
                                  className="text-[#0F4C75] hover:underline"
                                >
                                  View
                                </Link>
                              </TableCell>
                              <TableCell>
                                {booking.travelDate
                                  ? new Date(
                                      booking.travelDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {booking.adults} adults
                                {booking.children
                                  ? `, ${booking.children} children`
                                  : ""}
                              </TableCell>
                              <TableCell className="font-medium">
                                ${Number(booking.totalPrice).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getStatusBadge(booking.status || "pending")}
                                >
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {booking.status === "pending" && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          updateBookingStatus.mutate({
                                            id: booking.id,
                                            status: "confirmed",
                                            paymentStatus: "partial",
                                          })
                                        }
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          updateBookingStatus.mutate({
                                            id: booking.id,
                                            status: "cancelled",
                                          })
                                        }
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                  {booking.status === "confirmed" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        updateBookingStatus.mutate({
                                          id: booking.id,
                                          status: "completed",
                                          paymentStatus: "paid",
                                        })
                                      }
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enquiries">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle
                    className="text-xl"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    All Enquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {enquiriesLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded" />
                      ))}
                    </div>
                  ) : enquiries && enquiries.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enquiries.map((enquiry: any) => (
                            <TableRow key={enquiry.id}>
                              <TableCell className="font-medium">
                                {enquiry.name}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">{enquiry.email}</div>
                                {enquiry.phone && (
                                  <div className="text-sm text-gray-500">
                                    {enquiry.phone}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{enquiry.subject || "N/A"}</TableCell>
                              <TableCell>
                                {enquiry.destinationInterest ? (
                                  <span className="flex items-center gap-1 text-sm">
                                    <MapPin className="w-3 h-3" />
                                    {enquiry.destinationInterest}
                                  </span>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600 max-w-[200px] truncate block">
                                  {enquiry.message}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                {enquiry.createdAt
                                  ? new Date(
                                      enquiry.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getStatusBadge(enquiry.status || "new")}
                                >
                                  {enquiry.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {enquiry.status === "new" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        updateEnquiryStatus.mutate({
                                          id: enquiry.id,
                                          status: "read",
                                        })
                                      }
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {enquiry.status === "read" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        updateEnquiryStatus.mutate({
                                          id: enquiry.id,
                                          status: "responded",
                                        })
                                      }
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {(enquiry.status === "new" ||
                                    enquiry.status === "read") && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        updateEnquiryStatus.mutate({
                                          id: enquiry.id,
                                          status: "closed",
                                        })
                                      }
                                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No enquiries yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
