import connectToDatabase from "@/library/mongoDb";
import Product from "@/models/productModel";
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
      description,
      hsnCode,
      rate,
      unit,
      gstPercent,
    } = body;

    // ❗ REQUIRED FIELD CHECK
    if (
      !name ||
      !description ||
      !hsnCode ||
      rate === undefined ||
      gstPercent === undefined
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // 🚫 DUPLICATE PRODUCT (same name + user)
    const existingProduct = await Product.findOne({
      userId: session.user.id,
      name,
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: "Product already exists" },
        { status: 409 }
      );
    }

    // ✅ CREATE PRODUCT
    const product = await Product.create({
      userId: session.user.id,
      name,
      description,
      hsnCode,
      rate,
      unit,
      gstPercent,
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
