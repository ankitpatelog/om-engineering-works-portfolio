import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/library/auth";

/* ================= FINANCIAL YEAR HELPER ================= */
function getFinancialYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Jan = 1

  // April (4) to March (3)
  if (month >= 4) {
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
}

/* ================= GET NEXT INVOICE NUMBER ================= */
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

    // 3️⃣ Financial year
    const fy = getFinancialYear();
    const prefix = `INV/${fy}/`;

    // 4️⃣ Find last invoice FOR THIS USER + THIS FY
    const lastInvoice = await Invoice.findOne({
      userId: session.user.id,
      invoiceNumber: { $regex: `^${prefix}` },
    })
      .sort({ createdAt: -1 })
      .lean();

    // 5️⃣ Decide next serial
    let nextSerial = 1;

    if (lastInvoice?.invoiceNumber) {
      const lastNumber = parseInt(
        lastInvoice.invoiceNumber.split("/").pop(),
        10
      );
      nextSerial = lastNumber + 1;
    }

    // 6️⃣ Build invoice number
    const invoiceNumber = `${prefix}${String(nextSerial).padStart(3, "0")}`;

    // 7️⃣ Send response
    return NextResponse.json({ invoiceNumber }, { status: 200 });

  } catch (error) {
    console.error("Generate invoice number error:", error);

    return NextResponse.json(
      { message: "Failed to generate invoice number" },
      { status: 500 }
    );
  }
}
