/**
 * Vercel Serverless Function: /api/articles
 *
 * GET  — Public read: returns the latest published content edits from Supabase.
 * POST — Protected write: saves content edits to Supabase.
 *        Requires header `x-admin-secret` matching env var ADMIN_SECRET.
 *
 * Supabase table: `content_edits`
 *   - id        TEXT  PRIMARY KEY  (always 'site-content')
 *   - content   JSONB NOT NULL     (the Record<string, string> of edit id → value)
 *   - updated_at TIMESTAMPTZ DEFAULT now()
 *
 * SQL to create the table:
 *   CREATE TABLE content_edits (
 *     id TEXT PRIMARY KEY DEFAULT 'site-content',
 *     content JSONB NOT NULL DEFAULT '{}',
 *     updated_at TIMESTAMPTZ DEFAULT now()
 *   );
 *   INSERT INTO content_edits (id, content) VALUES ('site-content', '{}');
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

const ROW_ID = "site-content";

function supabaseHeaders() {
	return {
		apikey: SUPABASE_SERVICE_ROLE_KEY,
		Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
		"Content-Type": "application/json",
		Prefer: "return=representation",
	};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// CORS
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-secret");

	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}

	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		return res.status(500).json({ error: "Supabase not configured" });
	}

	// ---------- GET: public read ----------
	if (req.method === "GET") {
		try {
			const url = `${SUPABASE_URL}/rest/v1/content_edits?id=eq.${ROW_ID}&select=content`;
			const response = await fetch(url, {
				method: "GET",
				headers: supabaseHeaders(),
			});

			if (!response.ok) {
				const text = await response.text();
				return res.status(response.status).json({ error: text });
			}

			const rows = await response.json();
			const content = rows?.[0]?.content ?? {};
			return res.status(200).json({ content });
		} catch (err) {
			return res.status(500).json({ error: String(err) });
		}
	}

	// ---------- POST: protected write ----------
	if (req.method === "POST") {
		const secret = req.headers["x-admin-secret"];
		if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const body = req.body;
		if (!body || typeof body.content !== "object") {
			return res.status(400).json({ error: "Missing content object in body" });
		}

		try {
			// Upsert the single row
			const url = `${SUPABASE_URL}/rest/v1/content_edits?on_conflict=id`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					...supabaseHeaders(),
					Prefer: "resolution=merge-duplicates,return=representation",
				},
				body: JSON.stringify({
					id: ROW_ID,
					content: body.content,
					updated_at: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				const text = await response.text();
				return res.status(response.status).json({ error: text });
			}

			return res.status(200).json({ success: true });
		} catch (err) {
			return res.status(500).json({ error: String(err) });
		}
	}

	return res.status(405).json({ error: "Method not allowed" });
}
