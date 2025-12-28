import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Customer from "@/models/customerModel";

export async function PUT(request, context) {
  try {
    // 1️⃣ Connect DB
    await connectToDatabase();

    // 2️⃣ Next.js params (async in App Router)
    const { id } = await context.params;

    // 3️⃣ Parse request body
    const body = await request.json();

    // 4️⃣ Update customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        name: body.name,
        phone: body.phone,
        gstin: body.gstin,
        pan: body.pan,
        address: body.address,
      },
      { new: true, runValidators: true }
    );

    // 5️⃣ If not found
    if (!updatedCustomer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Success
    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json(
      { message: "Failed to update customer" },
      { status: 500 }
    );
  }
}
