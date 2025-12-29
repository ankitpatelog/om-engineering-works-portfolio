import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/library/auth";

export async function POST(request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

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

    if (!body.totals?.grandTotal) {
      return NextResponse.json(
        { message: "Invoice totals are required" },
        { status: 400 }
      );
    }

    const invoice = await Invoice.create({
      userId: session.user.id,

      invoiceNumber: body.invoiceNumber,
      invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),

      company: body.company,
      billedTo: body.billedTo,
      shippedTo: body.shippedTo,

      items: body.items,

      transport: {
        mode: body.transport?.mode || "By Road",
        vehicleNo: body.transport?.vehicleNo || "",
        noOfPackages: Number(body.transport?.noOfPackages) || 0,
        approxWeight: Number(body.transport?.approxWeight) || 0,
      },

      totals: body.totals,
      amountInWords: body.amountInWords,

      status: "FINAL",
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice create error:", error);
    return NextResponse.json(
      { message: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
