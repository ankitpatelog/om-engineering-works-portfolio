import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function GET() {
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

    // 3️⃣ Get latest invoice of logged-in user
    const lastInvoice = await Invoice.findOne(
      { userId: session.user.id },
      { invoiceNumber: 1 } // only fetch invoiceNumber
    )
      .sort({ createdAt: -1 })
      .lean();

    // 4️⃣ If no invoice exists
    if (!lastInvoice) {
      return NextResponse.json(
        { lastInvoiceNumber: null },
        { status: 200 }
      );
    }

    // 5️⃣ Success
    return NextResponse.json(
      { lastInvoiceNumber: lastInvoice.invoiceNumber },
      { status: 200 }
    );

  } catch (error) {
    console.error("Fetch last invoice error:", error);

    return NextResponse.json(
      { message: "Failed to fetch last invoice number" },
      { status: 500 }
    );
  }
}
