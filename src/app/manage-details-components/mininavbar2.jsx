"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubNavbar3() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="  w-full border-b border-gray-200 bg-gray-50">
      <div className="  mx-auto flex max-w-7xl items-center justify-between px-6 py-1">
        {/* LEFT – DROPDOWNS */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          {/* Customers */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("customers")}
              className="text-gray-700 hover:text-amber-600 transition"
            >
              Customers ▾
            </button>

            {openMenu === "customers" && (
              <div className="absolute left-0 mt-2 w-48 rounded-md border bg-white shadow-md">
                <button
                  onClick={() => router.push("/manage-details/add-customer")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Add Customer
                </button>
                <button
                  onClick={() => router.push("/manage-details/view-all-customers")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  View All Customers
                </button>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("products")}
              className="text-gray-700 hover:text-amber-600 transition"
            >
              Products ▾
            </button>

            {openMenu === "products" && (
              <div className="absolute left-0 mt-2 w-48 rounded-md border bg-white shadow-md">
                <button
                  onClick={() => router.push("/dashboard/add-product")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Add Product
                </button>
                <button
                  onClick={() => router.push("/dashboard/products")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT – OPTIONAL INFO */}
        <div className="text-sm text-gray-600">Billing Panel</div>
      </div>
    </div>
  );
}
