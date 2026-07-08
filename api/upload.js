import { handleUploadPresigned } from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";

export default async function handler(request, response) {
  const body = request.body;

  try {
    const jsonResponse = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: [
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav", "audio/x-m4a",
          ],
          maximumSizeInBytes: 10 * 1024 * 1024,
        });
        return { token };
      },
      onUploadCompleted: async () => {},
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
