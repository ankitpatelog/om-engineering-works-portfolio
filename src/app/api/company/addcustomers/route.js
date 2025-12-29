import connectToDatabase from "@/library/mongoDb";
import Customer from "@/models/customerModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function POST(request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { stateCode, shippedTo, poDate, ...rest } = body;

    const stateCodeNum = Number(stateCode);
    if (!Number.isInteger(stateCodeNum) || stateCodeNum < 1 || stateCodeNum > 99) {
      return NextResponse.json(
        { message: "Please enter valid state code" },
        { status: 400 }
      );
    }

    // ✅ IMPORTANT FIX: ignore empty shippedTo
    const hasShipping =
      shippedTo &&
      (shippedTo.name ||
        shippedTo.address ||
        shippedTo.state ||
        shippedTo.stateCode);

    const customer = await Customer.create({
      userId: session.user.id,
      ...rest,
      stateCode: stateCodeNum,
      poDate: poDate ? new Date(poDate) : undefined,

      shippedTo: hasShipping
        ? {
            ...shippedTo,
            stateCode: shippedTo.stateCode
              ? Number(shippedTo.stateCode)
              : undefined,
          }
        : undefined,
    });

    return NextResponse.json(
      { message: "Customer created successfully", customer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add customer error:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
