import connectToDatabase from "@/library/mongoDb";
import Company from "@/models/companyModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function POST(request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      companyName,
      gstin,
      panno,
      address,
      state,
      stateCode,   // ✅ FIXED
      phone,
      email,
      invoicePrefix,
    } = body;

    // ✅ BASIC REQUIRED CHECK
    if (
      !companyName ||
      !gstin ||
      !panno ||
      !address ||
      !state ||
      !stateCode ||
      !phone ||
      !email
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // ✅ STATE CODE VALIDATION (STRING)
    if (!/^\d{1,2}$/.test(stateCode)) {
      return NextResponse.json(
        { message: "Please enter valid state code" },
        { status: 400 }
      );
    }

    // ✅ CHECK EXISTING COMPANY
    const existingCompany = await Company.findOne({
      userId: session.user.id,
    });

    if (existingCompany) {
      return NextResponse.json(
        { message: "Company details already exist" },
        { status: 409 }
      );
    }

    // ✅ CREATE COMPANY
    const company = await Company.create({
      userId: session.user.id,
      companyName,
      gstin,
      panno,
      address,
      state,
      stateCode: String(stateCode), // ✅ ALWAYS STRING
      phone,
      email,
      invoicePrefix,
    });

    return NextResponse.json(
      { message: "Company created successfully", company },
      { status: 201 }
    );
  } catch (error) {
    console.error("COMPANY CREATE ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
