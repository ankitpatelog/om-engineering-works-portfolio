import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Product from "@/models/productModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function POST(req) {
  try {
    //  Get session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect DB
    await connectToDatabase();

    // 3️⃣ Get body
    const body = await req.json();
    const {
      name,
      description,
      hsnCode,
      rate,
      unit,
      gstPercent,
    } = body;

    // 4️⃣ Basic validation (extra safety)
    if (!name || !description || !hsnCode || rate == null || gstPercent == null) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // 5️⃣ Create product
    const product = await Product.create({
      userId: session.user.id,
      name,
      description,
      hsnCode,
      rate,
      unit,
      gstPercent,
    });

    // 6️⃣ Success response
    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add product error:", error);

    return NextResponse.json(
      {
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
