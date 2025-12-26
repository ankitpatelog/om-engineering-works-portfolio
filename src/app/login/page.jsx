"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-white shadow-lg p-6">

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900">
          Login to your account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email below to login to your account
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4">

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="m@example.com"
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

          {/* Google Login */}
          <button
            type="button"
            className="w-full rounded-md border border-gray-300 py-2 text-sm
            hover:bg-gray-50 transition"
          >
            Login with Google
          </button>
        </form>

        {/* Footer */}
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
