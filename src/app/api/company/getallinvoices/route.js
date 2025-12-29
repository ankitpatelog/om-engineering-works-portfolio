import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoiceModel";

export async function GET() {
  try {
    // 1️⃣ Connect DB
    await connectToDatabase();

    // 2️⃣ Fetch all invoices (latest first)
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    //   Sort order explained
    //   1  → Ascending (old → new)
    //  -1  → Descending (new → old)

    // 3️⃣ Success response
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Get invoices error:", error);

    return NextResponse.json(
      { message: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
