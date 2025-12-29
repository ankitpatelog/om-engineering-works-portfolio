import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/library/auth";

export async function POST(request) {
  try {
    // 1️⃣ Connect DB
    await connectToDatabase();

    // 2️⃣ Auth check
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ Parse body
    const body = await request.json();

    // 4️⃣ Basic validations
    if (!body.invoiceNumber) {
      return NextResponse.json(
        { message: "Invoice number is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { message: "Invoice items are required" },
        { status: 400 }
      );
    }

    // 5️⃣ Create invoice (SNAPSHOT SAVE)
    const invoice = await Invoice.create({
      userId: session.user.id,

      invoiceNumber: body.invoiceNumber,
      invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),

      company: body.company,
      billedTo: body.billedTo,
      shippedTo: body.shippedTo,

      items: body.items,

      transport: body.transport || {},
      totals: body.totals,
      amountInWords: body.amountInWords,

      status: "FINAL",
    });

    // 6️⃣ Success
    return NextResponse.json(invoice, { status: 201 });

  } catch (error) {
    console.error("Invoice create error:", error);

    // 🔁 Duplicate invoice number
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Invoice number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
