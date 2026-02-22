import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useRef,
	type ReactNode,
	type KeyboardEvent as ReactKeyboardEvent,
	type CSSProperties,
	type ChangeEvent,
	type RefObject,
} from "react";
import {
	Pencil,
	Upload,
	Trash2,
	LinkIcon,
	Palette,
	ImageIcon,
	LogOut,
	Lock,
	RotateCcw,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CONTENT_STORAGE_KEY = "lt-electrical-content-edits";
const ADMIN_SESSION_KEY = "lt-electrical-admin-session";
const ADMIN_PASSWORD = "Bollocks£420";

function loadContentEdits(): Record<string, string> {
	try {
		const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch {
		return {};
	}
}

function saveContentEdits(edits: Record<string, string>) {
	localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(edits));
}

function getAdminSession(): boolean {
	return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function setAdminSession(val: boolean) {
	if (val) {
		sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
	} else {
		sessionStorage.removeItem(ADMIN_SESSION_KEY);
	}
}

interface AdminContextValue {
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	handleContentSave: (id: string, value: string) => void;
	handleResetAllEdits: () => void;
	editCount: number;
	handleAdminLogin: (password: string) => boolean;
	handleAdminLogout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
	const ctx = useContext(AdminContext);
	if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
	return ctx;
}

export function AdminProvider({ children }: { children: ReactNode }) {
	const [isAdmin, setIsAdmin] = useState(getAdminSession);
	const [contentEdits, setContentEdits] = useState<Record<string, string>>({});

	useEffect(() => {
		setContentEdits(loadContentEdits());
	}, []);

	const handleContentSave = useCallback((id: string, value: string) => {
		setContentEdits((prev) => {
			const next = { ...prev };
			if (value === "") {
				delete next[id];
			} else {
				next[id] = value;
			}
			saveContentEdits(next);
			return next;
		});
	}, []);

	const handleResetAllEdits = useCallback(() => {
		setContentEdits({});
		localStorage.removeItem(CONTENT_STORAGE_KEY);
	}, []);

	const editCount = Object.keys(contentEdits).length;

	const handleAdminLogin = useCallback((password: string) => {
		if (password === ADMIN_PASSWORD) {
			setIsAdmin(true);
			setAdminSession(true);
			return true;
		}
		return false;
	}, []);

	const handleAdminLogout = useCallback(() => {
		setIsAdmin(false);
		setAdminSession(false);
	}, []);

	return (
		<AdminContext.Provider
			value={{
				isAdmin,
				contentEdits,
				handleContentSave,
				handleResetAllEdits,
				editCount,
				handleAdminLogin,
				handleAdminLogout,
			}}
		>
			{children}
		</AdminContext.Provider>
	);
}

// ----- Editable Components -----

export function EditableText({
	id,
	defaultText,
	as: Tag = "span",
	className,
	isAdmin,
	contentEdits,
	onSave,
	multiline = false,
}: {
	id: string;
	defaultText: string;
	as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div" | "li";
	className?: string;
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	onSave: (id: string, value: string) => void;
	multiline?: boolean;
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState("");
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

	const currentText = contentEdits[id] ?? defaultText;
	const isEdited = id in contentEdits;

	const startEditing = useCallback(() => {
		if (!isAdmin) return;
		setDraft(currentText);
		setEditing(true);
	}, [isAdmin, currentText]);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	const save = useCallback(() => {
		const trimmed = draft.trim();
		if (trimmed && trimmed !== defaultText) {
			onSave(id, trimmed);
		} else if (trimmed === defaultText) {
			onSave(id, "");
		}
		setEditing(false);
	}, [draft, defaultText, id, onSave]);

	const cancel = useCallback(() => {
		setEditing(false);
	}, []);

	const handleKeyDown = useCallback(
		(e: ReactKeyboardEvent) => {
			if (e.key === "Enter" && !multiline) {
				e.preventDefault();
				save();
			}
			if (e.key === "Escape") {
				cancel();
			}
		},
		[save, cancel, multiline],
	);

	if (editing) {
		return multiline ? (
			<textarea
				ref={inputRef as RefObject<HTMLTextAreaElement>}
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				onBlur={save}
				onKeyDown={handleKeyDown}
				className={`${className ?? ""} bg-white/90 text-slate-900 border-2 border-blue-500 rounded px-2 py-1 outline-none w-full resize-y min-h-[60px]`}
				rows={3}
			/>
		) : (
			<input
				ref={inputRef as RefObject<HTMLInputElement>}
				type="text"
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				onBlur={save}
				onKeyDown={handleKeyDown}
				className={`${className ?? ""} bg-white/90 text-slate-900 border-2 border-blue-500 rounded px-2 py-1 outline-none w-full`}
			/>
		);
	}

	if (!isAdmin) {
		return <Tag className={className}>{currentText}</Tag>;
	}

	return (
		<Tag
			className={`${className ?? ""} cursor-pointer relative group/editable ring-blue-400 hover:ring-2 rounded transition-all`}
			onClick={startEditing}
		>
			{currentText}
			<Pencil className="size-3 inline-block ml-1 opacity-0 group-hover/editable:opacity-70 text-blue-400 transition-opacity" />
			{isEdited && <span className="absolute -top-1 -right-1 size-2 rounded-full bg-blue-500" />}
		</Tag>
	);
}

export function EditableLink({
	id,
	defaultHref,
	isAdmin,
	contentEdits,
	onSave,
	children,
	className,
}: {
	id: string;
	defaultHref: string;
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	onSave: (id: string, value: string) => void;
	children: ReactNode;
	className?: string;
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const currentHref = contentEdits[id] ?? defaultHref;
	const isEdited = id in contentEdits;

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	const save = useCallback(() => {
		const trimmed = draft.trim();
		if (trimmed && trimmed !== defaultHref) {
			onSave(id, trimmed);
		} else if (trimmed === defaultHref) {
			onSave(id, "");
		}
		setEditing(false);
	}, [draft, defaultHref, id, onSave]);

	if (editing) {
		return (
			<div className="inline-flex items-center gap-1">
				<input
					ref={inputRef}
					type="text"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onBlur={save}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							save();
						}
						if (e.key === "Escape") setEditing(false);
					}}
					className="bg-white text-slate-900 border-2 border-blue-500 rounded px-2 py-1 outline-none text-sm min-w-[200px]"
				/>
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<a href={currentHref} className={className}>
				{children}
			</a>
		);
	}

	return (
		<span className="relative inline-flex items-center group/link">
			<a href={currentHref} className={className}>
				{children}
			</a>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setDraft(currentHref);
					setEditing(true);
				}}
				className="ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity bg-blue-600 text-white rounded-full p-0.5"
				title="Edit link URL"
			>
				<LinkIcon className="size-3" />
			</button>
			{isEdited && <span className="absolute -top-1 -right-1 size-2 rounded-full bg-blue-500" />}
		</span>
	);
}

