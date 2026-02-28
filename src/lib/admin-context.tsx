import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
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
	AlertTriangle,
	Undo2,
	History,
	Map,
	Search,
	Eye,
	EyeOff,
	ChevronUp,
	ChevronDown,
	Settings2,
	Shield,
	Zap,
	Phone,
	Mail,
	MapPin,
	Clock,
	Star,
	Building2,
	AlertCircle,
	ClipboardCheck,
	Car,
	Flame,
	Users,
	DollarSign,
	Sparkles,
	TrendingUp,
	Home,
	Plug,
	Heart,
	PawPrint,
	PoundSterling,
	Wrench,
	Lightbulb,
	BadgeCheck,
	ThumbsUp,
	Award,
	type LucideIcon,
} from "lucide-react";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import {
	fetchPublishedContent,
	saveContentToServer,
	subscribeToContentUpdates,
	isArticlesApiConfigured,
	fetchSnapshots,
	restoreFromSnapshot,
} from "@/lib/articles-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ---------- Icon Registry ----------

export const ICON_REGISTRY: Record<string, { icon: LucideIcon; label: string }> = {
	shield: { icon: Shield, label: "Shield" },
	zap: { icon: Zap, label: "Bolt" },
	check: { icon: CheckCircle2, label: "Check" },
	phone: { icon: Phone, label: "Phone" },
	mail: { icon: Mail, label: "Email" },
	"map-pin": { icon: MapPin, label: "Map Pin" },
	clock: { icon: Clock, label: "Clock" },
	star: { icon: Star, label: "Star" },
	building: { icon: Building2, label: "Building" },
	alert: { icon: AlertCircle, label: "Alert" },
	clipboard: { icon: ClipboardCheck, label: "Clipboard" },
	car: { icon: Car, label: "Car / EV" },
	flame: { icon: Flame, label: "Flame" },
	users: { icon: Users, label: "Users" },
	dollar: { icon: DollarSign, label: "Dollar" },
	pound: { icon: PoundSterling, label: "Pound" },
	sparkles: { icon: Sparkles, label: "Sparkles" },
	trending: { icon: TrendingUp, label: "Trending" },
	home: { icon: Home, label: "Home" },
	plug: { icon: Plug, label: "Plug" },
	heart: { icon: Heart, label: "Heart" },
	paw: { icon: PawPrint, label: "Paw Print" },
	wrench: { icon: Wrench, label: "Wrench" },
	lightbulb: { icon: Lightbulb, label: "Lightbulb" },
	badge: { icon: BadgeCheck, label: "Badge" },
	"thumbs-up": { icon: ThumbsUp, label: "Thumbs Up" },
	award: { icon: Award, label: "Award" },
	settings: { icon: Settings2, label: "Settings" },
};

export function getIconComponent(key: string): LucideIcon {
	return ICON_REGISTRY[key]?.icon ?? Zap;
}

const ADMIN_SESSION_KEY = "lt-electrical-admin-session";
const ADMIN_PASSWORD = "Bollocks£420";

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

// ---------- Section ordering & visibility types ----------

export interface SectionConfig {
	id: string;
	label: string;
	visible: boolean;
	order: number;
	bgColor?: string;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
	{ id: "hero", label: "Hero", visible: true, order: 0 },
	{ id: "trust", label: "Trust Indicators", visible: true, order: 1 },
	{ id: "services", label: "Services", visible: true, order: 2 },
	{ id: "why", label: "Why Choose Us", visible: true, order: 3 },
	{ id: "areas", label: "Areas We Cover", visible: true, order: 4 },
	{ id: "projects", label: "Recent Projects", visible: true, order: 5 },
	{ id: "testimonials", label: "Testimonials", visible: true, order: 6 },
	{ id: "cta", label: "CTA Banner", visible: true, order: 7 },
	{ id: "contact", label: "Contact Form", visible: true, order: 8 },
];

const SECTION_CONFIG_KEY = "__section_config";
const ARTICLES_CONTENT_KEY = "__articles";

