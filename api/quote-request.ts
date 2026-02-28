/**
 * Vercel Serverless Function: POST /api/quote-request
 *
 * Receives quote form submissions and emails them to the site owner via Resend.
 *
 * ENV VAR REQUIRED:
 *   RESEND_API_KEY
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

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
		await resend.emails.send({
			from: "LT Electrical Website <onboarding@resend.dev>",
			to: "admin@ltelectricalservices.co.uk",
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

		return res.status(200).json({ success: true });
	} catch (err) {
		console.error("Resend email error:", err);
		return res.status(500).json({ error: "Failed to send email" });
	}
}