export function EditableImage({
	id,
	defaultSrc,
	alt,
	isAdmin,
	contentEdits,
	onSave,
	className,
	wrapperClassName,
}: {
	id: string;
	defaultSrc?: string;
	alt: string;
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	onSave: (id: string, value: string) => void;
	className?: string;
	wrapperClassName?: string;
}) {
	const fileRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");

	const currentSrc = contentEdits[id] ?? defaultSrc;
	const isEdited = id in contentEdits;

	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !file.type.startsWith("image/")) return;

		if (isCloudinaryConfigured()) {
			setUploading(true);
			setUploadError("");
			try {
				const secureUrl = await uploadToCloudinary(file);
				onSave(id, secureUrl);
			} catch (err) {
				setUploadError(err instanceof Error ? err.message : "Upload failed");
			} finally {
				setUploading(false);
			}
		} else {
			const reader = new FileReader();
			reader.onload = (ev) => {
				const dataUrl = ev.target?.result as string;
				onSave(id, dataUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemove = () => {
		onSave(id, "");
		setUploadError("");
		if (fileRef.current) fileRef.current.value = "";
	};

	return (
		<div className={`relative group/img ${wrapperClassName ?? ""}`}>
			{currentSrc ? (
				<img src={currentSrc} alt={alt} className={className} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
			) : (
				<div className={`flex items-center justify-center bg-slate-200 ${className ?? ""}`}>
					<ImageIcon className="size-12 text-slate-400" />
				</div>
			)}
			{isAdmin && (
				<>
					<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
						<button
							type="button"
							onClick={() => fileRef.current?.click()}
							disabled={uploading}
							className="bg-blue-600 text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg disabled:opacity-60"
						>
							{uploading ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
							{uploading ? "Uploading..." : "Upload"}
						</button>
						{isEdited && currentSrc && (
							<button
								type="button"
								onClick={handleRemove}
								className="bg-red-600 text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg"
							>
								<Trash2 className="size-3" /> Remove
							</button>
						)}
						<input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
					</div>
					{uploadError && (
						<div className="absolute bottom-2 left-2 right-2 bg-red-600 text-white text-xs rounded px-2 py-1">
							{uploadError}
						</div>
					)}
				</>
			)}
			{isAdmin && isEdited && <span className="absolute top-1 left-1 size-2 rounded-full bg-blue-500" />}
		</div>
	);
}

export function EditableColor({
	id,
	defaultColor,
	isAdmin,
	contentEdits,
	onSave,
	children,
	className,
	style,
}: {
	id: string;
	defaultColor: string;
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	onSave: (id: string, value: string) => void;
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}) {
	const currentColor = contentEdits[id] ?? defaultColor;
	const isEdited = id in contentEdits;
	const colorRef = useRef<HTMLInputElement>(null);

	const mergedStyle: CSSProperties = {
		...style,
		backgroundColor: isEdited ? currentColor : undefined,
	};

	if (!isAdmin) {
		return (
			<div className={className} style={isEdited ? mergedStyle : style}>
				{children}
			</div>
		);
	}

	return (
		<div className={`relative group/color ${className ?? ""}`} style={isEdited ? mergedStyle : style}>
			{children}
			<button
				type="button"
				onClick={() => colorRef.current?.click()}
				className="absolute top-2 left-2 opacity-0 group-hover/color:opacity-100 transition-opacity bg-white text-slate-700 rounded-full p-1 shadow-lg border"
				title="Change color"
			>
				<Palette className="size-3" />
			</button>
			<input
				ref={colorRef}
				type="color"
				value={currentColor}
				onChange={(e) => {
					if (e.target.value !== defaultColor) {
						onSave(id, e.target.value);
					} else {
						onSave(id, "");
					}
				}}
				className="hidden"
			/>
			{isEdited && <span className="absolute top-1 right-1 size-2 rounded-full bg-blue-500" />}
		</div>
	);
}

/** Shorthand component that pulls from admin context automatically */
export function E({
	id,
	children,
	as,
	className,
	multiline,
}: {
	id: string;
	children: string;
	as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div" | "li";
	className?: string;
	multiline?: boolean;
}) {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	return (
		<EditableText
			id={id}
			defaultText={children}
			as={as}
			className={className}
			isAdmin={isAdmin}
			contentEdits={contentEdits}
			onSave={handleContentSave}
			multiline={multiline}
		/>
	);
}

/** Admin floating toolbar shown on all pages */
export function AdminToolbar() {
	const { isAdmin, editCount, handleResetAllEdits, handleAdminLogout } = useAdmin();

	if (!isAdmin) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 flex gap-2">
			{editCount > 0 && (
				<button
					onClick={handleResetAllEdits}
					className="bg-orange-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm hover:bg-orange-700 transition-colors"
				>
					<RotateCcw className="size-4" />
					<span>
						Reset {editCount} edit{editCount !== 1 ? "s" : ""}
					</span>
				</button>
			)}
			<div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
				<Pencil className="size-4" />
				<span>Admin mode - edit text, links, images & colors</span>
				<button onClick={handleAdminLogout} className="ml-2 hover:text-green-200">
					<LogOut className="size-4" />
				</button>
			</div>
		</div>
	);
}

/** Admin login dialog - place in footer or wherever needed */
export function AdminLoginDialog() {
	const { isAdmin, editCount, handleAdminLogin, handleAdminLogout, handleResetAllEdits } = useAdmin();
	const [adminDialogOpen, setAdminDialogOpen] = useState(false);
	const [adminPassword, setAdminPassword] = useState("");
	const [adminLoginError, setAdminLoginError] = useState("");

	const onLogin = () => {
		const success = handleAdminLogin(adminPassword);
		if (success) {
			setAdminLoginError("");
			setAdminPassword("");
		} else {
			setAdminLoginError("Incorrect password");
		}
	};

	const onLogout = () => {
		handleAdminLogout();
		setAdminDialogOpen(false);
	};

	return (
		<Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
			<DialogTrigger asChild>
				<button className="opacity-30 hover:opacity-70 transition-opacity p-2 bg-slate-900/50 rounded-full text-white shadow-md" aria-label="Admin">
					<Lock className="size-4" />
				</button>
			</DialogTrigger>
			<DialogContent className="max-w-sm">
				{isAdmin ? (
					<>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<CheckCircle2 className="size-5 text-green-600" />
								Admin Access Active
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 pt-4">
							<p className="text-sm text-slate-600">
								You are logged in as admin. Click text to edit, hover links to change URLs, hover images to upload
								new ones, and use color pickers to restyle sections. Session persists across pages.
							</p>
							{editCount > 0 && (
								<div className="border rounded-lg p-3">
									<p className="text-xs text-slate-500 mb-2">
										{editCount} text edit{editCount !== 1 ? "s" : ""} saved
									</p>
									<Button onClick={handleResetAllEdits} variant="outline" size="sm" className="w-full">
										<RotateCcw className="size-3 mr-2" />
										Reset all edits to defaults
									</Button>
								</div>
							)}
							<Button onClick={onLogout} variant="outline" className="w-full">
								<LogOut className="size-4 mr-2" />
								Log Out
							</Button>
						</div>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<Lock className="size-5" />
								Admin Login
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 pt-4">
							<div className="space-y-2">
								<label htmlFor="admin-password" className="text-sm font-medium text-slate-700">
									Password
								</label>
								<Input
									id="admin-password"
									type="password"
									value={adminPassword}
									onChange={(e) => {
										setAdminPassword(e.target.value);
										setAdminLoginError("");
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") onLogin();
									}}
									placeholder="Enter admin password"
								/>
								{adminLoginError && <p className="text-sm text-red-500">{adminLoginError}</p>}
							</div>
							<Button onClick={onLogin} className="w-full">
								<Lock className="size-4 mr-2" />
								Log In
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
