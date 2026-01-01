"use server";

const TUZI_API_BASE = "https://api.tu-zi.com";
const TUZI_API_KEY = process.env.TUZI_API_KEY || "";

export interface TuziCreateTaskResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

export interface TuziTaskStatusResponse {
  task_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  output?: {
    images: Array<{
      url?: string;
      b64_json?: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Create a new image generation task using tu-zi API
 * POST /v1/images/edits (multipart/form-data)
 *
 * Note: Based on the API docs, the response is async - returns a task_id
 * that needs to be polled for status
 */
export async function createGenerationTask(
  imageUrl: string,
  prompt: string,
  callbackUrl?: string
): Promise<{ taskId: string; status: string }> {
  if (!TUZI_API_KEY) {
    throw new Error("TUZI_API_KEY is not configured");
  }

  // Download image from Vercel Blob
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error("Failed to fetch original image");
  }
  const imageBlob = await imageResponse.blob();

  // Create FormData for multipart request
  const formData = new FormData();
  formData.append("model", "gemini-3-pro-image-preview");
  formData.append("prompt", prompt);
  formData.append("image", imageBlob, "image.png");
  formData.append("n", "1");
  formData.append("response_format", "url");

  // Add callback URL if provided
  if (callbackUrl) {
    formData.append("callback_url", callbackUrl);
  }

  const response = await fetch(`${TUZI_API_BASE}/v1/images/edits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TUZI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Tu-zi API error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  // The API returns a task_id for async processing
  // or returns the result directly if synchronous
  if (data.task_id) {
    return {
      taskId: data.task_id,
      status: data.status || "processing",
    };
  }

  // If response includes data directly, it's a synchronous response
  // Generate a local task ID for tracking
  if (data.data && data.data.length > 0) {
    return {
      taskId: `sync_${Date.now()}`,
      status: "completed",
    };
  }

  throw new Error("Invalid response from tu-zi API");
}

/**
 * Get task status from tu-zi API
 * GET /v1/tasks/{task_id}
 */
export async function getTaskStatus(
  taskId: string
): Promise<TuziTaskStatusResponse> {
  if (!TUZI_API_KEY) {
    throw new Error("TUZI_API_KEY is not configured");
  }

  // Handle synchronous task IDs (prefixed with sync_)
  if (taskId.startsWith("sync_")) {
    return {
      task_id: taskId,
      status: "completed",
    };
  }

  const response = await fetch(`${TUZI_API_BASE}/v1/tasks/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TUZI_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Tu-zi API error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Direct image generation (for cases where API returns synchronously)
 * This handles the case where the API returns the image directly
 */
export async function generateImageDirect(
  imageUrl: string,
  prompt: string
): Promise<{ url?: string; b64_json?: string } | null> {
  if (!TUZI_API_KEY) {
    throw new Error("TUZI_API_KEY is not configured");
  }

  // Download image from Vercel Blob
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error("Failed to fetch original image");
  }
  const imageBlob = await imageResponse.blob();

  // Create FormData
  const formData = new FormData();
  formData.append("model", "gemini-3-pro-image-preview");
  formData.append("prompt", prompt);
  formData.append("image", imageBlob, "image.png");
  formData.append("n", "1");
  formData.append("response_format", "url");

  const response = await fetch(`${TUZI_API_BASE}/v1/images/edits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TUZI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Tu-zi API error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }

  const data: TuziCreateTaskResponse = await response.json();

  if (data.data && data.data.length > 0) {
    return data.data[0];
  }

  return null;
}
