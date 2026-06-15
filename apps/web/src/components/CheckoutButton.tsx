"use client";

import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@jemeka/ui/components/ui/button";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  packageId: number;
  travelDate: string;
  adults: number;
  children: number;
  totalPrice: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequests?: string;
}

export function CheckoutButton(props: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const createBooking = trpc.booking.create.useMutation({
    onError: (err) => {
      toast.error(err.message || "Failed to create booking");
      setLoading(false);
    }
  });

  const config = {
    reference: bookingRef,
    email: props.customerEmail,
    amount: Math.round(parseFloat(props.totalPrice) * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
    currency: "USD",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    toast.success("Payment successful! Your booking is confirmed.");
    router.push("/dashboard");
  };

  const onClose = () => {
    toast.info("Payment window closed. You can complete the payment from your dashboard.");
    router.push("/dashboard");
  };

  // When config.reference is updated, React re-renders and the hook gets the new config.
  // We can trigger initializePayment in a useEffect, or just require 2 clicks.
  // A better approach using the hook is to generate reference client-side or use raw script.
  // We'll use the raw script injection approach for seamless 1-click checkout.

  const handleCheckout = async () => {
    if (!props.customerName || !props.customerEmail || !props.travelDate) {
      toast.error("Please fill in all required details before checking out.");
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Create booking in DB
      const booking = await createBooking.mutateAsync(props);
      const reference = booking[0].bookingReference;
      setBookingRef(reference);

      // 2. Load Paystack Script dynamically for seamless 1-click execution
      const loadScript = () => new Promise((resolve) => {
        if ((window as any).PaystackPop) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.onload = () => resolve(true);
        document.body.appendChild(script);
      });

      await loadScript();

      // 3. Open Paystack Modal
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
        email: props.customerEmail,
        amount: Math.round(parseFloat(props.totalPrice) * 100),
        currency: "USD",
        ref: reference,
        callback: function(response: any) {
          onSuccess(response);
        },
        onClose: function() {
          onClose();
        }
      });
      handler.openIframe();
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading || createBooking.isPending}
      className="w-full font-bold"
      size="lg"
      type="button"
      aria-busy={loading || createBooking.isPending}
      aria-label={loading ? "Processing your booking payment" : `Pay $${props.totalPrice} to book`}
    >
      {loading ? "Processing..." : `Pay $${props.totalPrice} to Book`}
    </Button>
  );
}
