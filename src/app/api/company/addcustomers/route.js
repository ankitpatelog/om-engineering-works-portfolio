import connectToDatabase from "@/library/mongoDb";
import Customer from "@/models/customerModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function POST(request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { stateCode, shippedTo, poDate, ...rest } = body;

    // ✅ stateCode validation (STRING)
    if (!/^\d{1,2}$/.test(stateCode)) {
      return NextResponse.json(
        { message: "Please enter valid state code" },
        { status: 400 }
      );
    }

    const hasShipping =
      shippedTo &&
      (shippedTo.name ||
        shippedTo.address ||
        shippedTo.state ||
        shippedTo.stateCode);

    const customer = await Customer.create({
      userId: session.user.id,
      ...rest,

      stateCode: String(stateCode),

      poDate: poDate ? new Date(poDate) : undefined,

      shippedTo: hasShipping
        ? {
            ...shippedTo,
            stateCode: shippedTo.stateCode
              ? String(shippedTo.stateCode)
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
