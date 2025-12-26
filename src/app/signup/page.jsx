"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupCard() {
  useEffect(() => {
    toast.success("Signup to access Generate Bill");
  }, []);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ YOUR LOGIC: password match check
  function handleCheckPassword() {
    if (form.password !== form.confirmPassword) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // frontend password check
    if (!handleCheckPassword()) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (err) {
      //  THIS PART HANDLES BACKEND ValidationError
      //   BASICALLY AXIOS RETURN THIS WHEN SOME ERROR OCCURED IN THIS FORM
      //   IN THE OBJECT FORM

      //       err.response = {
      //   data: { ... },    // error message or response body
      //   status: 400,      // status code
      //   headers: { ... }  // response headers

      //   AND ERROR CONTAINS THIS
      // 'error = {
      //   message: "Request failed with status code 400",
      //   response: {
      //     data: {
      //       error: "Invalid email or password"
      //     },
      //     status: 400,
      //     headers: {...}
      //   },
      //   request: {...}
      // }

      // }

      if (err.response) {
        const { status, data } = err.response;

        if (status === 400 && data?.error) {
          // ValidationError message from backend
          toast.error(data.error);
        } else if (data?.message) {
          toast.error(data.message);
        } else {
          toast.error("Signup failed");
        }
      } else {
        toast.error("Server not responding");
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-sm rounded-xl border bg-white shadow-lg p-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Create an account
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Name */}
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-md border px-3 py-2 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full rounded-md border px-3 py-2 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* 🔴 Inline password error (your requirement) */}
            {error && (
              <p id="password-error" className="text-xs text-red-500">
                Passwords do not match
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-md bg-amber-500 py-2 text-sm font-medium text-black"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-amber-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
