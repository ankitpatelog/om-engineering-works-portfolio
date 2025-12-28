import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Customer from "@/models/customerModel";

export async function GET() {
  try {
    // 1️⃣ Connect DB
    await connectToDatabase();

    // 2️⃣ Fetch all customers (latest first)
    const customers = await Customer.find().sort({ createdAt: -1 });

    //   Sort order explained
    //   1  → Ascending (old → new)
    //  -1  → Descending (new → old)

    // 3️⃣ Success response
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Get customers error:", error);

    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
