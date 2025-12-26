"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-white shadow-lg p-6">
        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your details below to create your account
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
              focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="m@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
              focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10
                focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-amber-500 py-2 text-sm font-medium text-black
            hover:bg-amber-600 transition"
          >
            Create account
          </button>

          {/* Google Signup */}
          <button
            type="button"
            className="w-full rounded-md border border-gray-300 py-2 text-sm
            hover:bg-gray-50 transition"
          >
            Sign up with Google
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-amber-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
