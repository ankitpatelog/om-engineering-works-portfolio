import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Product from "@/models/productModel";

export async function PUT(request, context) {
  try {
    // 1️⃣ Connect DB
    await connectToDatabase();

    // 2️⃣ Next.js 16: params are ASYNC → must await
    const params = await context.params;
    const id = params.id;

    // 3️⃣ Parse body
    const body = await request.json();

    // 4️⃣ Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
        hsnCode: body.hsnCode,
        rate: body.rate,
        gstPercent: body.gstPercent,
        unit: body.unit,
      },
      { new: true, runValidators: true }
    );

    // 5️⃣ If not found
    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Success
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}
