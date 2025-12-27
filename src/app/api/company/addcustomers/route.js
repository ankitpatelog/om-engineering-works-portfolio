import connectToDatabase from "@/library/mongoDb";
import Customer from "@/models/customerModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function POST(request) {
  try {
    // 🔌 DB CONNECT
    await connectToDatabase();

    // 🔐 SESSION CHECK
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📥 BODY
    const body = await request.json();

    const {
      name,
      phone,
      gstin,
      pan,
      address,
      state,
      stateCode,
      shippedTo,
    } = body;

    // ❗ REQUIRED FIELD CHECK
    if (!name || !phone || !address || !state || !stateCode) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // 🚫 DUPLICATE CUSTOMER (optional but recommended)
    const existingCustomer = await Customer.findOne({
      userId: session.user.id,
      phone,
    });

    if (existingCustomer) {
      return NextResponse.json(
        { message: "Customer already exists" },
        { status: 409 }
      );
    }

    // ✅ CREATE CUSTOMER
    const customer = await Customer.create({
      userId: session.user.id,
      name,
      phone,
      gstin,
      pan,
      address,
      state,
      stateCode,
      shippedTo,
    });

    return NextResponse.json(
      { message: "Customer created successfully", customer },
      { status: 201 }
    );
  } catch (error) {
    console.error("CUSTOMER CREATE ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
