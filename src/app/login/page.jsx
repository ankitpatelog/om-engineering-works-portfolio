"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginCard() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Login to access Generate Bill");
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    // show loading toast manually
    const toastId = toast.loading("Logging in...");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      toast.dismiss(toastId);

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Login successful!");
      router.push("/generate-bill");

    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Server not responding...");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-sm rounded-xl border bg-white shadow-lg p-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Login to your account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email below to login to your account
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="m@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
              focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-amber-600 hover:underline"
              >
                Forgot your password?
              </a>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10
                focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-amber-500 py-2 text-sm font-medium text-black
            hover:bg-amber-600 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-amber-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
