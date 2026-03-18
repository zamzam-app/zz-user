import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const GEN_MODEL = 'imagen-4.0-generate-001'; // text → image
const EDIT_MODEL = 'imagen-3.0-capability-001'; // image + text → image
// const EDIT_MODEL = 'imagen-4.0-ultra-generate-001'; // image + text → image

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800';

// Build a GoogleAuth client from env vars (works without a JSON file on disk)
function getAuthClient() {
  return new GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
}

export async function POST(req: NextRequest) {
  if (
    !PROJECT_ID ||
    !process.env.GOOGLE_CLIENT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY
  ) {
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

    // Get a short-lived access token from the service account
    const auth = getAuthClient();
    const accessToken = await auth.getAccessToken();
    if (!accessToken) {
      throw new Error('Failed to obtain Vertex AI access token');
    }

    const base = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models`;
    const parameters = {
      sampleCount: 1,
      outputOptions: { mimeType: 'image/png' },
    };

    let imageBase64: string;
    let mimeType = 'image/png';

    if (baseImageUrl) {
      const imageRes = await fetch(baseImageUrl);
      if (!imageRes.ok) throw new Error('Failed to fetch base image');
      const buffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      const editEndpoint = `${base}/${EDIT_MODEL}:predict`;
      const editRes = await fetch(editEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          instances: [
            {
              prompt,
              referenceImages: [
                {
                  referenceType: 'REFERENCE_TYPE_RAW',
                  referenceId: 1,
                  referenceImage: { bytesBase64Encoded: base64 },
                },
              ],
            },
          ],
          parameters,
        }),
      });

      if (!editRes.ok) {
        const err = await editRes.json();
        console.error('[visualise-cake] Vertex AI edit error:', err);
        throw new Error(err?.error?.message || 'Vertex AI edit error');
      }

      const editData = await editRes.json();
      const prediction = editData?.predictions?.[0];
      if (!prediction?.bytesBase64Encoded) {
        throw new Error('No image returned from Vertex AI');
      }
      imageBase64 = prediction.bytesBase64Encoded;
      mimeType = prediction.mimeType || 'image/png';
    } else {
      const genEndpoint = `${base}/${GEN_MODEL}:predict`;
      const genRes = await fetch(genEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters,
        }),
      });

      if (!genRes.ok) {
        const err = await genRes.json();
        console.error('[visualise-cake] Vertex AI generate error:', err);
        throw new Error(err?.error?.message || 'Vertex AI generate error');
      }

      const genData = await genRes.json();
      const prediction = genData?.predictions?.[0];
      if (!prediction?.bytesBase64Encoded) {
        throw new Error('No image returned from Vertex AI');
      }
      imageBase64 = prediction.bytesBase64Encoded;
      mimeType = prediction.mimeType || 'image/png';
    }

    return NextResponse.json({
      success: true,
      imageBase64,
      mimeType,
      message: '',
    });
  } catch (error: unknown) {
    console.error('[visualise-cake] Unexpected error:', error);
    const msg =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
