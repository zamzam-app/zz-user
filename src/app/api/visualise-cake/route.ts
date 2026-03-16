import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cakeName,
      shape,
      flavor,
      decorations,
      cakeText,
      additionalRequests,
    } = body;

    // 1. Build a CLEAN prompt (Single line, no newlines)
    const promptParts = ['Professional food photography of a custom cake.'];
    if (cakeName) promptParts.push(`Style: ${cakeName}.`);
    if (shape) promptParts.push(`Shape: ${shape}.`);
    if (flavor) promptParts.push(`Flavor colors: ${flavor}.`);
    if (decorations?.length)
      promptParts.push(`Decorations: ${decorations.join(', ')}.`);
    if (cakeText) promptParts.push(`Text " ${cakeText} " written on cake.`);
    if (additionalRequests) promptParts.push(`Details: ${additionalRequests}.`);
    promptParts.push(
      'Studio lighting, photorealistic, high detail, 8k resolution.'
    );

    const prompt = promptParts.join(' ');

    const PROJECT_ID = process.env.GOOGLE_PROJECT_ID || 'zamzam-img-gen';
    const LOCATION = process.env.GOOGLE_LOCATION || 'asia-south1';

    // Credentials path
    const CREDENTIALS_FILENAME = 'zamzam-img-gen-bc57b359831c.json';
    const keyFilePath = path.join(process.cwd(), CREDENTIALS_FILENAME);

    if (fs.existsSync(keyFilePath)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
    }

    // --- STRATEGY 1: VERTEX AI (IMAGE 3) ---
    try {
      const vertexAI = new VertexAI({
        project: PROJECT_ID,
        location: LOCATION,
      });
      const model = vertexAI.getGenerativeModel({
        model: 'imagen-3.0-generate-002',
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      interface VertexPart {
        inlineData?: {
          data: string;
        };
      }
      const parts = (result.response.candidates?.[0]?.content?.parts ||
        []) as VertexPart[];
      const imagePart = parts.find((p) => p.inlineData);

      if (imagePart?.inlineData?.data) {
        return NextResponse.json({
          image: `data:image/png;base64,${imagePart.inlineData.data}`,
          source: 'vertex',
        });
      }
    } catch {
      console.warn('Vertex unavailable, trying fallback...');
    }

    // --- STRATEGY 2: POLLINATIONS (SUPER STABLE VERSION) ---
    try {
      const seed = Math.floor(Math.random() * 1000000);
      // Removed flux model parameter to use the default stable one
      const pollinatorUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;

      const response = await fetch(pollinatorUrl);

      if (!response.ok) throw new Error(`Status ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');

      return NextResponse.json({
        image: `data:image/png;base64,${base64Image}`,
        source: 'fallback',
      });
    } catch {
      // --- STRATEGY 3: FINAL SAFETY (DIRECT URL) ---
      // If everything fails, we return a direct link that the browser can load.
      const finalSeed = Math.floor(Math.random() * 1000000);
      const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${finalSeed}&nologo=true`;

      return NextResponse.json({
        image: finalUrl,
        source: 'safety-net',
      });
    }
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try refreshing.' },
      { status: 500 }
    );
  }
}
