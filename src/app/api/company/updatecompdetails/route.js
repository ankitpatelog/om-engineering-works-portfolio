import connectToDatabase from "@/library/mongoDb";
import Company from "@/models/companyModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/library/auth";

export async function PUT(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updatedCompany = await Company.findOneAndUpdate(
      { userId: session.user.id },   // filter
      { $set: body },                // update
      { new: true }                  // return updated doc
    );

    if (!updatedCompany) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCompany, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}
