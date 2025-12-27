import connectToDatabase from "@/library/mongoDb";
import Company from "@/models/companyModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    //  If not logged in
    if (!session) {
      return NextResponse.json({ hasCompany: false });
    }

    const company = await Company.findOne({
      userId: session.user.id,
    });

    

    return NextResponse.json({
      hasCompany: !!company,
    });
  } catch (error) {
    console.error("CHECK COMPANY ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
