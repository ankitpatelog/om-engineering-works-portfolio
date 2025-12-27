import connectToDatabase from "@/library/mongoDb";
import Company from "@/models/companyModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function GET(request) {
  try {
    await connectToDatabase();

    // 1️⃣ Get session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Fetch company using logged-in user id
    const data = await Company.findOne({
      userId: session.user.id,
    });

    // 3️⃣ If company not found
    if (!data) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Success response
    return NextResponse.json(
      { data },
      { status: 200 }
    );

  } catch (error) {
    console.error("Data fetching company error", error);

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
