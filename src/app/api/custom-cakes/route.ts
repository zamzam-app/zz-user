import { NextRequest, NextResponse } from 'next/server';

function generateObjectId(): string {
  return Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/** Basic URL check for imageUrl (class-validator @IsUrl() compatible). */
function isUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Optional ISO date string (YYYY-MM-DD or full ISO). */
function isDateString(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}(T.*)?Z?$/.test(value) ||
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  );
}

type CreateCustomCakeBody = {
  prompt?: string;
  imageUrl?: string;
  phone?: string;
  dob?: string;
  gender?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateCustomCakeBody;
    const { prompt, imageUrl, phone, dob, gender } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return NextResponse.json(
        { error: 'imageUrl is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (!isUrl(imageUrl.trim())) {
      return NextResponse.json(
        { error: 'imageUrl must be a valid URL' },
        { status: 400 }
      );
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json(
        { error: 'phone is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (
      dob !== undefined &&
      (typeof dob !== 'string' || !isDateString(dob.trim()))
    ) {
      return NextResponse.json(
        { error: 'dob must be a valid ISO date string' },
        { status: 400 }
      );
    }
    if (
      gender !== undefined &&
      (typeof gender !== 'string' || !['male', 'female'].includes(gender))
    ) {
      return NextResponse.json(
        { error: 'gender must be one of: male, female' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const response = {
      _id: generateObjectId(),
      userId: (body as { userId?: string }).userId ?? null,
      prompt: prompt.trim(),
      imageUrl: imageUrl.trim(),
      phone: phone.trim(),
      ...(dob?.trim() && { dob: dob.trim() }),
      ...(gender && { gender }),
      isActive: true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      __v: 0,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (e) {
    console.error('POST /api/custom-cakes:', e);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
