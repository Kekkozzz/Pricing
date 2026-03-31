import { createServiceClient } from "@/app/lib/supabase/service";
import { createServerClient } from "@/app/lib/supabase/server";

export async function GET() {
  const service = createServiceClient();
  const checks: Record<string, unknown> = {};

  // 1. Check current user from cookies
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    checks.currentUser = user ? { id: user.id, email: user.email } : null;
    checks.authError = error?.message ?? null;
  } catch (e) {
    checks.currentUser = null;
    checks.authError = String(e);
  }

  // 2. Check if storage bucket exists
  try {
    const { data: buckets, error } = await service.storage.listBuckets();
    checks.buckets = buckets?.map((b) => ({ name: b.name, public: b.public })) ?? [];
    checks.bucketsError = error?.message ?? null;

    const previewsBucket = buckets?.find((b) => b.name === "previews");
    checks.previewsBucketExists = !!previewsBucket;

    // If bucket doesn't exist, try to create it
    if (!previewsBucket) {
      const { error: createErr } = await service.storage.createBucket("previews", {
        public: false,
        fileSizeLimit: 10 * 1024 * 1024,
      });
      checks.bucketCreated = !createErr;
      checks.bucketCreateError = createErr?.message ?? null;
    }
  } catch (e) {
    checks.bucketsError = String(e);
  }

  // 3. Check preview records in DB
  try {
    const { data: previews, error } = await service
      .from("previews")
      .select("id, quote_id, user_id, storage_path, created_at, file_size_bytes")
      .order("created_at", { ascending: false })
      .limit(10);

    checks.previewRecords = previews ?? [];
    checks.previewCount = previews?.length ?? 0;
    checks.previewsError = error?.message ?? null;
  } catch (e) {
    checks.previewsError = String(e);
  }

  // 4. Check recent quotes
  try {
    const { data: quotes, error } = await service
      .from("quotes")
      .select("id, user_id, status, business_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    checks.recentQuotes = quotes ?? [];
    checks.quotesError = error?.message ?? null;
  } catch (e) {
    checks.quotesError = String(e);
  }

  // 5. Check storage files in bucket (if exists)
  if (checks.previewsBucketExists || checks.bucketCreated) {
    try {
      const { data: files, error } = await service.storage
        .from("previews")
        .list("", { limit: 10 });

      checks.storageFiles = files?.map((f) => f.name) ?? [];
      checks.storageError = error?.message ?? null;
    } catch (e) {
      checks.storageError = String(e);
    }
  }

  return Response.json(checks, { status: 200 });
}
