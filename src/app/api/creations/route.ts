import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/get-session";
import { db } from "@/db";
import { generationTask } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const tasks = await db
      .select()
      .from(generationTask)
      .where(eq(generationTask.userId, userId))
      .orderBy(desc(generationTask.createdAt))
      .limit(100);

    // Map to frontend format
    const creations = tasks.map((task) => ({
      id: task.id,
      originalImage: task.originalImageUrl,
      generatedImage: task.generatedImageUrl,
      style: task.styleLabel,
      styleId: task.styleId,
      status: task.status,
      date: task.createdAt.toLocaleDateString(),
      createdAt: task.createdAt.toISOString(),
      errorMessage: task.errorMessage,
    }));

    return NextResponse.json({ creations });
  } catch (error) {
    console.error("Creations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch creations" },
      { status: 500 }
    );
  }
}
