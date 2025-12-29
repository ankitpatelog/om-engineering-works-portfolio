import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
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

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, userId: session.user.id }, // 🔐 user-scoped
      {
        invoiceDate: body.invoiceDate || new Date(),

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
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    console.error("Invoice update error:", error);
    return NextResponse.json(
      { message: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
