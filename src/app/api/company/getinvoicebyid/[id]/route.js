import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoiceModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function GET(request, context) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ get id from params
    const { id } = context.params;

    const invoice = await Invoice.findOne({
      _id: id,
      userId: session.user.id, // 🔐 ownership check
    }).lean();

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice, { status: 200 });

  } catch (error) {
    console.error("Fetch invoice error:", error);

    return NextResponse.json(
      { message: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
