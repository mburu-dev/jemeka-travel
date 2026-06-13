"use client";

import { useState } from "react";
import { Button } from "@jemeka/ui/components/ui/button";
import { Input } from "@jemeka/ui/components/ui/input";
import { Textarea } from "@jemeka/ui/components/ui/textarea";
import { trpcServer } from "@/lib/trpc";

interface RequestQuoteFormProps {
  destinationName: string;
}

export function RequestQuoteForm({ destinationName }: RequestQuoteFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      destinationInterest: destinationName,
      subject: `Quote Request for ${destinationName}`,
    };

    try {
      await trpcServer.enquiry.create.mutate(data);
      setStatus("success");
    } catch (error) {
      console.error("Submission failed", error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or contact us via WhatsApp.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 p-4 rounded-lg text-green-800 text-center border border-green-100">
        <h4 className="font-bold mb-2">Request Received!</h4>
        <p className="text-sm">Our travel experts will contact you shortly to plan your dream trip to {destinationName}.</p>
        <Button 
          variant="outline" 
          className="mt-4 w-full border-green-200 hover:bg-green-100 text-green-700"
          onClick={() => setStatus("idle")}
        >
          Send Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
          {errorMessage}
        </div>
      )}
      <div>
        <Input name="name" placeholder="Your Name" required className="w-full bg-white" />
      </div>
      <div>
        <Input name="email" type="email" placeholder="Email Address" required className="w-full bg-white" />
      </div>
      <div>
        <Input name="phone" type="tel" placeholder="Phone Number (Optional)" className="w-full bg-white" />
      </div>
      <div>
        <Textarea 
          name="message"
          placeholder={`Tell us about your ideal trip to ${destinationName}... (e.g. travel dates, group size, special interests)`} 
          rows={4}
          required
          className="w-full resize-none bg-white"
        />
      </div>
      <Button type="submit" disabled={status === "submitting"} className="w-full bg-[#0F4C75] hover:bg-[#1B262C] text-white font-medium shadow-md transition-all">
        {status === "submitting" ? "Sending Request..." : "Request a Quote"}
      </Button>
    </form>
  );
}
