"use server";

import { createServerClient, createServiceRoleClient } from "@/app/lib/supabase/server";
import { headers } from "next/headers";
import type { QuoteStatus } from "@/app/lib/supabase/types";

export interface CreateQuoteInput {
  // Package selection
  serviceId: string;
  serviceName: string;
  tierKey: string;
  tierName: string;
  tierPrice: number;
  addOns: { name: string; price: string; priceNumeric: number; recurring: boolean }[];
  features: string[];
  // AI form data
  businessName?: string;
  sector?: string;
  style?: string;
  colorPalette?: string[];
  description?: string;
  referenceUrls?: string;
  // Contact info
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactMessage?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createQuote(input: CreateQuoteInput) {
  // Server-side validation
  if (!input.contactName?.trim()) {
    return { success: false, error: "Nome obbligatorio" };
  }
  if (!input.contactEmail?.trim() || !EMAIL_RE.test(input.contactEmail)) {
    return { success: false, error: "Email non valida" };
  }
  if (!input.serviceId || !input.tierKey) {
    return { success: false, error: "Selezione pacchetto mancante" };
  }

  const supabase = await createServiceRoleClient();
  const headerStore = await headers();

  // Try to get the current user (may be null for anonymous)
  const anonClient = await createServerClient();
  const { data: { user } } = await anonClient.auth.getUser();

  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headerStore.get("x-real-ip")
    || "unknown";
  const userAgent = headerStore.get("user-agent") || "";

  // Calculate totals
  const oneTimeAddOns = input.addOns
    .filter((a) => !a.recurring)
    .reduce((sum, a) => sum + a.priceNumeric, 0);
  const monthlyAddOns = input.addOns
    .filter((a) => a.recurring)
    .reduce((sum, a) => sum + a.priceNumeric, 0);

  const { data, error } = await supabase.from("quotes").insert({
    user_id: user?.id ?? null,
    service_id: input.serviceId,
    service_name: input.serviceName,
    tier_key: input.tierKey,
    tier_name: input.tierName,
    tier_price: input.tierPrice,
    add_ons: input.addOns,
    features: input.features,
    business_name: input.businessName || null,
    sector: input.sector || null,
    style: input.style || null,
    color_palette: input.colorPalette || [],
    description: input.description || null,
    reference_urls: input.referenceUrls || null,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone || null,
    contact_message: input.contactMessage || null,
    total_one_time: input.tierPrice + oneTimeAddOns,
    total_monthly: monthlyAddOns,
    ip_address: ip === "unknown" ? null : ip,
    user_agent: userAgent || null,
  }).select("id").single();

  if (error) {
    console.error("Failed to create quote:", error);
    return { success: false, error: error.message };
  }

  return { success: true, quoteId: data.id };
}

export async function getMyQuotes() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { quotes: [], error: "Non autenticato" };

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { quotes: [], error: error.message };
  return { quotes: data ?? [] };
}

export async function getQuoteById(id: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { quote: null, error: "Non autenticato" };

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return { quote: null, error: error.message };
  return { quote: data };
}

// --- Draft quote functions ---

export interface CreateDraftQuoteInput {
  // Package selection (steps 1-4)
  serviceId: string;
  serviceName: string;
  tierKey: string;
  tierName: string;
  tierPrice: number;
  addOns: { name: string; price: string; priceNumeric: number; recurring: boolean }[];
  features: string[];
  // AI form data (step 5)
  businessName?: string;
  sector?: string;
  style?: string;
  colorPalette?: string[];
  description?: string;
  referenceUrls?: string;
}

export async function createDraftQuote(input: CreateDraftQuoteInput, previewId?: string) {
  if (!input.serviceId || !input.tierKey) {
    return { success: false as const, error: "Selezione pacchetto mancante" };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: "Autenticazione richiesta" };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headerStore.get("x-real-ip")
    || "unknown";
  const userAgent = headerStore.get("user-agent") || "";

  const oneTimeAddOns = input.addOns
    .filter((a) => !a.recurring)
    .reduce((sum, a) => sum + a.priceNumeric, 0);
  const monthlyAddOns = input.addOns
    .filter((a) => a.recurring)
    .reduce((sum, a) => sum + a.priceNumeric, 0);

  const { data, error } = await supabase.from("quotes").insert({
    user_id: user.id,
    status: "draft" as QuoteStatus,
    service_id: input.serviceId,
    service_name: input.serviceName,
    tier_key: input.tierKey,
    tier_name: input.tierName,
    tier_price: input.tierPrice,
    add_ons: input.addOns,
    features: input.features,
    business_name: input.businessName || null,
    sector: input.sector || null,
    style: input.style || null,
    color_palette: input.colorPalette || [],
    description: input.description || null,
    reference_urls: input.referenceUrls || null,
    total_one_time: input.tierPrice + oneTimeAddOns,
    total_monthly: monthlyAddOns,
    ip_address: ip === "unknown" ? null : ip,
    user_agent: userAgent || null,
  }).select("id").single();

  if (error) {
    console.error("Failed to create draft quote:", error);
    return { success: false as const, error: error.message };
  }

  // Link preview to the newly created draft quote
  if (previewId) {
    const serviceClient = await createServiceRoleClient();
    await serviceClient
      .from("previews")
      .update({ quote_id: data.id })
      .eq("id", previewId)
      .eq("user_id", user.id);
  }

  return { success: true as const, quoteId: data.id };
}

export async function completeDraftQuote(
  quoteId: string,
  contactData: {
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    contactMessage?: string;
  }
) {
  if (!contactData.contactName?.trim()) {
    return { success: false, error: "Nome obbligatorio" };
  }
  if (!contactData.contactEmail?.trim() || !EMAIL_RE.test(contactData.contactEmail)) {
    return { success: false, error: "Email non valida" };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Autenticazione richiesta" };
  }

  // Verify quote exists, belongs to user, and is a draft
  const { data: existing } = await supabase
    .from("quotes")
    .select("id, status")
    .eq("id", quoteId)
    .eq("user_id", user.id)
    .single();

  if (!existing || existing.status !== "draft") {
    return { success: false, error: "Quote draft non trovata" };
  }

  const { error } = await supabase
    .from("quotes")
    .update({
      contact_name: contactData.contactName,
      contact_email: contactData.contactEmail,
      contact_phone: contactData.contactPhone || null,
      contact_message: contactData.contactMessage || null,
      status: "new" as QuoteStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId);

  if (error) {
    console.error("Failed to complete draft quote:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  const supabase = await createServiceRoleClient();

  const { error } = await supabase
    .from("quotes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
