const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export function isEmailJSConfigured(): boolean {
	return Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
}

interface QuoteEmailParams {
	name: string;
	email: string;
	phone: string;
	postcode: string;
	service_type: string;
	message: string;
	page_url: string;
}

export async function sendQuoteNotification(params: QuoteEmailParams): Promise<boolean> {
	if (!isEmailJSConfigured()) return false;

	try {
		const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				service_id: EMAILJS_SERVICE_ID,
				template_id: EMAILJS_TEMPLATE_ID,
				user_id: EMAILJS_PUBLIC_KEY,
				template_params: {
					to_email: "info@ltelectricalservices.co.uk",
					from_name: params.name,
					from_email: params.email,
					phone: params.phone,
					postcode: params.postcode || "Not provided",
					service_type: params.service_type,
					message: params.message,
					page_url: params.page_url,
				},
			}),
		});
		return response.ok;
	} catch {
		return false;
	}
}
