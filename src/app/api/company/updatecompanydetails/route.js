import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Company from "@/models/companyModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function PUT(request) {
  try {
    // 1️⃣ Connect DB
    await connectToDatabase();

    // 2️⃣ Get session (SERVER SIDE)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // 3️⃣ Parse body
    const body = await request.json();

    // 4️⃣ Update company by USER ID
    const updatedCompany = await Company.findOneAndUpdate(
      { userId: session.user.id },
      {
        companyName: body.companyName,
        gstin: body.gstin,
        panno: body.panno,
        phone: body.phone,
        email: body.email,
        state: body.state,
        stateCode: body.stateCode,
        address: body.address,
      },
      { new: true, runValidators: true }
    );

    // 5️⃣ If company not found
    if (!updatedCompany) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Success
    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error("Update company error:", error);

    return NextResponse.json(
      { message: "Failed to update company details" },
      { status: 500 }
    );
  }
}
