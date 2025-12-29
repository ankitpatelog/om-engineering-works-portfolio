import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function GET() {
  try {
    // 1️⃣ Connect DB
    await connectToDatabase();

    // 2️⃣ Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ Fetch invoices of this user only
    const invoices = await Invoice.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    // 4️⃣ Success response
    return NextResponse.json(invoices, { status: 200 });

  } catch (error) {
    console.error("Fetch invoices error:", error);

    return NextResponse.json(
      { message: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
