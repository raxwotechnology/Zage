import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Service from "@/models/Service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const audience = searchParams.get("audience");

    const query: Record<string, unknown> = {};
    if (audience && audience !== "all") {
      if (audience === "male" || audience === "female") {
        query.audience = audience;
      } else if (audience === "unisex" || audience === "both") {
        query.$or = [{ audience: "unisex" }, { audience: null }, { audience: "" }, { audience: { $exists: false } }];
      }
    }

    const services = await Service.find(query)
      .sort({
        displayOrder: 1,
        createdAt: 1,
      })
      .lean();

    const sortedServices = services.sort((a, b) => {
      const orderA = a.displayOrder ?? 0;
      const orderB = b.displayOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    });

    return NextResponse.json({
      success: true,
      services: sortedServices,
    });
  } catch (error) {
    console.error("Admin services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load services",
      },
      { status: 500 }
    );
  }
}