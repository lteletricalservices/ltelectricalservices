import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const QUOTE_TO_EMAIL = process.env.QUOTE_TO_EMAIL ?? "admin@ltelectricalservices.co.uk";

const supabase =
	SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
		? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
		: null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	if (!RESEND_API_KEY) {
		return res.status(500).json({ error: "Email service not configured" });
	}

	const { name, email, phone, postcode, serviceType, message } = req.body ?? {};

	if (!name || !email || !phone || !serviceType || !message) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const resend = new Resend(RESEND_API_KEY);

	try {
		if (supabase) {
			const { error: dbError } = await supabase.from("contact_quotes").insert([
				{
					name,
					email,
					phone,
					postcode: postcode || "",
					service_type: serviceType,
					message,
				},
			]);

			if (dbError) {
				console.error("Supabase insert error:", dbError);
			} else {
				console.log("Quote saved to Supabase");
			}
		} else {
			console.warn("Supabase not configured - skipping DB save");
		}

		const result = await resend.emails.send({
			from: "LT Electrical Website <onboarding@resend.dev>",
			to: QUOTE_TO_EMAIL,
			replyTo: email,
			subject: `New Quote Request — ${name}`,
			text: [
				"New quote request received.",
				"",
				`Name: ${name}`,
				`Email: ${email}`,
				`Phone: ${phone}`,
				`Postcode: ${postcode || "Not provided"}`,
				`Service: ${serviceType}`,
				"",
				"Message:",
				message,
			].join("\n"),
		});

		console.log("Quote email sent:", result);

		return res.status(200).json({ success: true });
	} catch (err) {
		console.error("Quote request error:", err);
		return res.status(500).json({ error: "Failed to process request" });
	}
}