function parseSections(contentEdits: Record<string, string>): SectionConfig[] {
	const raw = contentEdits[SECTION_CONFIG_KEY];
	if (raw) {
		try {
			return JSON.parse(raw) as SectionConfig[];
		} catch { /* ignore */ }
	}
	return DEFAULT_SECTIONS;
}

// ---------- Context ----------

interface AdminContextValue {
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	handleContentSave: (id: string, value: string) => void;
	handleResetAllEdits: () => void;
	handleUndoLastChange: () => Promise<void>;
	editCount: number;
	handleAdminLogin: (password: string) => boolean;
	handleAdminLogout: () => void;
	sections: SectionConfig[];
	updateSections: (sections: SectionConfig[]) => void;
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
	const [serverLoaded, setServerLoaded] = useState(false);
	const skipNextRealtime = useRef(false);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			if (isArticlesApiConfigured()) {
				const serverContent = await fetchPublishedContent();
				if (!cancelled && serverContent && Object.keys(serverContent).length > 0) {
					setContentEdits(serverContent);
				}
			}
			if (!cancelled) {
				setServerLoaded(true);
			}
		}

		load();

		const unsubscribe = subscribeToContentUpdates((updatedContent) => {
			if (skipNextRealtime.current) {
				skipNextRealtime.current = false;
				return;
			}
			setContentEdits(updatedContent);
		});

		return () => {
			cancelled = true;
			unsubscribe();
		};
	}, []);

	const handleContentSave = useCallback((id: string, value: string) => {
		setContentEdits((prev) => {
			const next = { ...prev };
			if (value === "") {
				delete next[id];
			} else {
				next[id] = value;
			}
			skipNextRealtime.current = true;
			saveContentToServer(next);
			return next;
		});
	}, []);

	const handleResetAllEdits = useCallback(() => {
		setContentEdits({});
		skipNextRealtime.current = true;
		saveContentToServer({});
	}, []);

	const handleUndoLastChange = useCallback(async () => {
		const snapshots = await fetchSnapshots(2);
		// The first snapshot is the current state, the second is the previous
		if (snapshots.length >= 2) {
			const previousContent = snapshots[1].content;
			setContentEdits(previousContent);
			skipNextRealtime.current = true;
			await restoreFromSnapshot(previousContent);
		}
	}, []);

	const sections = useMemo(() => parseSections(contentEdits), [contentEdits]);

	const updateSections = useCallback((newSections: SectionConfig[]) => {
		handleContentSave(SECTION_CONFIG_KEY, JSON.stringify(newSections));
	}, [handleContentSave]);

	const editCount = Object.keys(contentEdits).filter(k => k !== SECTION_CONFIG_KEY).length;

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
				handleUndoLastChange,
				editCount,
				handleAdminLogin,
				handleAdminLogout,
				sections,
				updateSections,
			}}
		>
			{serverLoaded ? children : null}
		</AdminContext.Provider>
	);
}

