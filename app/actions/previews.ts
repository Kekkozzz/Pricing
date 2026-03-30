"use server";

import { createServerClient, createServiceRoleClient } from "@/app/lib/supabase/server";
import { savePreviewCore } from "@/app/lib/previews/save";

export async function savePreview(
  base64Data: string,
  promptInput: Record<string, unknown>,
  quoteId?: string
): Promise<{ success: boolean; previewId?: string; signedUrl?: string; error?: string }> {
  const anonClient = await createServerClient();
  const { data: { user } } = await anonClient.auth.getUser();

  return savePreviewCore(base64Data, promptInput, user?.id ?? null, quoteId);
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
