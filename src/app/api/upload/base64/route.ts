import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { base64, type } = await request.json();

    if (!base64) {
      return NextResponse.json(
        { error: 'No base64 data provided' },
        { status: 400 }
      );
    }

    // Extract the actual base64 data (remove data:image/xxx;base64, prefix)
    const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json(
        { error: 'Invalid base64 image format' },
        { status: 400 }
      );
    }

    const extension = matches[1];
    const data = matches[2];

    // Convert base64 to Buffer
    const buffer = Buffer.from(data, 'base64');

    // Validate file size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Max 10MB.' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const prefix = type === 'generated' ? 'generated' : 'original';
    const filename = `pets-santa/${prefix}/${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: `image/${extension}`,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
