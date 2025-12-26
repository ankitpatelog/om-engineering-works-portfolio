"use client";

import emailjs from "@emailjs/browser";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";


const SERVICE_ID = "service_97l1ayb";
const TEMPLATE_ID = "template_1lo5u4j";
const PUBLIC_KEY = "vAYCF1f-JSyfMcFhD";

// const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
// const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
// const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function ContactUsSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function sendmsg(e) {
    e.preventDefault();

    const sendPromise = emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        time: new Date().toLocaleString(),
        reply_to: form.email,
        from_name: form.name,
      },
      PUBLIC_KEY
    );

    toast.promise(sendPromise, {
      loading: "Sending message...",
      success: "Message sent successfully ✅",
      error: "Failed to send message ❌",
    });

    sendPromise
      .then(() => {
        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("EMAILJS ERROR:", error);
        toast.error("Failed to send message ❌");
      });
  }

  return (
    <>
      <Toaster position="top-right" />

      <section id="contactus" className="w-full">
        <div className="mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-gray-900">
              Contact Us
            </h2>
            <div className="mt-2 h-1 w-16 bg-amber-500"></div>
          </div>

          {/* Form */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 md:p-6">
            <form onSubmit={sendmsg} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full rounded-md border px-3 py-2 text-xs"
                />

                <input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-md border px-3 py-2 text-xs"
                />

                <input
                  type="text"
                  placeholder="Contact number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-xs"
                />
              </div>

              <textarea
                rows="3"
                placeholder="Write your message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full rounded-md border px-3 py-2 text-xs"
              />

              <button
                type="submit"
                className="rounded-md bg-amber-500 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
