import connectToDatabase from "@/library/mongoDb";
import Invoice from "@/models/invoicesaveModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const deletedInvoice = await Invoice.findOneAndDelete({
      _id: id,
      userId: session.user.id, // 🔐 user-scoped
    });

    if (!deletedInvoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Invoice delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
