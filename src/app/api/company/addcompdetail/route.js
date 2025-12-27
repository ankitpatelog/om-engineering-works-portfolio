import connectToDatabase from "@/library/mongoDb";
import Company from "@/models/companyModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth"; // IMPORTANT

export async function POST(request) {
  try {
    await connectToDatabase();

    // ✅ GET SESSION
    const session = await getServerSession(authOptions);

    if (!session) {
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
      statecode,
      phone,
      email,
      invoicePrefix,
    } = body;

    if (
      !companyName ||
      !gstin ||
      !panno ||
      !address ||
      !state ||
      !statecode ||
      !phone ||
      !email
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
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
      statecode,
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
