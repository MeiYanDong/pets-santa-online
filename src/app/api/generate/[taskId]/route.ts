import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/get-session";
import { db } from "@/db";
import { generationTask } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const userId = session.user.id;

    // Get task from database
    const tasks = await db
      .select()
      .from(generationTask)
      .where(
        and(
          eq(generationTask.id, taskId),
          eq(generationTask.userId, userId)
        )
      )
      .limit(1);

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = tasks[0];

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      generatedImageUrl: task.generatedImageUrl,
      originalImageUrl: task.originalImageUrl,
      styleLabel: task.styleLabel,
      errorMessage: task.errorMessage,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
    });
  } catch (error) {
    console.error("Task status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
