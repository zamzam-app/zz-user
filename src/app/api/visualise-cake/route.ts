import { NextRequest, NextResponse } from 'next/server';

const GEMINI_MODEL = 'gemini-3.1-flash-image-preview';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        message: 'Coming Soon',
        placeholderImage: PLACEHOLDER_IMAGE,
      },
      { status: 200 }
    );
  }

  try {
    const body = await req.json();
    const {
      name,
      shape,
      flavor,
      decorations,
      cakeText,
      extraRequests,
      baseImageUrl,
    } = body;

    const prompt = `
      You are an expert cake designer for ZamZam.
      Generate a photorealistic, stunning image of a custom cake with these details:
      - Cake name / text on cake: ${cakeText || name || 'Keep original'}
      - Shape: ${shape || 'Keep original'}
      - Flavor: ${flavor || 'Keep original'}
      - Decorations: ${decorations || 'None'}
      - Extra requests: ${extraRequests || 'None'}
      Preserve all ZamZam branding elements. Only change what the customer requested.
      Make it look professional and appetizing.
    `.trim();

    // Build the parts array — text always goes last
    const parts: object[] = [];

    // If base image provided, fetch it and include as inlineData
    if (baseImageUrl) {
      const imageRes = await fetch(baseImageUrl);
      if (!imageRes.ok) throw new Error('Failed to fetch base image');
      const buffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = imageRes.headers.get('content-type') || 'image/jpeg';

      parts.push({
        inlineData: { mimeType, data: base64 },
      });
    }

    parts.push({ text: prompt });

    // Call Gemini directly — authentication via x-goog-api-key header
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.json();
      console.error('[visualise-cake] Gemini error:', errData);
      throw new Error(errData?.error?.message || 'Gemini API error');
    }

    const geminiData = await geminiRes.json();
    const responseParts = geminiData?.candidates?.[0]?.content?.parts ?? [];

    type Part = {
      inlineData?: { data: string; mimeType: string };
      text?: string;
    };
    const imagePart = responseParts.find((p: Part) => p.inlineData) as
      | Part
      | undefined;
    const textPart = responseParts.find((p: Part) => p.text) as
      | Part
      | undefined;

    if (imagePart?.inlineData) {
      return NextResponse.json({
        success: true,
        imageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
        message: textPart?.text || '',
      });
    }

    // Fallback: no image returned
    return NextResponse.json({
      success: true,
      imageBase64: null,
      message: textPart?.text || 'No image generated',
    });
  } catch (error: unknown) {
    console.error('[visualise-cake] Error:', error);
    const msg =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
