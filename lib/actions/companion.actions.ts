"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createSupabaseClient,
  createSupabaseServiceClient,
} from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (
  formData: CreateCompanion & { author?: string; userId?: string }
) => {
  const { userId } = await auth();
  // Use service role on the server to bypass RLS for trusted inserts
  const supabase = createSupabaseServiceClient();

  const resolvedAuthor = userId || formData.author || formData.userId;

  if (!resolvedAuthor) throw new Error("Not authenticated");

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY missing; insert may fail due to RLS"
    );
  }

  const { name, subject, topic, voice, style, duration } = formData as any;

  const { data, error } = await supabase
    .from("companions")
    .insert({
      name,
      subject,
      topic,
      voice,
      style,
      duration,
      author: resolvedAuthor,
    })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a companion");

  return data[0];
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient();

  let query = supabase.from("companions").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) throw new Error(error.message);

  return companions;
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Invalid companion ID format. Expected UUID format.");
  }

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Companion not found");
  }

  return data[0];
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });

  // Handle missing table gracefully
  if (error) {
    console.warn(
      "Session history table not found, skipping session tracking:",
      error.message
    );
    return null;
  }

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  // Handle missing table gracefully
  if (error) {
    console.warn(
      "Session history table not found, returning empty array:",
      error.message
    );
    return [];
  }

  return data.map(({ companions }) => companions);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  // Handle missing table gracefully
  if (error) {
    console.warn(
      "Session history table not found, returning empty array:",
      error.message
    );
    return [];
  }

  return data.map(({ companions }) => companions);
};

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if (has({ plan: "pro" })) {
    return true;
  } else if (has({ feature: "3_companion_limit" })) {
    limit = 3;
  } else if (has({ feature: "10_companion_limit" })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length;

  if (companionCount >= limit) {
    return false;
  } else {
    return true;
  }
};

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  
  // Handle missing table gracefully
  if (error) {
    console.warn(
      "Bookmarks table not found, skipping bookmark creation:",
      error.message
    );
    return null;
  }
  
  // Revalidate the path to force a re-render of the page
  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
    
  // Handle missing table gracefully
  if (error) {
    console.warn(
      "Bookmarks table not found, skipping bookmark removal:",
      error.message
    );
    return null;
  }
  
  revalidatePath(path);
  return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  
  // Handle missing table gracefully
  if (error) {
    console.warn(
      "Bookmarks table not found, returning empty array:",
      error.message
    );
    return [];
  }
  
  // We don't need the bookmarks data, so we return only the companions
  return data.map(({ companions }) => companions);
};
