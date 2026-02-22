const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export function isCloudinaryConfigured(): boolean {
	return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

export async function uploadToCloudinary(file: File): Promise<string> {
	if (!CLOUD_NAME || !UPLOAD_PRESET) {
		throw new Error(
			"Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET environment variables.",
		);
	}

	const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", UPLOAD_PRESET);

	const response = await fetch(url, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
	}

	const data = await response.json();
	return data.secure_url as string;
}