// ---------- Editable Components ----------

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
			if (inputRef.current instanceof HTMLInputElement) {
				inputRef.current.select();
			}
		}
	}, [editing]);

	const save = useCallback(() => {
		const value = multiline ? draft : draft.trim();
		if (value && value !== defaultText) {
			onSave(id, value);
		} else if (value === defaultText || value === "") {
			onSave(id, "");
		}
		setEditing(false);
	}, [draft, defaultText, id, onSave, multiline]);

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
				rows={4}
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
		return <Tag className={className} style={multiline ? { whiteSpace: "pre-wrap" } : undefined}>{currentText}</Tag>;
	}

	return (
		<Tag
			className={`${className ?? ""} cursor-pointer relative group/editable ring-blue-400 hover:ring-2 rounded transition-all`}
			onClick={startEditing}
			style={multiline ? { whiteSpace: "pre-wrap" } : undefined}
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
	defaultLabel,
	isAdmin,
	contentEdits,
	onSave,
	children,
	className,
}: {
	id: string;
	defaultHref: string;
	defaultLabel?: string;
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	onSave: (id: string, value: string) => void;
	children: ReactNode;
	className?: string;
}) {
	const [editing, setEditing] = useState(false);
	const [draftHref, setDraftHref] = useState("");
	const [draftLabel, setDraftLabel] = useState("");
	const [linkMode, setLinkMode] = useState<"url" | "article">("url");
	const [selectedArticleId, setSelectedArticleId] = useState("");
	const hrefInputRef = useRef<HTMLInputElement>(null);

	const hrefKey = `${id}.href`;
	const labelKey = `${id}.label`;
	const currentHref = contentEdits[hrefKey] ?? defaultHref;
	const currentLabel = contentEdits[labelKey] ?? defaultLabel;
	const isEdited = hrefKey in contentEdits || labelKey in contentEdits;

	// If href is explicitly cleared to empty, hide the link
	const isCleared = contentEdits[hrefKey] === "__cleared__";

	// Parse dynamic articles from content edits for the article picker
	const dynamicArticles = useMemo(() => {
		const raw = contentEdits[ARTICLES_CONTENT_KEY];
		if (!raw) return [];
		try {
			const arr = JSON.parse(raw);
			if (!Array.isArray(arr)) return [];
			return arr as { id: string; title: string }[];
		} catch {
			return [];
		}
	}, [contentEdits]);

	const hardcodedArticles = useMemo(() => [
		{ id: "rhys-irwin", title: "Rhys Irwin Championship" },
		{ id: "eicr-guide", title: "EICR Guide" },
		{ id: "pat-testing", title: "PAT Testing Guide" },
		{ id: "defibrillators", title: "Community Defibrillators" },
	], []);

	useEffect(() => {
		if (editing && linkMode === "url" && hrefInputRef.current) {
			hrefInputRef.current.focus();
			hrefInputRef.current.select();
		}
	}, [editing, linkMode]);

	const save = useCallback(() => {
		let finalHref: string;
		if (linkMode === "article" && selectedArticleId) {
			finalHref = `/news?article=${selectedArticleId}`;
		} else {
			finalHref = draftHref.trim();
		}

		const trimmedLabel = draftLabel.trim();

		if (finalHref === "") {
			onSave(hrefKey, "__cleared__");
		} else if (finalHref !== defaultHref) {
			onSave(hrefKey, finalHref);
		} else {
			onSave(hrefKey, "");
		}

		if (defaultLabel !== undefined) {
			if (trimmedLabel && trimmedLabel !== defaultLabel) {
				onSave(labelKey, trimmedLabel);
			} else {
				onSave(labelKey, "");
			}
		}

		setEditing(false);
	}, [linkMode, selectedArticleId, draftHref, draftLabel, defaultHref, defaultLabel, hrefKey, labelKey, onSave]);

	const restore = useCallback(() => {
		onSave(hrefKey, "");
		onSave(labelKey, "");
	}, [hrefKey, labelKey, onSave]);

	const startEditing = useCallback(() => {
		const href = currentHref;
		setDraftLabel(currentLabel ?? (typeof children === "string" ? children : ""));

		const articleMatch = href.match(/\/news\?article=(.+)$/);
		if (articleMatch) {
			setLinkMode("article");
			setSelectedArticleId(articleMatch[1]);
			setDraftHref(href);
		} else {
			setLinkMode("url");
			setSelectedArticleId("");
			setDraftHref(href);
		}
		setEditing(true);
	}, [currentHref, currentLabel, children]);

	if (isCleared) {
		if (!isAdmin) return null;
		return (
			<span className="inline-flex items-center gap-1 opacity-50">
				<span className="line-through text-xs text-slate-400">[hidden link]</span>
				<button
					type="button"
					onClick={(e) => { e.preventDefault(); e.stopPropagation(); restore(); }}
					className="bg-blue-600 text-white rounded-full p-0.5 text-xs"
					title="Restore link"
				>
					<RotateCcw className="size-3" />
				</button>
			</span>
		);
	}

	if (editing) {
		return (
			<div className="inline-flex flex-col gap-1.5 bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg min-w-[280px]" onClick={(e) => e.stopPropagation()}>
				{defaultLabel !== undefined && (
					<div>
						<label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Label</label>
						<input
							type="text"
							value={draftLabel}
							onChange={(e) => setDraftLabel(e.target.value)}
							placeholder="Link label"
							className="bg-slate-50 text-slate-900 border border-slate-300 rounded px-2 py-1 outline-none text-sm w-full focus:ring-1 focus:ring-blue-400"
						/>
					</div>
				)}

				<div className="flex gap-1">
					<button
						type="button"
						onClick={() => setLinkMode("url")}
						className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${linkMode === "url" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
					>
						URL
					</button>
					<button
						type="button"
						onClick={() => setLinkMode("article")}
						className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${linkMode === "article" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
					>
						Article
					</button>
				</div>

				{linkMode === "url" ? (
					<div>
						<label className="text-[10px] font-medium text-slate-500 mb-0.5 block">URL</label>
						<input
							ref={hrefInputRef}
							type="text"
							value={draftHref}
							onChange={(e) => setDraftHref(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") { e.preventDefault(); save(); }
								if (e.key === "Escape") setEditing(false);
							}}
							placeholder="https://... or leave empty to hide"
							className="bg-slate-50 text-slate-900 border border-slate-300 rounded px-2 py-1 outline-none text-sm w-full focus:ring-1 focus:ring-blue-400"
						/>
					</div>
				) : (
					<div>
						<label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Select Article</label>
						<select
							value={selectedArticleId}
							onChange={(e) => setSelectedArticleId(e.target.value)}
							className="bg-slate-50 text-slate-900 border border-slate-300 rounded px-2 py-1 outline-none text-sm w-full focus:ring-1 focus:ring-blue-400"
						>
							<option value="">-- Choose an article --</option>
							{dynamicArticles.length > 0 && (
								<optgroup label="Your Articles">
									{dynamicArticles.map((a) => (
										<option key={a.id} value={a.id}>{a.title}</option>
									))}
								</optgroup>
							)}
							<optgroup label="Built-in Articles">
								{hardcodedArticles.map((a) => (
									<option key={a.id} value={a.id}>{a.title}</option>
								))}
							</optgroup>
						</select>
						{selectedArticleId && (
							<p className="text-[10px] text-slate-400 mt-0.5">/news?article={selectedArticleId}</p>
						)}
					</div>
				)}

				<div className="flex gap-1 mt-0.5">
					<button type="button" onClick={save} className="bg-blue-600 text-white rounded px-2 py-0.5 text-xs font-medium">Save</button>
					<button type="button" onClick={() => setEditing(false)} className="bg-slate-200 text-slate-700 rounded px-2 py-0.5 text-xs">Cancel</button>
				</div>
			</div>
		);
	}

	const displayChildren = currentLabel ?? children;

	if (!isAdmin) {
		return (
			<a href={currentHref} className={className}>
				{displayChildren}
			</a>
		);
	}

	return (
		<span className="relative inline-flex items-center group/link">
			<a href={currentHref} className={className}>
				{displayChildren}
			</a>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					startEditing();
				}}
				className="ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity bg-blue-600 text-white rounded-full p-0.5"
				title="Edit link"
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
	optional = false,
	label,
}: {
	id: string;
	defaultSrc?: string;
	alt: string;
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	onSave: (id: string, value: string) => void;
	className?: string;
	wrapperClassName?: string;
	optional?: boolean;
	label?: string;
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

	// Optional image: if no src, render nothing for non-admin; show upload button for admin
	if (optional && !currentSrc) {
		if (!isAdmin) return null;
		return (
			<div className="mb-4">
				{label && <p className="text-xs text-slate-500 mb-1">{label}</p>}
				<button
					type="button"
					onClick={() => fileRef.current?.click()}
					disabled={uploading}
					className="border-2 border-dashed border-blue-400 rounded-lg p-3 text-xs text-blue-600 flex items-center gap-2 hover:bg-blue-50 transition-colors w-full justify-center"
				>
					{uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
					{uploading ? "Uploading..." : "Add image (optional)"}
				</button>
				<input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
				{uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
			</div>
		);
	}

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
					{label && <p className="absolute top-1 left-1 text-[10px] text-white bg-black/50 rounded px-1">{label}</p>}
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
						{(isEdited || (optional && currentSrc)) && (
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

export function EditableIcon({
	id,
	defaultIcon,
	className,
	isAdmin,
	contentEdits,
	onSave,
}: {
	id: string;
	defaultIcon: string;
	className?: string;
	isAdmin: boolean;
	contentEdits: Record<string, string>;
	onSave: (id: string, value: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const currentKey = contentEdits[id] ?? defaultIcon;
	const isEdited = id in contentEdits;
	const IconComp = getIconComponent(currentKey);

	const handleSelect = (key: string) => {
		if (key !== defaultIcon) {
			onSave(id, key);
		} else {
			onSave(id, "");
		}
		setOpen(false);
	};

	if (!isAdmin) {
		return <IconComp className={className} />;
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="relative group/icon cursor-pointer ring-blue-400 hover:ring-2 rounded-lg transition-all p-0.5"
					title="Change icon"
				>
					<IconComp className={className} />
					<span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 opacity-0 group-hover/icon:opacity-100 transition-opacity shadow-sm">
						<Settings2 className="size-2.5" />
					</span>
					{isEdited && <span className="absolute -top-1 -right-1 size-2 rounded-full bg-blue-500" />}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-2" align="start">
				<p className="text-xs font-medium text-slate-500 mb-2 px-1">Choose icon</p>
				<div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
					{Object.entries(ICON_REGISTRY).map(([key, { icon: Ic, label }]) => (
						<button
							key={key}
							type="button"
							onClick={() => handleSelect(key)}
							className={`flex items-center justify-center p-2 rounded-md transition-colors ${currentKey === key ? "bg-blue-100 ring-2 ring-blue-500" : "hover:bg-slate-100"}`}
							title={label}
						>
							<Ic className="size-4 text-slate-700" />
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

/** Shorthand `EditableIcon` that auto-wires admin context */
export function EIcon({
	id,
	defaultIcon,
	className,
}: {
	id: string;
	defaultIcon: string;
	className?: string;
}) {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	return (
		<EditableIcon
			id={id}
			defaultIcon={defaultIcon}
			className={className}
			isAdmin={isAdmin}
			contentEdits={contentEdits}
			onSave={handleContentSave}
		/>
	);
}

/** Shorthand component that auto-wires admin context */
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

// ---------- Section wrapper for show/hide + ordering ----------

export function AdminSection({
	sectionId,
	children,
	className,
	style,
}: {
	sectionId: string;
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}) {
	const { isAdmin, sections } = useAdmin();
	const config = sections.find((s) => s.id === sectionId);

	if (!config) return <section className={className} style={style}>{children}</section>;
	if (!config.visible && !isAdmin) return null;

	const sectionStyle: CSSProperties = {
		...style,
		...(config.bgColor ? { backgroundColor: config.bgColor } : {}),
		...((!config.visible && isAdmin) ? { opacity: 0.4 } : {}),
	};

	return (
		<section className={className} style={sectionStyle} data-section={sectionId}>
			{!config.visible && isAdmin && (
				<div className="text-center py-1 bg-orange-100 text-orange-700 text-xs font-medium">
					<EyeOff className="size-3 inline mr-1" />Hidden section — only visible in admin mode
				</div>
			)}
			{children}
		</section>
	);
}

// ---------- Section Controls Panel ----------

function SectionControlPanel() {
	const { sections, updateSections } = useAdmin();

	const toggleVisibility = (sectionId: string) => {
		const updated = sections.map((s) =>
			s.id === sectionId ? { ...s, visible: !s.visible } : s,
		);
		updateSections(updated);
	};

	const moveUp = (idx: number) => {
		if (idx === 0) return;
		const updated = [...sections];
		const tmp = updated[idx - 1];
		updated[idx - 1] = { ...updated[idx], order: idx - 1 };
		updated[idx] = { ...tmp, order: idx };
		updateSections(updated);
	};

	const moveDown = (idx: number) => {
		if (idx >= sections.length - 1) return;
		const updated = [...sections];
		const tmp = updated[idx + 1];
		updated[idx + 1] = { ...updated[idx], order: idx + 1 };
		updated[idx] = { ...tmp, order: idx };
		updateSections(updated);
	};

	const changeBg = (sectionId: string, color: string) => {
		const updated = sections.map((s) =>
			s.id === sectionId ? { ...s, bgColor: color === "" ? undefined : color } : s,
		);
		updateSections(updated);
	};

	return (
		<div className="space-y-1">
			{sections.map((s, idx) => (
				<div key={s.id} className="flex items-center gap-2 bg-slate-50 rounded px-2 py-1.5 text-xs">
					<button type="button" onClick={() => toggleVisibility(s.id)} title={s.visible ? "Hide" : "Show"}>
						{s.visible ? <Eye className="size-3.5 text-green-600" /> : <EyeOff className="size-3.5 text-slate-400" />}
					</button>
					<span className="flex-1 font-medium text-slate-700 truncate">{s.label}</span>
					<input
						type="color"
						value={s.bgColor || "#ffffff"}
						onChange={(e) => changeBg(s.id, e.target.value === "#ffffff" ? "" : e.target.value)}
						className="size-5 rounded border cursor-pointer"
						title="Background color"
					/>
					<button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="disabled:opacity-30">
						<ChevronUp className="size-3.5" />
					</button>
					<button type="button" onClick={() => moveDown(idx)} disabled={idx >= sections.length - 1} className="disabled:opacity-30">
						<ChevronDown className="size-3.5" />
					</button>
				</div>
			))}
		</div>
	);
}

// ---------- Content Map Panel ----------

function ContentMapPanel() {
	const { contentEdits, handleContentSave } = useAdmin();
	const [search, setSearch] = useState("");
	const [editingKey, setEditingKey] = useState<string | null>(null);
	const [editDraft, setEditDraft] = useState("");

	const filteredKeys = useMemo(() => {
		const keys = Object.keys(contentEdits).filter((k) => k !== SECTION_CONFIG_KEY);
		if (!search) return keys.sort();
		const q = search.toLowerCase();
		return keys.filter((k) => k.toLowerCase().includes(q) || contentEdits[k].toLowerCase().includes(q)).sort();
	}, [contentEdits, search]);

	const startEdit = (key: string) => {
		setEditingKey(key);
		setEditDraft(contentEdits[key]);
	};

	const saveEdit = () => {
		if (editingKey) {
			handleContentSave(editingKey, editDraft.trim());
			setEditingKey(null);
		}
	};

	const removeKey = (key: string) => {
		handleContentSave(key, "");
	};

	return (
		<div className="space-y-3">
			<div className="relative">
				<Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search keys or values..."
					className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
				/>
			</div>
			<p className="text-xs text-slate-500">{filteredKeys.length} editable keys</p>
			<div className="max-h-64 overflow-y-auto space-y-1">
				{filteredKeys.map((key) => (
					<div key={key} className="bg-slate-50 rounded px-2 py-1.5 text-xs group">
						{editingKey === key ? (
							<div className="space-y-1">
								<p className="font-mono text-blue-600 text-[10px]">{key}</p>
								<textarea
									value={editDraft}
									onChange={(e) => setEditDraft(e.target.value)}
									className="w-full border rounded px-1.5 py-1 text-xs resize-y min-h-[40px] outline-none focus:ring-1 focus:ring-blue-400"
									rows={2}
								/>
								<div className="flex gap-1">
									<button type="button" onClick={saveEdit} className="text-green-600 hover:text-green-700 text-[10px] font-medium">Save</button>
									<button type="button" onClick={() => setEditingKey(null)} className="text-slate-500 hover:text-slate-700 text-[10px]">Cancel</button>
								</div>
							</div>
						) : (
							<div className="flex items-start gap-1">
								<div className="flex-1 min-w-0">
									<p className="font-mono text-blue-600 text-[10px] truncate">{key}</p>
									<p className="text-slate-600 truncate">{contentEdits[key]}</p>
								</div>
								<button
									type="button"
									onClick={() => startEdit(key)}
									className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 shrink-0"
								>
									<Pencil className="size-3" />
								</button>
								<button
									type="button"
									onClick={() => removeKey(key)}
									className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 shrink-0"
								>
									<Trash2 className="size-3" />
								</button>
							</div>
						)}
					</div>
				))}
				{filteredKeys.length === 0 && (
					<p className="text-xs text-slate-400 text-center py-4">No editable keys found</p>
				)}
			</div>
		</div>
	);
}

// ---------- Danger Zone ----------

function DangerZone() {
	const { handleResetAllEdits, handleUndoLastChange, editCount } = useAdmin();
	const [resetConfirmText, setResetConfirmText] = useState("");
	const [showResetConfirm, setShowResetConfirm] = useState(false);
	const [snapshots, setSnapshots] = useState<{ id: string; created_at: string; content: Record<string, string> }[]>([]);
	const [showSnapshots, setShowSnapshots] = useState(false);
	const [loadingSnapshots, setLoadingSnapshots] = useState(false);
	const [undoing, setUndoing] = useState(false);
	const [restoring, setRestoring] = useState(false);
	const { contentEdits, handleContentSave } = useAdmin();

	const handleUndo = async () => {
		setUndoing(true);
		await handleUndoLastChange();
		setUndoing(false);
	};

	const loadSnapshots = async () => {
		setLoadingSnapshots(true);
		const snaps = await fetchSnapshots(10);
		setSnapshots(snaps);
		setLoadingSnapshots(false);
		setShowSnapshots(true);
	};

	const handleRestore = async (content: Record<string, string>) => {
		setRestoring(true);
		// Apply the snapshot content
		await restoreFromSnapshot(content);
		// Update local state via content map
		for (const key of Object.keys(contentEdits)) {
			if (!(key in content)) {
				handleContentSave(key, "");
			}
		}
		for (const [key, val] of Object.entries(content)) {
			handleContentSave(key, val);
		}
		setRestoring(false);
		setShowSnapshots(false);
	};

	const handleReset = () => {
		handleResetAllEdits();
		setShowResetConfirm(false);
		setResetConfirmText("");
	};

	const formatTimestamp = (ts: string) => {
		const d = new Date(ts);
		return d.toLocaleString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="space-y-3 border-t border-red-200 pt-3 mt-3">
			<h4 className="text-xs font-semibold text-red-600 flex items-center gap-1">
				<AlertTriangle className="size-3" />
				Danger Zone
			</h4>

			<div className="flex flex-col gap-2">
				<Button
					variant="outline"
					size="sm"
					className="w-full text-xs justify-start"
					onClick={handleUndo}
					disabled={undoing || editCount === 0}
				>
					<Undo2 className="size-3 mr-2" />
					{undoing ? "Undoing..." : "Undo last change"}
				</Button>

				<Button
					variant="outline"
					size="sm"
					className="w-full text-xs justify-start"
					onClick={loadSnapshots}
					disabled={loadingSnapshots}
				>
					<History className="size-3 mr-2" />
					{loadingSnapshots ? "Loading..." : "Restore from backup"}
				</Button>

				{showSnapshots && (
					<div className="border rounded-lg p-2 bg-slate-50 max-h-48 overflow-y-auto space-y-1">
						{snapshots.length === 0 ? (
							<p className="text-xs text-slate-400 text-center py-2">No backups found</p>
						) : (
							snapshots.map((snap) => (
								<button
									key={snap.id}
									type="button"
									onClick={() => handleRestore(snap.content)}
									disabled={restoring}
									className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-blue-50 flex items-center justify-between disabled:opacity-50"
								>
									<span className="text-slate-700">{formatTimestamp(snap.created_at)}</span>
									<span className="text-slate-400">{Object.keys(snap.content).length} edits</span>
								</button>
							))
						)}
					</div>
				)}

				{!showResetConfirm ? (
					<Button
						variant="outline"
						size="sm"
						className="w-full text-xs justify-start text-red-600 border-red-200 hover:bg-red-50"
						onClick={() => setShowResetConfirm(true)}
						disabled={editCount === 0}
					>
						<RotateCcw className="size-3 mr-2" />
						Reset all edits to defaults
					</Button>
				) : (
					<div className="border-2 border-red-300 rounded-lg p-3 bg-red-50 space-y-2">
						<p className="text-xs text-red-700 font-medium">
							Type <span className="font-mono font-bold">RESET</span> to confirm deletion of all {editCount} edits:
						</p>
						<input
							type="text"
							value={resetConfirmText}
							onChange={(e) => setResetConfirmText(e.target.value)}
							placeholder="Type RESET"
							className="w-full border border-red-300 rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-red-400"
						/>
						<div className="flex gap-2">
							<Button
								variant="destructive"
								size="sm"
								className="text-xs flex-1"
								disabled={resetConfirmText !== "RESET"}
								onClick={handleReset}
							>
								Confirm Reset
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="text-xs"
								onClick={() => { setShowResetConfirm(false); setResetConfirmText(""); }}
							>
								Cancel
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

// ---------- Admin Toolbar ----------

export function AdminToolbar() {
	const { isAdmin, editCount, handleAdminLogout } = useAdmin();

	if (!isAdmin) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
			<div className="flex gap-2">
				<div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
					<Pencil className="size-4" />
					<span>Admin mode{editCount > 0 ? ` — ${editCount} edits` : ""}</span>
					<button onClick={handleAdminLogout} className="ml-2 hover:text-green-200">
						<LogOut className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}

// ---------- Admin Login Dialog ----------

export function AdminLoginDialog() {
	const {
		isAdmin,
		editCount,
		handleAdminLogin,
		handleAdminLogout,
	} = useAdmin();
	const [adminDialogOpen, setAdminDialogOpen] = useState(false);
	const [adminPassword, setAdminPassword] = useState("");
	const [adminLoginError, setAdminLoginError] = useState("");
	const [activeTab, setActiveTab] = useState<"settings" | "sections" | "content-map">("settings");

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
			<DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
				{isAdmin ? (
					<>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<CheckCircle2 className="size-5 text-green-600" />
								Admin Panel
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 pt-2">
							{/* Tab navigation */}
							<div className="flex gap-1 border-b">
								<button
									type="button"
									onClick={() => setActiveTab("settings")}
									className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${activeTab === "settings" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
								>
									Settings
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("sections")}
									className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${activeTab === "sections" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
								>
									Sections
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("content-map")}
									className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 ${activeTab === "content-map" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
								>
									<Map className="size-3" />
									Content Map
								</button>
							</div>

							{activeTab === "settings" && (
								<div className="space-y-3">
									<p className="text-sm text-slate-600">
										Click text to edit, hover links to change URLs, hover images to upload.
										All changes save to Supabase automatically.
									</p>

									<div className="flex gap-2">
										<a href="/admin/articles" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
											<Pencil className="size-3" />
											Articles
										</a>
										<a href="/admin/quotes" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
											<Mail className="size-3" />
											Quotes
										</a>
									</div>

									{editCount > 0 && (
										<div className="border rounded-lg p-2">
											<p className="text-xs text-slate-500">
												{editCount} edit{editCount !== 1 ? "s" : ""} saved
											</p>
										</div>
									)}

									<DangerZone />

									<Button onClick={onLogout} variant="outline" className="w-full">
										<LogOut className="size-4 mr-2" />
										Log Out
									</Button>
								</div>
							)}

							{activeTab === "sections" && (
								<div className="space-y-3">
									<p className="text-xs text-slate-500">
										Toggle visibility, reorder sections, and set background colors.
									</p>
									<SectionControlPanel />
								</div>
							)}

							{activeTab === "content-map" && (
								<ContentMapPanel />
							)}
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
