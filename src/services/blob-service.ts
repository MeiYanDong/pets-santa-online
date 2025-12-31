/**
 * Upload a File to Vercel Blob storage
 */
export async function uploadFile(
  file: File,
  type: 'original' | 'generated' = 'original'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload file');
  }

  const data = await response.json();
  return data.url;
}

/**
 * Upload a base64 encoded image to Vercel Blob storage
 */
export async function uploadBase64Image(
  base64: string,
  type: 'original' | 'generated' = 'generated'
): Promise<string> {
  const response = await fetch('/api/upload/base64', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ base64, type }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const data = await response.json();
  return data.url;
}
