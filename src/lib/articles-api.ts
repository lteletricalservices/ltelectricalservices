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
 * Also inserts a snapshot row for backup/undo functionality.
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

		if (error) return false;

		// Insert snapshot for undo/restore functionality
		await supabase
			.from("content_edit_snapshots")
			.insert({
				content,
				created_at: new Date().toISOString(),
			});

		return true;
	} catch {
		return false;
	}
}

/**
 * Fetch the last N snapshots for restore functionality.
 */
export async function fetchSnapshots(
	limit = 10,
): Promise<{ id: string; created_at: string; content: Record<string, string> }[]> {
	if (!supabase) return [];

	try {
		const { data, error } = await supabase
			.from("content_edit_snapshots")
			.select("id, created_at, content")
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error || !data) return [];
		return data as { id: string; created_at: string; content: Record<string, string> }[];
	} catch {
		return [];
	}
}

/**
 * Restore content from a specific snapshot (by applying it as the active content).
 * Does NOT create a new snapshot — caller should call saveContentToServer if needed.
 */
export async function restoreFromSnapshot(
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
