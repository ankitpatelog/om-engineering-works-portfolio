"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar2() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const userName = "Ankit";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LEFT – BRAND */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-600 font-extrabold">
            OM
          </div>
          <span className="text-lg font-semibold tracking-wide text-gray-900">
            OM <span className="text-amber-600">Engineering</span> Works
          </span>
        </div>

        {/* CENTER – USER INFO (NO LOGOUT HERE) */}
        <div className="hidden md:flex items-center">
          <span className="text-sm font-medium text-gray-700">
            Welcome, <span className="font-semibold text-gray-900">{userName}</span>
          </span>
        </div>

        {/* RIGHT – ACTION BUTTONS + PROFILE */}
        <div className="hidden md:flex items-center gap-4">

          {/* SWAPPED ORDER */}
          <button
            onClick={() => router.push("/manage-details")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800
            hover:border-amber-500 hover:text-amber-600 transition-all"
          >
            Manage Details
          </button>

          <button
            onClick={() => router.push("/generate-bill")}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white
            shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all"
          >
            Generate Bill
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="h-9 w-9 rounded-full border border-gray-300 flex items-center justify-center
              font-semibold text-gray-700 hover:border-amber-500"
            >
              {userName[0]}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-md border bg-white shadow-md">
                <button
                  onClick={() => router.push("/logout")}
                  className="w-full px-4 py-2 text-left text-sm font-semibold text-red-500
                  hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* HAMBURGER – MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5"
        >
          <span className="h-0.5 w-6 bg-gray-800"></span>
          <span className="h-0.5 w-6 bg-gray-800"></span>
          <span className="h-0.5 w-6 bg-gray-800"></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-700">

            <p>
              Welcome, <span className="font-semibold text-gray-900">{userName}</span>
            </p>

            {/* SWAPPED ORDER */}
            <button
              onClick={() => router.push("/manage-details")}
              className="rounded-md border border-gray-300 px-4 py-2 font-semibold
              hover:border-amber-500 hover:text-amber-600 transition-all"
            >
              Manage Details
            </button>

            <button
              onClick={() => router.push("/generate-bill")}
              className="rounded-md bg-amber-500 px-4 py-2 text-white font-semibold
              hover:bg-amber-400 transition-all"
            >
              Generate Bill
            </button>

            <button
              onClick={() => router.push("/logout")}
              className="text-left text-red-500 font-semibold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
