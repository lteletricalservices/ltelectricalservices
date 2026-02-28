import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	ArrowLeft,
	Plus,
	Pencil,
	Trash2,
	Loader2,
	ImageIcon,
	Upload,
	Save,
	X,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/lib/admin-context";
import {
	type Article,
	ARTICLES_KEY,
	parseArticles,
	generateSlug,
	generateArticleId,
} from "@/lib/articles-api";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/articles")({
	component: AdminArticlesPage,
});

const CATEGORY_OPTIONS = [
	"Sponsorship",
	"Community",
	"Guides",
	"News",
	"Projects",
	"Safety",
	"Other",
];

interface ArticleForm {
	title: string;
	category: string;
	intro: string;
	body: string;
	thumbnailUrl: string;
	heroImageUrl: string;
}

const EMPTY_FORM: ArticleForm = {
	title: "",
	category: "",
	intro: "",
	body: "",
	thumbnailUrl: "",
	heroImageUrl: "",
};

function AdminArticlesPage() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);
	const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
	const [thumbnailUploading, setThumbnailUploading] = useState(false);
	const [heroUploading, setHeroUploading] = useState(false);

	const articles = parseArticles(contentEdits);

	const saveArticles = useCallback(
		(updated: Article[]) => {
			// Sort newest first
			const sorted = [...updated].sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			handleContentSave(ARTICLES_KEY, JSON.stringify(sorted));
		},
		[handleContentSave],
	);

	const startCreate = () => {
		setForm(EMPTY_FORM);
		setCreating(true);
		setEditingId(null);
	};

	const startEdit = (article: Article) => {
		setForm({
			title: article.title,
			category: article.category,
			intro: article.intro,
			body: article.body,
			thumbnailUrl: article.thumbnailUrl ?? "",
			heroImageUrl: article.heroImageUrl ?? "",
		});
		setEditingId(article.id);
		setCreating(false);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setCreating(false);
		setForm(EMPTY_FORM);
	};

	const handleCreate = () => {
		if (!form.title.trim()) {
			toast.error("Title is required.");
			return;
		}
		const now = new Date().toISOString();
		const newArticle: Article = {
			id: generateArticleId(),
			title: form.title.trim(),
			slug: generateSlug(form.title.trim()),
			category: form.category || "News",
			intro: form.intro.trim(),
			body: form.body.trim(),
			thumbnailUrl: form.thumbnailUrl || null,
			heroImageUrl: form.heroImageUrl || null,
			createdAt: now,
			updatedAt: now,
		};
		saveArticles([...articles, newArticle]);
		toast.success("Article created.");
		cancelEdit();
	};

	const handleUpdate = () => {
		if (!editingId || !form.title.trim()) {
			toast.error("Title is required.");
			return;
		}
		const updated = articles.map((a) => {
			if (a.id !== editingId) return a;
			return {
				...a,
				title: form.title.trim(),
				slug: generateSlug(form.title.trim()),
				category: form.category || "News",
				intro: form.intro.trim(),
				body: form.body.trim(),
				thumbnailUrl: form.thumbnailUrl || null,
				heroImageUrl: form.heroImageUrl || null,
				updatedAt: new Date().toISOString(),
			};
		});
		saveArticles(updated);
		toast.success("Article updated.");
		cancelEdit();
	};

	const handleDelete = (id: string) => {
		saveArticles(articles.filter((a) => a.id !== id));
		toast.success("Article deleted.");
		setDeleteConfirmId(null);
	};

	const handleImageUpload = async (
		file: File,
		field: "thumbnailUrl" | "heroImageUrl",
		setUploading: (v: boolean) => void,
	) => {
		if (!file.type.startsWith("image/")) return;
		if (isCloudinaryConfigured()) {
			setUploading(true);
			try {
				const url = await uploadToCloudinary(file);
				setForm((prev) => ({ ...prev, [field]: url }));
			} catch {
				toast.error("Upload failed.");
			} finally {
				setUploading(false);
			}
		} else {
			const reader = new FileReader();
			reader.onload = (ev) => {
				setForm((prev) => ({ ...prev, [field]: ev.target?.result as string }));
			};
			reader.readAsDataURL(file);
		}
	};

	if (!isAdmin) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="max-w-md w-full">
					<CardContent className="text-center py-12">
						<p className="text-muted-foreground mb-4">
							You must be logged in as admin to view this page.
						</p>
						<Link to="/">
							<Button variant="outline">
								<ArrowLeft className="size-4" />
								Back to Homepage
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isFormOpen = creating || editingId !== null;

	return (
		<div className="min-h-screen bg-muted/30 py-8 px-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link to="/">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="size-4" />
								Back
							</Button>
						</Link>
						<h1 className="text-2xl font-bold">Article Management</h1>
						<span className="text-sm text-muted-foreground">
							{articles.length} article{articles.length !== 1 ? "s" : ""}
						</span>
					</div>
					{!isFormOpen && (
						<Button size="sm" onClick={startCreate}>
							<Plus className="size-4" />
							New Article
						</Button>
					)}
				</div>

				{/* Create / Edit Form */}
				{isFormOpen && (
					<Card>
						<CardHeader className="pb-4">
							<CardTitle className="text-lg">
								{creating ? "Create New Article" : "Edit Article"}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
								<Input
									value={form.title}
									onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
									placeholder="Article title"
								/>
								{form.title && (
									<p className="text-xs text-muted-foreground mt-1">
										Slug: {generateSlug(form.title)}
									</p>
								)}
							</div>

							<div>
								<label className="text-sm font-medium text-slate-700 mb-1 block">Category</label>
								<select
									value={form.category}
									onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
									className="w-full border rounded-md px-3 py-2 text-sm bg-background"
								>
									<option value="">Select category...</option>
									{CATEGORY_OPTIONS.map((cat) => (
										<option key={cat} value={cat}>{cat}</option>
									))}
								</select>
							</div>

							<div>
								<label className="text-sm font-medium text-slate-700 mb-1 block">Introduction</label>
								<Textarea
									value={form.intro}
									onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))}
									placeholder="Brief introduction shown in article cards..."
									rows={2}
								/>
							</div>

							<div>
								<label className="text-sm font-medium text-slate-700 mb-1 block">Body</label>
								<Textarea
									value={form.body}
									onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
									placeholder="Full article content. Use line breaks for paragraphs."
									rows={8}
								/>
							</div>

							{/* Thumbnail */}
							<div>
								<label className="text-sm font-medium text-slate-700 mb-1 block">Thumbnail Image</label>
								{form.thumbnailUrl ? (
									<div className="relative group/img w-48 rounded-lg overflow-hidden border">
										<img src={form.thumbnailUrl} alt="Thumbnail" className="w-full aspect-video object-cover" />
										<div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
											<button
												type="button"
												onClick={() => setForm((p) => ({ ...p, thumbnailUrl: "" }))}
												className="bg-red-600 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-1"
											>
												<Trash2 className="size-3" /> Remove
											</button>
										</div>
									</div>
								) : (
									<label className="cursor-pointer border-2 border-dashed rounded-lg p-4 flex items-center gap-2 text-sm text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition-colors w-48 justify-center">
										{thumbnailUploading ? (
											<><Loader2 className="size-4 animate-spin" /> Uploading...</>
										) : (
											<><Upload className="size-4" /> Upload thumbnail</>
										)}
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) handleImageUpload(file, "thumbnailUrl", setThumbnailUploading);
											}}
										/>
									</label>
								)}
							</div>

							{/* Hero Image */}
							<div>
								<label className="text-sm font-medium text-slate-700 mb-1 block">Hero Image (optional)</label>
								{form.heroImageUrl ? (
									<div className="relative group/img w-full max-w-md rounded-lg overflow-hidden border">
										<img src={form.heroImageUrl} alt="Hero" className="w-full aspect-video object-cover" />
										<div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
											<button
												type="button"
												onClick={() => setForm((p) => ({ ...p, heroImageUrl: "" }))}
												className="bg-red-600 text-white rounded-lg px-2 py-1 text-xs flex items-center gap-1"
											>
												<Trash2 className="size-3" /> Remove
											</button>
										</div>
									</div>
								) : (
									<label className="cursor-pointer border-2 border-dashed rounded-lg p-4 flex items-center gap-2 text-sm text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition-colors max-w-md justify-center">
										{heroUploading ? (
											<><Loader2 className="size-4 animate-spin" /> Uploading...</>
										) : (
											<><ImageIcon className="size-4" /> Upload hero image</>
										)}
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) handleImageUpload(file, "heroImageUrl", setHeroUploading);
											}}
										/>
									</label>
								)}
							</div>

							<div className="flex gap-2 pt-2">
								<Button onClick={creating ? handleCreate : handleUpdate}>
									<Save className="size-4" />
									{creating ? "Create Article" : "Save Changes"}
								</Button>
								<Button variant="outline" onClick={cancelEdit}>
									<X className="size-4" />
									Cancel
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Articles List */}
				{articles.length === 0 && !isFormOpen ? (
					<Card>
						<CardContent className="text-center py-16">
							<p className="text-muted-foreground mb-4">No articles yet. Create your first article.</p>
							<Button onClick={startCreate}>
								<Plus className="size-4" />
								New Article
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-3">
						{articles.map((article) => (
							<Card key={article.id} className={editingId === article.id ? "ring-2 ring-blue-500" : ""}>
								<CardContent className="py-4">
									<div className="flex items-start gap-4">
										{/* Thumbnail preview */}
										<div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
											{article.thumbnailUrl ? (
												<img
													src={article.thumbnailUrl}
													alt={article.title}
													className="w-full h-full object-cover"
													onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
												/>
											) : (
												<ImageIcon className="size-6 text-slate-300" />
											)}
										</div>

										{/* Article info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												{article.category && (
													<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
														{article.category}
													</span>
												)}
												<span className="text-xs text-muted-foreground">
													{new Date(article.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
												</span>
											</div>
											<h3 className="font-semibold text-slate-900 truncate">{article.title}</h3>
											{article.intro && (
												<p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{article.intro}</p>
											)}
											<p className="text-xs text-slate-400 mt-1">slug: {article.slug}</p>
										</div>

										{/* Actions */}
										<div className="flex gap-1 shrink-0">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => startEdit(article)}
												disabled={isFormOpen}
											>
												<Pencil className="size-4" />
											</Button>
											{deleteConfirmId === article.id ? (
												<div className="flex items-center gap-1">
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(article.id)}
													>
														Confirm
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setDeleteConfirmId(null)}
													>
														Cancel
													</Button>
												</div>
											) : (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setDeleteConfirmId(article.id)}
													disabled={isFormOpen}
													className="text-red-500 hover:text-red-600"
												>
													<Trash2 className="size-4" />
												</Button>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
