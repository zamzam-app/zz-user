import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY environment variable' },
        { status: 500 }
      );
    }

    const {
      cakeName,
      shape,
      flavor,
      decorations,
      additionalRequests,
      cakeText,
      baseImageUrl,
    } = await req.json();

    // 1. Fetch base image
    let baseImageBytes = null;
    let baseImageMimeType = '';

    if (baseImageUrl) {
      const imgRes = await fetch(baseImageUrl);
      if (imgRes.ok) {
        const arrayBuffer = await imgRes.arrayBuffer();
        baseImageBytes = Buffer.from(arrayBuffer).toString('base64');
        baseImageMimeType = imgRes.headers.get('content-type') || 'image/jpeg';
      }
    }

    // 2. Build the prompt
    let prompt = `You are an expert cake designer for "ZamZam" (also known as Nano Banana).\n`;
    prompt += `CRITICAL INSTRUCTION: Without changing any changes in the existing image (especially preserve ZamZam's branding chips on top of the cake) except the customer's request generate the description. Whenever a customer sends a request, make changes on those requests only, but keep the existing cake image style and branding intact.\n\n`;
    prompt += `Create a photorealistic, stunning description/visualization of a custom cake based on:\n`;
    prompt += `- Base Cake Reference/Vibe: ${cakeName || 'Custom Cake'}\n`;
    if (shape) prompt += `- Shape: ${shape}\n`;
    if (flavor) prompt += `- Flavor/Color Palette: ${flavor}\n`;
    if (decorations?.length)
      prompt += `- Decorations: ${decorations.join(', ')}\n`;
    if (cakeText)
      prompt += `- Text to perfectly write on the cake: "${cakeText}"\n`;
    if (additionalRequests)
      prompt += `- Extra requests: ${additionalRequests}\n`;
    prompt += `\nMake the description vivid, professional, and appetizing.`;

    const modelParams = { model: 'gemini-2.5-flash-image' };

    const model = genAI.getGenerativeModel(modelParams);

    const parts: Part[] = [{ text: prompt }];

    if (baseImageBytes) {
      parts.push({
        inlineData: {
          data: baseImageBytes,
          mimeType: baseImageMimeType,
        },
      });
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
    });

    const textResponse = result.response.text();

    return NextResponse.json({
      success: true,
      message: textResponse,
      // In a real Nano Banana API, this would return the generated base64 image strings.
      // Since standard @google/generative-ai doesn't fully support arbitrary image generation natively returning images yet (usually returns text about it),
      // we mock the generated string for now, but we've built the API piping correctly.
      mockImagePrompt: prompt,
    });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
