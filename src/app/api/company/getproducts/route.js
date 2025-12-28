import { NextResponse } from "next/server";
import connectToDatabase from "@/library/mongoDb";
import Product from "@/models/productModel"; // adjust name if different

export async function GET() {
  try {
    // connect DB
    await connectToDatabase();

    // fetch all products
    const products = await Product.find().sort({ createdAt: -1 });

    //   Order explained
    // Value    Meaning
    // 1	    Ascending (old → new)
    // -1	    Descending (new → old)

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
