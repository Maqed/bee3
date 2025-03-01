import { getServerAuthSession } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: "auto",
  endpoint: env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: NextRequest) {
  const session = getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  try {
    const { fileTypes } = await req.json();

    if (!fileTypes || !Array.isArray(fileTypes)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const urls = await Promise.all(
      fileTypes.map(async (fileType) => {
        if (!fileType.startsWith("image/")) {
          return NextResponse.json(
            { error: "file-should-be-image" },
            { status: 400 },
          );
        }

        const fileKey = `${uuidv4()}.${fileType.split("/")[1]}`;
        const command = new PutObjectCommand({
          Bucket: env.CLOUDFLARE_R2_AD_IMAGE_BUCKET,
          Key: fileKey,
          ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        return { url: signedUrl, key: fileKey };
      }),
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Error generating signed URLs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
