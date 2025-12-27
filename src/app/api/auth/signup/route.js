
import connectToDatabase from "@/library/mongoDb";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse request body
    const { name, email, password } = await request.json();

    // Validate all required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already registered" },
        { status: 409 } // 409 Conflict is more appropriate for duplicates
      );
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", error: error.message },
        { status: 400 }
      );
    }

    // Handle duplicate key error (if unique index on email)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
