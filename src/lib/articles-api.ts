import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const ROW_ID = "site-content";

/**
 * Whether the Supabase articles storage is configured.
 */
export function isArticlesApiConfigured(): boolean {
	return isSupabaseConfigured();
}

/**
 * Fetch published content edits directly from Supabase.
 * Returns null if Supabase is not configured or the query fails.
 */
export async function fetchPublishedContent(): Promise<Record<string, string> | null> {
	if (!supabase) return null;

	try {
		const { data, error } = await supabase
			.from("content_edits")
			.select("content")
			.eq("id", ROW_ID)
			.single();

		if (error || !data) return null;
		return (data.content ?? null) as Record<string, string> | null;
	} catch {
		return null;
	}
}

/**
 * Save content edits directly to Supabase via upsert.
 * Uses the anon key — make sure your RLS policy allows writes
 * for authenticated admins, or disable RLS on the content_edits table.
 */
export async function saveContentToServer(
	content: Record<string, string>,
): Promise<boolean> {
	if (!supabase) return false;

	try {
		const { error } = await supabase
			.from("content_edits")
			.upsert({
				id: ROW_ID,
				content,
				updated_at: new Date().toISOString(),
			}, { onConflict: "id" });

		return !error;
	} catch {
		return false;
	}
}

/**
 * Subscribe to real-time changes on the content_edits table.
 * Calls `onUpdate` whenever the row is updated by any client.
 * Returns an unsubscribe function.
 */
export function subscribeToContentUpdates(
	onUpdate: (content: Record<string, string>) => void,
): () => void {
	if (!supabase) return () => {};

	const channel = supabase
		.channel("content-edits-changes")
		.on(
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table: "content_edits",
				filter: `id=eq.${ROW_ID}`,
			},
			(payload) => {
				const content = payload.new?.content as Record<string, string> | undefined;
				if (content) {
					onUpdate(content);
				}
			},
		)
		.subscribe();

	return () => {
		supabase?.removeChannel(channel);
	};
}
