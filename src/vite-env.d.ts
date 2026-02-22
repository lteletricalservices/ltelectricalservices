/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	readonly TENANT_ID?: string;
	readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
	readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
	readonly VITE_SUPABASE_URL?: string;
	readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
