"use server";

import { createServerClient, createServiceRoleClient } from "@/app/lib/supabase/server";
import type { Json } from "@/app/lib/supabase/types";

export async function savePreview(
  base64Data: string,
  promptInput: Record<string, unknown>,
  quoteId?: string
): Promise<{ success: boolean; previewId?: string; signedUrl?: string; error?: string }> {
  const supabase = await createServiceRoleClient();

  // Get current user (may be null)
  const anonClient = await createServerClient();
  const { data: { user } } = await anonClient.auth.getUser();

  // Decode base64 to buffer
  const buffer = Buffer.from(base64Data, "base64");
  const fileSize = buffer.length;

  // Generate unique path
  const uuid = crypto.randomUUID();
  const folder = user ? `users/${user.id}` : "anonymous";
  const subFolder = quoteId || "unlinked";
  const storagePath = `${folder}/${subFolder}/${uuid}.png`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("previews")
    .upload(storagePath, buffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload failed:", uploadError);
    return { success: false, error: uploadError.message };
  }

  // Generate signed URL (1 hour)
  const { data: urlData, error: urlError } = await supabase.storage
    .from("previews")
    .createSignedUrl(storagePath, 3600);

  if (urlError) {
    console.error("Signed URL generation failed:", urlError);
  }

  // Create a simple hash from prompt input for dedup
  const promptStr = JSON.stringify(promptInput);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(promptStr)
  );
  const promptHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Insert preview record
  const { data, error: insertError } = await supabase
    .from("previews")
    .insert({
      quote_id: quoteId || null,
      user_id: user?.id || null,
      storage_path: storagePath,
      prompt_hash: promptHash,
      prompt_input: promptInput as Json,
      file_size_bytes: fileSize,
      mime_type: "image/png",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Preview record insert failed:", insertError);
    return { success: false, error: insertError.message };
  }

  return {
    success: true,
    previewId: data.id,
    signedUrl: urlData?.signedUrl,
  };
}

export async function getMyPreviews() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { previews: [], error: "Non autenticato" };

  const serviceClient = await createServiceRoleClient();

  const { data, error } = await supabase
    .from("previews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { previews: [], error: error.message };

  // Generate signed URLs for each preview
  const previewsWithUrls = await Promise.all(
    (data ?? []).map(async (preview) => {
      const { data: urlData } = await serviceClient.storage
        .from("previews")
        .createSignedUrl(preview.storage_path, 3600);

      return {
        ...preview,
        signedUrl: urlData?.signedUrl ?? null,
      };
    })
  );

  return { previews: previewsWithUrls };
}
