import { env } from "@/env";

export async function uploadToR2(files: File[]) {
  try {
    // Step 1: Request pre-signed URLs from API
    const fileTypes = files.map((file) => file.type);
    const response = await fetch("/api/r2/secure-url", {
      method: "POST",
      body: JSON.stringify({ fileTypes }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to get signed URLs");

    const { urls } = await response.json();
    // Step 2: Upload images to R2
    await Promise.all(
      urls.map(async ({ url }: { url: string }, index: number) => {
        const file: File = files[index] as File;

        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok)
          throw new Error(`Failed to upload ${file.name}`);
      }),
    );
    return urls.map(
      ({ key }: { key: string }) =>
        `${env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_BUCKET_URL}/${key}`,
    );
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
