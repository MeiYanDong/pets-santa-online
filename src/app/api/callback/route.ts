import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { generationTask } from "@/db/schema";
import { eq } from "drizzle-orm";
import { refundCredits } from "@/services/credit-service";
import { put } from "@vercel/blob";

/**
 * Callback endpoint for tu-zi API to notify task completion
 * POST /api/callback
 *
 * This is a public route - tu-zi API will call this when a task completes
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task_id, status, data, error } = body;

    if (!task_id) {
      return NextResponse.json({ error: "Missing task_id" }, { status: 400 });
    }

    // Find task by tu-zi task ID
    const tasks = await db
      .select()
      .from(generationTask)
      .where(eq(generationTask.tuziTaskId, task_id))
      .limit(1);

    if (tasks.length === 0) {
      console.error("Callback for unknown task:", task_id);
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = tasks[0];

    // Skip if task is already completed or refunded
    if (task.status === "completed" || task.status === "refunded") {
      return NextResponse.json({ received: true, message: "Task already processed" });
    }

    if (status === "completed" && data && data.length > 0) {
      const imageData = data[0];
      let generatedImageUrl: string;

      try {
        if (imageData.url) {
          // Download from tu-zi URL and re-upload to our blob storage
          const imageResponse = await fetch(imageData.url);
          const imageBuffer = await imageResponse.arrayBuffer();

          const blob = await put(
            `pets-santa/generated/${task.id}.png`,
            Buffer.from(imageBuffer),
            {
              access: "public",
              contentType: "image/png",
            }
          );
          generatedImageUrl = blob.url;
        } else if (imageData.b64_json) {
          // Upload base64 to blob storage
          const imageBuffer = Buffer.from(imageData.b64_json, "base64");
          const blob = await put(
            `pets-santa/generated/${task.id}.png`,
            imageBuffer,
            {
              access: "public",
              contentType: "image/png",
            }
          );
          generatedImageUrl = blob.url;
        } else {
          throw new Error("No image data in callback");
        }

        // Update task as completed
        await db
          .update(generationTask)
          .set({
            status: "completed",
            generatedImageUrl,
            completedAt: new Date(),
          })
          .where(eq(generationTask.id, task.id));

        return NextResponse.json({ received: true, status: "completed" });
      } catch (uploadError) {
        console.error("Failed to upload image from callback:", uploadError);

        // Refund credits on upload failure
        await refundCredits(task.userId, task.id, task.creditsCharged);

        await db
          .update(generationTask)
          .set({
            status: "refunded",
            creditsRefunded: task.creditsCharged,
            errorMessage: "Failed to save generated image",
          })
          .where(eq(generationTask.id, task.id));

        return NextResponse.json({ received: true, status: "refunded" });
      }
    } else if (status === "failed") {
      // Refund credits
      await refundCredits(task.userId, task.id, task.creditsCharged);

      // Update task
      await db
        .update(generationTask)
        .set({
          status: "refunded",
          creditsRefunded: task.creditsCharged,
          errorMessage: error?.message || "Generation failed",
        })
        .where(eq(generationTask.id, task.id));

      return NextResponse.json({ received: true, status: "refunded" });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
