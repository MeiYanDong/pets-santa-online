import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/get-session";
import { db } from "@/db";
import { generationTask } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkCredits, deductCredits, refundCredits } from "@/services/credit-service";
import { generateImageDirect } from "@/services/tuzi-service";
import { put } from "@vercel/blob";

const GENERATION_COST = 20;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { originalImageUrl, prompt, styleId, styleLabel } = await req.json();

    if (!originalImageUrl || !prompt || !styleId || !styleLabel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check credits
    const hasCredits = await checkCredits(userId, GENERATION_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits", code: "INSUFFICIENT_CREDITS" },
        { status: 402 }
      );
    }

    // Create task record
    const taskId = crypto.randomUUID();

    // Pre-deduct credits
    const deductResult = await deductCredits(userId, taskId, GENERATION_COST);
    if (!deductResult.success) {
      return NextResponse.json(
        { error: deductResult.error },
        { status: 402 }
      );
    }

    // Save task to database as processing
    await db.insert(generationTask).values({
      id: taskId,
      userId,
      status: "processing",
      originalImageUrl,
      prompt,
      styleId,
      styleLabel,
      creditsCharged: GENERATION_COST,
    });

    // Call tu-zi API (this will block until the image is generated)
    try {
      const result = await generateImageDirect(originalImageUrl, prompt);

      if (!result) {
        // Refund credits if generation failed
        await refundCredits(userId, taskId, GENERATION_COST);
        await db
          .update(generationTask)
          .set({
            status: "refunded",
            creditsRefunded: GENERATION_COST,
            errorMessage: "No image generated",
          })
          .where(eq(generationTask.id, taskId));

        return NextResponse.json(
          { error: "Failed to generate image" },
          { status: 500 }
        );
      }

      // Download and upload to Vercel Blob
      let generatedImageUrl: string;

      if (result.url) {
        // Download from tu-zi URL and re-upload to our blob storage
        const imageResponse = await fetch(result.url);
        const imageBuffer = await imageResponse.arrayBuffer();

        const blob = await put(
          `pets-santa/generated/${taskId}.png`,
          Buffer.from(imageBuffer),
          {
            access: "public",
            contentType: "image/png",
          }
        );
        generatedImageUrl = blob.url;
      } else if (result.b64_json) {
        // Upload base64 to blob storage
        const imageBuffer = Buffer.from(result.b64_json, "base64");
        const blob = await put(
          `pets-santa/generated/${taskId}.png`,
          imageBuffer,
          {
            access: "public",
            contentType: "image/png",
          }
        );
        generatedImageUrl = blob.url;
      } else {
        throw new Error("No image data in response");
      }

      // Update task as completed
      await db
        .update(generationTask)
        .set({
          status: "completed",
          generatedImageUrl,
          completedAt: new Date(),
        })
        .where(eq(generationTask.id, taskId));

      return NextResponse.json({
        taskId,
        status: "completed",
        generatedImageUrl,
        message: "Image generated successfully",
      });
    } catch (error: unknown) {
      // Refund credits if tu-zi API fails
      await refundCredits(userId, taskId, GENERATION_COST);

      const errorMessage = error instanceof Error ? error.message : "Generation failed";

      await db
        .update(generationTask)
        .set({
          status: "refunded",
          creditsRefunded: GENERATION_COST,
          errorMessage,
        })
        .where(eq(generationTask.id, taskId));

      return NextResponse.json(
        { error: "Failed to generate image", details: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
