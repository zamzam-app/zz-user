/** Response from GET /api/upload/signature */
export interface SignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

/** Fields we care about from Cloudinary's response */
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}
