import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const QUOTE_TO_EMAIL = process.env.QUOTE_TO_EMAIL ?? "PaulTwaddle@hotmail.com";

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

	const { name, email, phone, postcode, serviceType, message } = req.body ?? {};

	if (!name || !email || !phone || !serviceType || !message) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	console.log("QUOTE REQUEST START", {
		hasResendKey: !!RESEND_API_KEY,
		hasSupabaseUrl: !!SUPABASE_URL,
		hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
		quoteToEmail: QUOTE_TO_EMAIL,
		body: { name, email, phone, postcode, serviceType, message },
	});

	if (!RESEND_API_KEY) {
		return res.status(500).json({ error: "Missing RESEND_API_KEY" });
	}

	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		return res.status(500).json({ error: "Missing Supabase server env vars" });
	}

	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const resend = new Resend(RESEND_API_KEY);

	try {
		const insertPayload = {
			name,
			email,
			phone,
			postcode: postcode || "",
			service_type: serviceType,
			message,
		};

		console.log("SUPABASE INSERT PAYLOAD", insertPayload);

		const { data: savedQuote, error: dbError } = await supabase
			.from("contact_quotes")
			.insert([insertPayload])
			.select("id, created_at")
			.single();

		if (dbError) {
			console.error("SUPABASE INSERT ERROR", dbError);
			return res.status(500).json({
				error: "Supabase insert failed",
				details: dbError.message,
			});
		}

		console.log("SUPABASE INSERT SUCCESS", savedQuote);

		const emailResult = await resend.emails.send({
			from: "LT Electrical Services <onboarding@resend.dev>",
			to: QUOTE_TO_EMAIL.split(",")
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

		console.log("RESEND SUCCESS", emailResult);

		return res.status(200).json({
			success: true,
			savedQuote,
			emailSentTo: QUOTE_TO_EMAIL,
			emailResult,
		});
	} catch (err) {
		console.error("QUOTE REQUEST FATAL ERROR", err);
		return res.status(500).json({
			error: "Failed to process quote request",
			details: err instanceof Error ? err.message : String(err),
		});
	}
}