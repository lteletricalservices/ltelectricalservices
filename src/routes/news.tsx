import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Phone,
	Mail,
	MapPin,
	Shield,
	CheckCircle2,
	Zap,
	Building2,
	AlertCircle,
	ClipboardCheck,
	Users,
	Home,
	Plug,
	Heart,
	PawPrint,
	Trophy,
	ArrowLeft,
	ChevronRight,
	Upload,
	Trash2,
} from "lucide-react";
import { useAdmin, E, EditableLink, EditableColor, EditableImage } from "@/lib/admin-context";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const Route = createFileRoute("/news")({
	component: NewsPage,
});

type ArticleId = "rhys-irwin" | "eicr-guide" | "pat-testing" | "defibrillators";

const articles: {
	id: ArticleId;
	titleId: string;
	title: string;
	descId: string;
	description: string;
	category: string;
	categoryColor: string;
	iconBg: string;
	icon: React.ComponentType<{ className?: string }>;
}[] = [
	{
		id: "rhys-irwin",
		titleId: "news-card-rhys-title",
		title: "Proud Sponsors of Rhys Irwin's Championship Season",
		descId: "news-card-rhys-desc",
		description:
			"LT Electrical Services celebrates sponsoring Rhys Irwin and Performance15 Kawasaki's first SuperSport championship victory in 2025.",
		category: "Sponsorship",
		categoryColor: "bg-amber-100 text-amber-800",
		iconBg: "from-amber-100 to-amber-200",
		icon: Trophy,
	},
	{
		id: "defibrillators",
		titleId: "news-card-defib-title",
		title: "Supporting the Community: Free Defibrillator Installations in Pinchbeck",
		descId: "news-card-defib-desc",
		description:
			"How LT Electrical Services has supported local safety by installing defibrillators for community organisations.",
		category: "Community",
		categoryColor: "bg-red-100 text-red-800",
		iconBg: "from-red-100 to-red-200",
		icon: Heart,
	},
	{
		id: "eicr-guide",
		titleId: "news-card-eicr-title",
		title: "Do You Need an EICR in Lincolnshire?",
		descId: "news-card-eicr-desc",
		description:
			"A guide for landlords and homeowners across Spalding, Pinchbeck and surrounding areas.",
		category: "Guides",
		categoryColor: "bg-blue-100 text-blue-800",
		iconBg: "from-blue-100 to-blue-200",
		icon: ClipboardCheck,
	},
	{
		id: "pat-testing",
		titleId: "news-card-pat-title",
		title: "What Is PAT Testing and Does Your Business Need It?",
		descId: "news-card-pat-desc",
		description:
			"A simple guide to PAT testing for offices, shops, parish buildings and commercial properties.",
		category: "Guides",
		categoryColor: "bg-blue-100 text-blue-800",
		iconBg: "from-green-100 to-green-200",
		icon: Plug,
	},
];

function NewsPage() {
	const [activeArticle, setActiveArticle] = useState<ArticleId | null>(null);
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();

	if (activeArticle) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
				<header className="bg-slate-900 text-white py-4 sticky top-0 z-50 shadow-md">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
							<Zap className="size-8 text-blue-400" />
							<E id="news-header-brand" as="span" className="text-xl font-bold">LT Electrical Services</E>
						</Link>
						<div className="flex items-center gap-6">
							<EditableLink
								id="news-header-phone-link"
								defaultHref="tel:01775710743"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="flex items-center gap-2 hover:text-blue-400 transition-colors"
							>
								<Phone className="size-4" />
								<E id="news-header-phone" as="span" className="hidden sm:inline">01775 710743</E>
							</EditableLink>
							<Link to="/">
								<Button size="sm" className="bg-blue-600 hover:bg-blue-700">
									<E id="news-header-cta" as="span">Get Quote</E>
								</Button>
							</Link>
						</div>
					</div>
				</header>

				<div className="container mx-auto px-4 py-8 max-w-4xl">
					<button
						type="button"
						onClick={() => setActiveArticle(null)}
						className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium transition-colors"
					>
						<ArrowLeft className="size-4" />
						Back to all news
					</button>

					{activeArticle === "rhys-irwin" && <RhysIrwinArticle />}
					{activeArticle === "eicr-guide" && <EICRArticle />}
					{activeArticle === "pat-testing" && <PATTestingArticle />}
					{activeArticle === "defibrillators" && <DefibrillatorArticle />}
				</div>

				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<header className="bg-slate-900 text-white py-4 sticky top-0 z-50 shadow-md">
				<div className="container mx-auto px-4 flex justify-between items-center">
					<Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
						<Zap className="size-8 text-blue-400" />
						<E id="news-header-brand" as="span" className="text-xl font-bold">LT Electrical Services</E>
					</Link>
					<div className="flex items-center gap-6">
						<EditableLink
							id="news-header-phone-link"
							defaultHref="tel:01775710743"
							isAdmin={isAdmin}
							contentEdits={contentEdits}
							onSave={handleContentSave}
							className="flex items-center gap-2 hover:text-blue-400 transition-colors"
						>
							<Phone className="size-4" />
							<E id="news-header-phone" as="span" className="hidden sm:inline">01775 710743</E>
						</EditableLink>
						<Link to="/">
							<Button size="sm" className="bg-blue-600 hover:bg-blue-700">
								<E id="news-header-cta" as="span">Get Quote</E>
							</Button>
						</Link>
					</div>
				</div>
			</header>

			<section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16">
				<div className="container mx-auto px-4 text-center">
					<E id="news-hero-title" as="h1" className="text-4xl md:text-5xl font-bold mb-4">News & Guides</E>
					<E id="news-hero-subtitle" as="p" className="text-xl text-slate-300 max-w-2xl mx-auto">
						Articles, guides and community updates from LT Electrical Services
					</E>
				</div>
			</section>

			<section className="py-16">
				<div className="container mx-auto px-4 max-w-5xl">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{articles.map((article) => {
							const thumbnailKey = `articles.${article.id}.thumbnailUrl`;
							const thumbnailUrl = contentEdits[thumbnailKey];
							return (
								<Card
									key={article.id}
									className="hover:shadow-lg transition-shadow cursor-pointer group"
									onClick={(e) => {
										if ((e.target as HTMLElement).closest("[data-slot='thumbnail-admin']")) return;
										setActiveArticle(article.id);
									}}
								>
									{thumbnailUrl ? (
										<div className="relative group/img rounded-t-xl overflow-hidden">
											<img
												src={thumbnailUrl}
												alt={article.title}
												className="w-full aspect-video object-cover"
												onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
											/>
											{isAdmin && (
												<div data-slot="thumbnail-admin" className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															const input = document.getElementById(`thumb-input-${article.id}`) as HTMLInputElement;
															input?.click();
														}}
														className="bg-blue-600 text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg"
													>
														<Upload className="size-3" /> Replace
													</button>
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															handleContentSave(thumbnailKey, "");
														}}
														className="bg-red-600 text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg"
													>
														<Trash2 className="size-3" /> Remove
													</button>
													<input
														id={`thumb-input-${article.id}`}
														type="file"
														accept="image/*"
														className="hidden"
														onChange={async (e) => {
															const file = e.target.files?.[0];
															if (!file || !file.type.startsWith("image/")) return;
															if (isCloudinaryConfigured()) {
																try {
																	const url = await uploadToCloudinary(file);
																	handleContentSave(thumbnailKey, url);
																} catch (err) {
																	console.error("Thumbnail upload failed:", err);
																}
															} else {
																const reader = new FileReader();
																reader.onload = (ev) => {
																	handleContentSave(thumbnailKey, ev.target?.result as string);
																};
																reader.readAsDataURL(file);
															}
														}}
													/>
												</div>
											)}
										</div>
									) : (
										<div className="relative group/img rounded-t-xl overflow-hidden">
											<div className={`aspect-video bg-gradient-to-br ${article.iconBg} flex items-center justify-center`}>
												<article.icon className="size-20 text-slate-600 opacity-40 group-hover:opacity-60 transition-opacity" />
											</div>
											{isAdmin && (
												<div data-slot="thumbnail-admin" className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															const input = document.getElementById(`thumb-input-${article.id}`) as HTMLInputElement;
															input?.click();
														}}
														className="bg-blue-600 text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg"
													>
														<Upload className="size-3" /> Upload
													</button>
													<input
														id={`thumb-input-${article.id}`}
														type="file"
														accept="image/*"
														className="hidden"
														onChange={async (e) => {
															const file = e.target.files?.[0];
															if (!file || !file.type.startsWith("image/")) return;
															if (isCloudinaryConfigured()) {
																try {
																	const url = await uploadToCloudinary(file);
																	handleContentSave(thumbnailKey, url);
																} catch (err) {
																	console.error("Thumbnail upload failed:", err);
																}
															} else {
																const reader = new FileReader();
																reader.onload = (ev) => {
																	handleContentSave(thumbnailKey, ev.target?.result as string);
																};
																reader.readAsDataURL(file);
															}
														}}
													/>
												</div>
											)}
											{isAdmin && (
												<p className="absolute top-1 left-1 text-[10px] text-white bg-black/50 rounded px-1">Article thumbnail</p>
											)}
										</div>
									)}
									<CardHeader>
										<div className="flex items-center gap-2 mb-2">
											<span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${article.categoryColor}`}>
												{article.category}
											</span>
										</div>
										<CardTitle className="group-hover:text-blue-600 transition-colors">
											<E id={article.titleId} as="span">{article.title}</E>
										</CardTitle>
										<CardDescription>
											<E id={article.descId} as="span">{article.description}</E>
										</CardDescription>
									</CardHeader>
									<CardContent>
										<span className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
											Read article <ChevronRight className="size-4" />
										</span>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<EditableColor
				id="news-cta-bg"
				defaultColor="#2563eb"
				isAdmin={isAdmin}
				contentEdits={contentEdits}
				onSave={handleContentSave}
				className="py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
			>
				<div className="container mx-auto px-4 text-center">
					<E id="news-cta-title" as="h2" className="text-3xl md:text-4xl font-bold mb-4">Need a reliable electrician?</E>
					<E id="news-cta-subtitle" as="p" className="text-xl mb-6">Get your free quote today</E>
					<Link to="/">
						<Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8">
							<E id="news-cta-btn" as="span">Request Free Quote</E>
						</Button>
					</Link>
				</div>
			</EditableColor>

			<Footer />
		</div>
	);
}

function RhysIrwinArticle() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();

	return (
		<article className="prose prose-lg max-w-none">
			<E id="news-rhys-title" as="h1" className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
				Proud Sponsors of Rhys Irwin's Championship Season
			</E>
			<E id="news-rhys-subtitle" as="p" className="text-lg text-slate-600 mb-8" multiline>
				LT Electrical Services celebrates sponsoring Rhys Irwin and Performance15 Kawasaki's first SuperSport championship victory in 2025 after years of heartbreak for Team Principle Michael Biddulph.
			</E>

			<EditableImage
				id="news-rhys-image"
				alt="Rhys Irwin Championship"
				isAdmin={isAdmin}
				contentEdits={contentEdits}
				onSave={handleContentSave}
				optional
				label="Article image"
				className="w-full rounded-lg object-cover max-h-64"
				wrapperClassName="w-full rounded-lg overflow-hidden mb-4"
			/>
			{contentEdits["news-rhys-image"] && (
				<E id="news-rhys-caption" as="p" className="text-sm text-slate-500 italic text-center mb-6">Image caption (click to edit)</E>
			)}

			<div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
				<div className="flex items-start gap-3">
					<Trophy className="size-6 text-amber-500 shrink-0 mt-1" />
					<div>
						<E id="news-rhys-contact-title" as="h3" className="font-semibold text-base text-slate-900 mb-2">Quick Contact</E>
						<E id="news-rhys-contact-desc" as="p" className="text-sm text-slate-700 mb-2">Want to talk about sponsorship or electrical work? Get in touch.</E>
						<div className="flex flex-col gap-1 text-sm text-slate-700">
							<EditableLink
								id="news-rhys-phone-link"
								defaultHref="tel:01775710743"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="flex items-center gap-2 hover:text-blue-600"
							>
								<Phone className="size-3" />
								<E id="news-rhys-phone" as="span">01775 710743</E>
							</EditableLink>
							<EditableLink
								id="news-rhys-email-link"
								defaultHref="mailto:admin@ltelectricalservices.co.uk"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="flex items-center gap-2 hover:text-blue-600"
							>
								<Mail className="size-3" />
								<E id="news-rhys-email" as="span">admin@ltelectricalservices.co.uk</E>
							</EditableLink>
						</div>
					</div>
				</div>
			</div>

			<E id="news-rhys-p1" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
				At LT Electrical Services, we're proud to support local talent and teams who share the same values of hard work, determination and community spirit.
			</E>

			<E id="news-rhys-p2" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
				That's why we were honoured to sponsor Rhys Irwin as part of the Performance15 Kawasaki team. As a life-long fan of motorcycle racing, Lee is extremely proud to have been commissioned by local motorcycling legend Ben Wilson to carry out electrical installations and maintenance on the team's tour bus and garage since 2015.
			</E>

			<E id="news-rhys-h2-champ" as="h2" className="text-2xl font-bold text-slate-900 mt-8">A championship built on determination</E>

			<E id="news-rhys-p3" as="p" className="text-base text-slate-700">
				In 2025, the team achieved something truly special:
			</E>

			<div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 my-6">
				<div className="flex items-center gap-4">
					<Trophy className="size-12 text-amber-500 shrink-0" />
					<div>
						<E id="news-rhys-champ-headline" as="h3" className="text-xl font-bold text-slate-900">Their first SuperSport championship victory.</E>
						<E id="news-rhys-champ-sub" as="p" className="text-sm text-slate-600 mt-1">Performance15 Kawasaki - 2025 SuperSport Champions</E>
					</div>
				</div>
			</div>

			<E id="news-rhys-p4" as="p" className="text-base text-slate-700" multiline>
				It was a moment that meant much more than a trophy. The team had faced years of struggle and challenges as Gearlink Kawasaki, but never lost faith.
			</E>

			<E id="news-rhys-h2-norma" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Racing in memory of Norma</E>

			<E id="news-rhys-p5" as="p" className="text-base text-slate-700" multiline>
				The victory was especially emotional as it came in memory of Norma Biddulph, who co-founded the team with her husband Michael.
			</E>

			<E id="news-rhys-p6" as="p" className="text-base text-slate-700" multiline>
				Her passion, support and belief in the team were at the heart of everything they did. The championship win was a tribute to her legacy and the perseverance she inspired.
			</E>

			<div className="bg-slate-50 border rounded-lg p-4 my-6">
				<div className="flex items-start gap-3">
					<Heart className="size-6 text-red-500 shrink-0 mt-1" />
					<E id="news-rhys-pitwalk" as="p" className="text-base text-slate-700" multiline>
						Jubilant scenes can be found all over YouTube where Michael made the pit walk from the team's garage to the winner's podium. Rival team members stood outside their garages, enthusiastically clapping a clearly emotional Michael, showing that no matter how competitive things are on the track, the motorcycle racing community come together off it.
					</E>
				</div>
			</div>

			<E id="news-rhys-h2-local" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Supporting local success</E>

			<E id="news-rhys-p7" as="p" className="text-base text-slate-700" multiline>
				We're proud to have played a small part in that incredible journey by supporting Gearlink, Performance15, Michael Biddulph, Ben Wilson and Rhys Irwin during such an important season.
			</E>

			<E id="news-rhys-p8" as="p" className="text-base text-slate-700">At LT Electrical Services, we believe in:</E>

			<ul className="space-y-3 my-4">
				<li className="flex items-start gap-3">
					<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
					<E id="news-rhys-value1" as="span" className="text-base text-slate-700 font-medium">Supporting local people</E>
				</li>
				<li className="flex items-start gap-3">
					<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
					<E id="news-rhys-value2" as="span" className="text-base text-slate-700 font-medium">Backing hard work and dedication</E>
				</li>
				<li className="flex items-start gap-3">
					<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
					<E id="news-rhys-value3" as="span" className="text-base text-slate-700 font-medium">Being part of the community beyond just our trade</E>
				</li>
			</ul>

			<E id="news-rhys-h2-more" as="h2" className="text-2xl font-bold text-slate-900 mt-8">More than just electrical work</E>

			<E id="news-rhys-p9" as="p" className="text-base text-slate-700" multiline>
				Whether it's sponsoring local talent, installing community defibrillators for free or supporting local animal welfare organisations, we believe businesses should give back wherever possible.
			</E>

			<E id="news-rhys-p10" as="p" className="text-base text-slate-700">
				It's all part of being a local, trusted electrician.
			</E>

			<EditableColor
				id="news-rhys-cta-bg"
				defaultColor="#2563eb"
				isAdmin={isAdmin}
				contentEdits={contentEdits}
				onSave={handleContentSave}
				className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8"
			>
				<E id="news-rhys-cta-title" as="h3" className="text-xl font-bold mb-2">Get in touch</E>
				<E id="news-rhys-cta-desc" as="p" className="text-sm mb-4" multiline>
					Whether you need electrical work or want to discuss a sponsorship opportunity, we'd love to hear from you.
				</E>
				<div className="flex flex-col sm:flex-row gap-3">
					<EditableLink
						id="news-rhys-cta-phone"
						defaultHref="tel:01775710743"
						isAdmin={isAdmin}
						contentEdits={contentEdits}
						onSave={handleContentSave}
						className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
					>
						<Phone className="size-4" />
						<E id="news-rhys-cta-phone-text" as="span">Call: 01775 710743</E>
					</EditableLink>
					<EditableLink
						id="news-rhys-cta-email"
						defaultHref="mailto:admin@ltelectricalservices.co.uk"
						isAdmin={isAdmin}
						contentEdits={contentEdits}
						onSave={handleContentSave}
						className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
					>
						<Mail className="size-4" />
						<E id="news-rhys-cta-email-text" as="span">Email Us</E>
					</EditableLink>
				</div>
			</EditableColor>
		</article>
	);
}

function EICRArticle() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();

	return (
		<article className="prose prose-lg max-w-none">
			<E id="news-eicr-title" as="h1" className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
				Do You Need an EICR in Lincolnshire?
			</E>
			<E id="news-eicr-subtitle" as="p" className="text-lg text-slate-600 mb-8">
				A guide for landlords and homeowners across Spalding, Pinchbeck and surrounding areas.
			</E>

			<div className="space-y-6">
				<EditableImage
					id="news-eicr-image"
					alt="EICR Testing"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					optional
					label="Article image"
					className="w-full rounded-lg object-cover max-h-64"
					wrapperClassName="w-full rounded-lg overflow-hidden"
				/>
				{contentEdits["news-eicr-image"] && (
					<E id="news-eicr-caption" as="p" className="text-sm text-slate-500 italic text-center -mt-4">Image caption (click to edit)</E>
				)}
				<E id="news-eicr-intro1" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					Electrical safety is something many property owners don't think about until there's a problem. An Electrical Installation Condition Report (EICR) is designed to identify issues before they become dangerous or expensive.
				</E>

				<E id="news-eicr-intro2" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					At LT Electrical Services, we carry out EICRs for landlords, homeowners, businesses and parish properties across Spalding, Pinchbeck, Bourne, Holbeach, Market Deeping and surrounding areas.
				</E>

				<div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
					<div className="flex items-start gap-3">
						<ClipboardCheck className="size-6 text-blue-600 shrink-0 mt-1" />
						<div>
							<E id="news-eicr-contact-title" as="h3" className="font-semibold text-base text-slate-900 mb-2">Quick Contact</E>
							<E id="news-eicr-contact-desc" as="p" className="text-sm text-slate-700 mb-2">Need an EICR? Get in touch today.</E>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<EditableLink
									id="news-eicr-phone-link"
									defaultHref="tel:01775710743"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="flex items-center gap-2 hover:text-blue-600"
								>
									<Phone className="size-3" />
									<E id="news-eicr-phone" as="span">01775 710743</E>
								</EditableLink>
								<EditableLink
									id="news-eicr-email-link"
									defaultHref="mailto:admin@ltelectricalservices.co.uk"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="flex items-center gap-2 hover:text-blue-600"
								>
									<Mail className="size-3" />
									<E id="news-eicr-email" as="span">admin@ltelectricalservices.co.uk</E>
								</EditableLink>
							</div>
						</div>
					</div>
				</div>

				<E id="news-eicr-h2-what" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What is an EICR?</E>
				<E id="news-eicr-what-intro" as="p" className="text-base text-slate-700">
					An EICR is a formal inspection of the electrical systems in a property. It checks:
				</E>

				<ul className="space-y-2">
					{["Wiring condition", "Consumer unit safety", "Earthing and bonding", "Sockets, switches and fittings", "Potential fire or shock risks"].map((item, i) => (
						<li key={item} className="flex items-start gap-2">
							<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
							<E id={`news-eicr-check-${i}`} as="span" className="text-base text-slate-700">{item}</E>
						</li>
					))}
				</ul>

				<E id="news-eicr-result-intro" as="p" className="text-base text-slate-700">
					At the end of the inspection, you receive a report showing whether the installation is:
				</E>

				<div className="grid md:grid-cols-2 gap-3">
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<CheckCircle2 className="size-5 text-green-600" />
							<E id="news-eicr-sat-title" as="h3" className="font-semibold text-base text-slate-900">Satisfactory</E>
						</div>
						<E id="news-eicr-sat-desc" as="p" className="text-sm text-slate-700">Your electrical installation is safe and compliant</E>
					</div>
					<div className="border-2 border-orange-200 bg-orange-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<AlertCircle className="size-5 text-orange-600" />
							<E id="news-eicr-unsat-title" as="h3" className="font-semibold text-base text-slate-900">Unsatisfactory</E>
						</div>
						<E id="news-eicr-unsat-desc" as="p" className="text-sm text-slate-700">Recommended actions and repairs are needed</E>
					</div>
				</div>

				<E id="news-eicr-h2-who" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Who needs an EICR?</E>

				<div className="space-y-4">
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Users className="size-8 text-blue-600 shrink-0" />
							<div>
								<E id="news-eicr-landlord-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Landlords</E>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="news-eicr-landlord-1" as="span" className="text-sm text-slate-700">Required by law to have a valid EICR</E>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="news-eicr-landlord-2" as="span" className="text-sm text-slate-700">Must be renewed every 5 years or at change of tenancy</E>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Home className="size-8 text-blue-600 shrink-0" />
							<div>
								<E id="news-eicr-homeowner-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Homeowners</E>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="news-eicr-homeowner-1" as="span" className="text-sm text-slate-700">Recommended every 10 years</E>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="news-eicr-homeowner-2" as="span" className="text-sm text-slate-700">Essential when buying or selling a property</E>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Building2 className="size-8 text-blue-600 shrink-0" />
							<div>
								<E id="news-eicr-business-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Businesses</E>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="news-eicr-business-1" as="span" className="text-sm text-slate-700">Required as part of health and safety compliance</E>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="news-eicr-business-2" as="span" className="text-sm text-slate-700">Frequency depends on the type of premises</E>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<E id="news-eicr-h2-inspect" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What happens during the inspection?</E>
				<E id="news-eicr-inspect-intro" as="p" className="text-base text-slate-700">Our qualified 2391 electrician will:</E>

				<div className="bg-slate-50 rounded-lg p-4 space-y-3">
					{[
						{ step: "1", titleId: "news-eicr-step1-title", title: "Visually inspect the installation", descId: "news-eicr-step1-desc", desc: "Check all visible electrical components" },
						{ step: "2", titleId: "news-eicr-step2-title", title: "Carry out electrical tests", descId: "news-eicr-step2-desc", desc: "Test circuits, earthing, and protection devices" },
						{ step: "3", titleId: "news-eicr-step3-title", title: "Identify any faults or risks", descId: "news-eicr-step3-desc", desc: "Highlight safety hazards" },
						{ step: "4", titleId: "news-eicr-step4-title", title: "Provide a full written report", descId: "news-eicr-step4-desc", desc: "Detailed documentation of findings" },
					].map((item) => (
						<div key={item.step} className="flex items-start gap-2">
							<span className="flex items-center justify-center size-6 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0">{item.step}</span>
							<div>
								<E id={item.titleId} as="h4" className="font-semibold text-sm text-slate-900">{item.title}</E>
								<E id={item.descId} as="p" className="text-sm text-slate-700">{item.desc}</E>
							</div>
						</div>
					))}
				</div>

				<E id="news-eicr-explain" as="p" className="text-base text-slate-700" multiline>
					We always explain the findings clearly and provide honest advice on any remedial work.
				</E>

				<E id="news-eicr-h2-why" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Why choose LT Electrical Services?</E>
				<div className="grid md:grid-cols-2 gap-3">
					{[
						{ icon: Shield, color: "text-blue-600", titleId: "news-eicr-why1-title", title: "NAPIT registered electricians", descId: "news-eicr-why1-desc", desc: "Certified professionals you can trust" },
						{ icon: CheckCircle2, color: "text-green-600", titleId: "news-eicr-why2-title", title: "Government TrustMark approved", descId: "news-eicr-why2-desc", desc: "Recognized for quality" },
						{ icon: ClipboardCheck, color: "text-blue-600", titleId: "news-eicr-why3-title", title: "2391 qualified for testing", descId: "news-eicr-why3-desc", desc: "Specialist qualifications" },
						{ icon: Users, color: "text-blue-600", titleId: "news-eicr-why4-title", title: "Trusted by councils", descId: "news-eicr-why4-desc", desc: "Serving councils and businesses" },
					].map((item) => (
						<div key={item.titleId} className="flex items-start gap-2">
							<item.icon className={`size-5 ${item.color} shrink-0 mt-0.5`} />
							<div>
								<E id={item.titleId} as="h4" className="font-semibold text-sm text-slate-900">{item.title}</E>
								<E id={item.descId} as="p" className="text-xs text-slate-700">{item.desc}</E>
							</div>
						</div>
					))}
				</div>

				<EditableColor
					id="news-eicr-cta-bg"
					defaultColor="#2563eb"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8"
				>
					<E id="news-eicr-cta-title" as="h3" className="text-xl font-bold mb-2">Book your EICR</E>
					<E id="news-eicr-cta-desc" as="p" className="text-sm mb-4" multiline>
						Get in touch for an EICR in Spalding, Pinchbeck or surrounding areas.
					</E>
					<div className="flex flex-col sm:flex-row gap-3">
						<EditableLink
							id="news-eicr-cta-phone"
							defaultHref="tel:01775710743"
							isAdmin={isAdmin}
							contentEdits={contentEdits}
							onSave={handleContentSave}
							className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
						>
							<Phone className="size-4" />
							<E id="news-eicr-cta-phone-text" as="span">Call: 01775 710743</E>
						</EditableLink>
						<EditableLink
							id="news-eicr-cta-email"
							defaultHref="mailto:admin@ltelectricalservices.co.uk"
							isAdmin={isAdmin}
							contentEdits={contentEdits}
							onSave={handleContentSave}
							className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
						>
							<Mail className="size-4" />
							<E id="news-eicr-cta-email-text" as="span">Email Us</E>
						</EditableLink>
					</div>
				</EditableColor>
			</div>
		</article>
	);
}

function PATTestingArticle() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();

	return (
		<article className="prose prose-lg max-w-none">
			<E id="news-pat-title" as="h1" className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
				What Is PAT Testing and Does Your Business Need It?
			</E>
			<E id="news-pat-subtitle" as="p" className="text-lg text-slate-600 mb-8" multiline>
				A simple guide to PAT testing for offices, shops, parish buildings and commercial properties in Spalding and surrounding areas.
			</E>

			<div className="space-y-6">
				<EditableImage
					id="news-pat-image"
					alt="PAT Testing"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					optional
					label="Article image"
					className="w-full rounded-lg object-cover max-h-64"
					wrapperClassName="w-full rounded-lg overflow-hidden"
				/>
				{contentEdits["news-pat-image"] && (
					<E id="news-pat-caption" as="p" className="text-sm text-slate-500 italic text-center -mt-4">Image caption (click to edit)</E>
				)}
				<E id="news-pat-intro1" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					If you run a business, office, shop or community building, you're responsible for making sure electrical equipment is safe. One of the simplest ways to do this is through PAT testing.
				</E>

				<E id="news-pat-intro2" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					LT Electrical Services provides professional PAT testing across Lincolnshire and Cambridgeshire working with businesses, parish councils, and commercial clients.
				</E>

				<div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
					<div className="flex items-start gap-3">
						<Plug className="size-6 text-blue-600 shrink-0 mt-1" />
						<div>
							<E id="news-pat-contact-title" as="h3" className="font-semibold text-base text-slate-900 mb-2">Quick Contact</E>
							<E id="news-pat-contact-desc" as="p" className="text-sm text-slate-700 mb-2">Need PAT testing? Get in touch today.</E>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<EditableLink
									id="news-pat-phone-link"
									defaultHref="tel:01775710743"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="flex items-center gap-2 hover:text-blue-600"
								>
									<Phone className="size-3" />
									<E id="news-pat-phone" as="span">01775 710743</E>
								</EditableLink>
								<EditableLink
									id="news-pat-email-link"
									defaultHref="mailto:admin@ltelectricalservices.co.uk"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="flex items-center gap-2 hover:text-blue-600"
								>
									<Mail className="size-3" />
									<E id="news-pat-email" as="span">admin@ltelectricalservices.co.uk</E>
								</EditableLink>
							</div>
						</div>
					</div>
				</div>

				<E id="news-pat-h2-what" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What is PAT testing?</E>
				<E id="news-pat-what-intro" as="p" className="text-base text-slate-700" multiline>
					PAT stands for Portable Appliance Testing. It involves checking electrical appliances to make sure they are safe to use.
				</E>
				<E id="news-pat-includes" as="p" className="text-base text-slate-700">This includes items such as:</E>

				<ul className="space-y-2">
					{["Kettles", "Computers", "Extension leads", "Power tools", "Printers", "Kitchen appliances", "Heaters"].map((item, i) => (
						<li key={item} className="flex items-start gap-2">
							<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
							<E id={`news-pat-item-${i}`} as="span" className="text-base text-slate-700">{item}</E>
						</li>
					))}
				</ul>

				<E id="news-pat-h2-legal" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Is PAT testing a legal requirement?</E>
				<E id="news-pat-legal-intro" as="p" className="text-base text-slate-700" multiline>
					PAT testing itself is not specifically required by law, but the law does require all electrical equipment to be safe.
				</E>
				<E id="news-pat-legal-falls" as="p" className="text-base text-slate-700">For businesses, this falls under:</E>

				<ul className="space-y-2">
					<li className="flex items-start gap-2">
						<Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<E id="news-pat-law1" as="span" className="text-base text-slate-700">Health and Safety at Work Act</E>
					</li>
					<li className="flex items-start gap-2">
						<Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<E id="news-pat-law2" as="span" className="text-base text-slate-700">Electricity at Work Regulations</E>
					</li>
				</ul>

				<E id="news-pat-legal-conclusion" as="p" className="text-base text-slate-700">
					PAT testing is the easiest way to prove you are meeting these responsibilities.
				</E>

				<E id="news-pat-h2-frequency" as="h2" className="text-2xl font-bold text-slate-900 mt-8">How often should PAT testing be done?</E>
				<E id="news-pat-freq-intro" as="p" className="text-base text-slate-700">This depends on the environment:</E>

				<div className="overflow-hidden rounded-lg border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-slate-100">
								<th className="text-left p-3 font-semibold text-slate-900">Environment</th>
								<th className="text-left p-3 font-semibold text-slate-900">Suggested Frequency</th>
							</tr>
						</thead>
						<tbody>
							{[
								{ env: "Offices", freq: "Every 2\u20134 years", envId: "news-pat-env0", freqId: "news-pat-freq0" },
								{ env: "Shops", freq: "Every 1\u20132 years", envId: "news-pat-env1", freqId: "news-pat-freq1" },
								{ env: "Construction sites", freq: "Every 3\u20136 months", envId: "news-pat-env2", freqId: "news-pat-freq2" },
								{ env: "Community buildings", freq: "Every 1\u20132 years", envId: "news-pat-env3", freqId: "news-pat-freq3" },
							].map((row, i) => (
								<tr key={row.envId} className={`border-t ${i % 2 === 1 ? "bg-slate-50" : ""}`}>
									<td className="p-3 text-slate-700"><E id={row.envId} as="span">{row.env}</E></td>
									<td className="p-3 text-slate-700"><E id={row.freqId} as="span">{row.freq}</E></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<E id="news-pat-freq-advise" as="p" className="text-base text-slate-700">
					We can advise the correct schedule for your premises.
				</E>

				<E id="news-pat-h2-receive" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What you receive</E>
				<E id="news-pat-receive-intro" as="p" className="text-base text-slate-700">After testing, you'll receive:</E>

				<div className="grid md:grid-cols-2 gap-3">
					{[
						{ icon: CheckCircle2, titleId: "news-pat-recv1-title", title: "Appliance labels", descId: "news-pat-recv1-desc", desc: "Clear pass/fail labels on every tested appliance" },
						{ icon: ClipboardCheck, titleId: "news-pat-recv2-title", title: "Full test report", descId: "news-pat-recv2-desc", desc: "Comprehensive documentation of all tests performed" },
						{ icon: AlertCircle, titleId: "news-pat-recv3-title", title: "Pass/fail results", descId: "news-pat-recv3-desc", desc: "Clear outcome for each appliance tested" },
						{ icon: Shield, titleId: "news-pat-recv4-title", title: "Compliance record", descId: "news-pat-recv4-desc", desc: "For insurance or inspection purposes" },
					].map((item) => (
						<div key={item.titleId} className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
							<div className="flex items-center gap-2 mb-1">
								<item.icon className="size-5 text-green-600" />
								<E id={item.titleId} as="h3" className="font-semibold text-base text-slate-900">{item.title}</E>
							</div>
							<E id={item.descId} as="p" className="text-sm text-slate-700">{item.desc}</E>
						</div>
					))}
				</div>

				<E id="news-pat-h2-trusted" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Trusted by local organisations</E>
				<E id="news-pat-trusted-intro" as="p" className="text-base text-slate-700">We carry out work for:</E>

				<div className="space-y-4">
					{[
						{ icon: Users, labelId: "news-pat-org1", label: "Parish councils" },
						{ icon: Building2, labelId: "news-pat-org2", label: "Commercial clients" },
						{ icon: Home, labelId: "news-pat-org3", label: "Retail premises" },
						{ icon: Users, labelId: "news-pat-org4", label: "Community buildings" },
					].map((item) => (
						<div key={item.labelId} className="flex items-center gap-3 border rounded-lg p-3">
							<item.icon className="size-6 text-blue-600 shrink-0" />
							<E id={item.labelId} as="span" className="text-base text-slate-700 font-medium">{item.label}</E>
						</div>
					))}
				</div>

				<E id="news-pat-clients" as="p" className="text-base text-slate-700" multiline>
					Including clients such as KFC Spalding, YMCA Peterborough and local parish organisations.
				</E>

				<EditableColor
					id="news-pat-cta-bg"
					defaultColor="#2563eb"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8"
				>
					<E id="news-pat-cta-title" as="h3" className="text-xl font-bold mb-2">Book PAT testing</E>
					<E id="news-pat-cta-desc" as="p" className="text-sm mb-4" multiline>
						Contact us today for reliable and efficient PAT testing across Spalding, Pinchbeck and surrounding areas.
					</E>
					<div className="flex flex-col sm:flex-row gap-3">
						<EditableLink
							id="news-pat-cta-phone"
							defaultHref="tel:01775710743"
							isAdmin={isAdmin}
							contentEdits={contentEdits}
							onSave={handleContentSave}
							className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
						>
							<Phone className="size-4" />
							<E id="news-pat-cta-phone-text" as="span">Call: 01775 710743</E>
						</EditableLink>
						<EditableLink
							id="news-pat-cta-email"
							defaultHref="mailto:admin@ltelectricalservices.co.uk"
							isAdmin={isAdmin}
							contentEdits={contentEdits}
							onSave={handleContentSave}
							className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
						>
							<Mail className="size-4" />
							<E id="news-pat-cta-email-text" as="span">Email Us</E>
						</EditableLink>
					</div>
				</EditableColor>
			</div>
		</article>
	);
}

function DefibrillatorArticle() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();

	return (
		<article className="prose prose-lg max-w-none">
			<E id="news-defib-title" as="h1" className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
				Supporting the Community: Free Defibrillator Installations in Pinchbeck
			</E>
			<E id="news-defib-subtitle" as="p" className="text-lg text-slate-600 mb-8" multiline>
				How LT Electrical Services has supported local safety by installing defibrillators for community organisations in Pinchbeck and the surrounding area.
			</E>

			<div className="space-y-6">
				<EditableImage
					id="news-defib-image"
					alt="Community Defibrillator"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					optional
					label="Article image"
					className="w-full rounded-lg object-cover max-h-64"
					wrapperClassName="w-full rounded-lg overflow-hidden"
				/>
				{contentEdits["news-defib-image"] && (
					<E id="news-defib-caption" as="p" className="text-sm text-slate-500 italic text-center -mt-4">Image caption (click to edit)</E>
				)}
				<E id="news-defib-intro1" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					At LT Electrical Services, we believe being part of the community means more than just carrying out electrical work. It means giving something back.
				</E>

				<E id="news-defib-intro2" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					Over the years, we've been proud to install defibrillators free of charge for local organisations to help improve public safety.
				</E>

				<div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
					<div className="flex items-start gap-3">
						<Heart className="size-6 text-red-500 shrink-0 mt-1" />
						<div>
							<E id="news-defib-contact-title" as="h3" className="font-semibold text-base text-slate-900 mb-2">Quick Contact</E>
							<E id="news-defib-contact-desc" as="p" className="text-sm text-slate-700 mb-2">Want to discuss a defibrillator installation? Get in touch.</E>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<EditableLink
									id="news-defib-phone-link"
									defaultHref="tel:01775710743"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="flex items-center gap-2 hover:text-blue-600"
								>
									<Phone className="size-3" />
									<E id="news-defib-phone" as="span">01775 710743</E>
								</EditableLink>
								<EditableLink
									id="news-defib-email-link"
									defaultHref="mailto:admin@ltelectricalservices.co.uk"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="flex items-center gap-2 hover:text-blue-600"
								>
									<Mail className="size-3" />
									<E id="news-defib-email" as="span">admin@ltelectricalservices.co.uk</E>
								</EditableLink>
							</div>
						</div>
					</div>
				</div>

				<E id="news-defib-h2-support" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Supporting local organisations</E>
				<E id="news-defib-support-intro" as="p" className="text-base text-slate-700">
					We have provided free defibrillator installations for:
				</E>

				<div className="space-y-4">
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Users className="size-8 text-red-500 shrink-0" />
							<div>
								<E id="news-defib-org1" as="h3" className="font-semibold text-lg text-slate-900">YMCA Trinity Group</E>
							</div>
						</div>
					</div>
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Home className="size-8 text-red-500 shrink-0" />
							<div>
								<E id="news-defib-org2" as="h3" className="font-semibold text-lg text-slate-900">St Mary's Church Hall, Pinchbeck</E>
							</div>
						</div>
					</div>
				</div>

				<E id="news-defib-ensure" as="p" className="text-base text-slate-700" multiline>
					These installations ensure that life-saving equipment is available in the event of a cardiac emergency.
				</E>

				<E id="news-defib-h2-why" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Why defibrillators matter</E>
				<E id="news-defib-why-intro" as="p" className="text-base text-slate-700">
					When someone suffers a cardiac arrest:
				</E>

				<ul className="space-y-2">
					<li className="flex items-start gap-2">
						<AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
						<E id="news-defib-fact1" as="span" className="text-base text-slate-700">Every minute without treatment reduces survival chances</E>
					</li>
					<li className="flex items-start gap-2">
						<Heart className="size-5 text-red-500 shrink-0 mt-0.5" />
						<E id="news-defib-fact2" as="span" className="text-base text-slate-700">A defibrillator can dramatically increase survival rates</E>
					</li>
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<E id="news-defib-fact3" as="span" className="text-base text-slate-700">Community access to defibrillators saves lives</E>
					</li>
				</ul>

				<E id="news-defib-safer" as="p" className="text-base text-slate-700" multiline>
					By installing these units, we're helping create a safer environment for everyone.
				</E>

				<E id="news-defib-h2-rooted" as="h2" className="text-2xl font-bold text-slate-900 mt-8">A business rooted in the community</E>
				<E id="news-defib-rooted-intro" as="p" className="text-base text-slate-700">
					We're proud to work with and support:
				</E>

				<div className="space-y-4">
					{[
						{ icon: Users, labelId: "news-defib-comm1", label: "Pinchbeck Parish" },
						{ icon: Users, labelId: "news-defib-comm2", label: "Gosberton Parish" },
						{ icon: Building2, labelId: "news-defib-comm3", label: "YMCA Peterborough" },
						{ icon: Heart, labelId: "news-defib-comm4", label: "Local charities and community groups" },
					].map((item) => (
						<div key={item.labelId} className="flex items-center gap-3 border rounded-lg p-3">
							<item.icon className="size-6 text-blue-600 shrink-0" />
							<E id={item.labelId} as="span" className="text-base text-slate-700 font-medium">{item.label}</E>
						</div>
					))}
				</div>

				<div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mt-6">
					<div className="flex items-start gap-3">
						<PawPrint className="size-8 text-purple-600 shrink-0" />
						<div>
							<E id="news-defib-animal-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Supporting animal welfare</E>
							<E id="news-defib-animal-desc" as="p" className="text-base text-slate-700" multiline>
								As fervent animal lovers, we have also supported Peterborough Cats Protection by wiring their cat runs and donating food and blankets.
							</E>
						</div>
					</div>
				</div>

				<E id="news-defib-h2-looking" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Looking after the community we serve</E>
				<E id="news-defib-looking1" as="p" className="text-base text-slate-700" multiline>
					Our work takes us into homes, businesses and community spaces every day. Supporting local causes is simply part of our ethos.
				</E>

				<E id="news-defib-looking2" as="p" className="text-base text-slate-700" multiline>
					If your organisation is considering donating or installing a defibrillator, we're always happy to offer advice.
				</E>

				<EditableColor
					id="news-defib-cta-bg"
					defaultColor="#2563eb"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8"
				>
					<E id="news-defib-cta-title" as="h3" className="text-xl font-bold mb-2">Get in touch</E>
					<E id="news-defib-cta-desc" as="p" className="text-sm mb-4" multiline>
						Whether you need electrical work or want to discuss a community defibrillator installation, we'd love to hear from you.
					</E>
					<div className="flex flex-col sm:flex-row gap-3">
						<EditableLink
							id="news-defib-cta-phone"
							defaultHref="tel:01775710743"
							isAdmin={isAdmin}
							contentEdits={contentEdits}
							onSave={handleContentSave}
							className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
						>
							<Phone className="size-4" />
							<E id="news-defib-cta-phone-text" as="span">Call: 01775 710743</E>
						</EditableLink>
						<EditableLink
							id="news-defib-cta-email"
							defaultHref="mailto:admin@ltelectricalservices.co.uk"
							isAdmin={isAdmin}
							contentEdits={contentEdits}
							onSave={handleContentSave}
							className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
						>
							<Mail className="size-4" />
							<E id="news-defib-cta-email-text" as="span">Email Us</E>
						</EditableLink>
					</div>
				</EditableColor>
			</div>
		</article>
	);
}

function Footer() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();

	return (
		<footer className="bg-slate-900 text-white py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
						<Link to="/" className="flex items-center gap-2 mb-4 hover:text-blue-400 transition-colors">
							<Zap className="size-8 text-blue-400" />
							<E id="news-footer-brand" as="span" className="text-xl font-bold">LT Electrical</E>
						</Link>
						<E id="news-footer-desc" as="p" className="text-slate-400" multiline>
							Professional electrical services across Lincolnshire and Cambridgeshire
						</E>
					</div>
					<div>
						<E id="news-footer-contact-title" as="h3" className="font-semibold mb-4">Contact</E>
						<div className="space-y-2 text-slate-400">
							<div className="flex items-center gap-2">
								<Phone className="size-4" />
								<EditableLink
									id="news-footer-phone-link"
									defaultHref="tel:01775710743"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="hover:text-white transition-colors"
								>
									<E id="news-footer-phone" as="span">01775 710743</E>
								</EditableLink>
							</div>
							<div className="flex items-center gap-2">
								<Mail className="size-4" />
								<EditableLink
									id="news-footer-email-link"
									defaultHref="mailto:admin@ltelectricalservices.co.uk"
									isAdmin={isAdmin}
									contentEdits={contentEdits}
									onSave={handleContentSave}
									className="hover:text-white transition-colors"
								>
									<E id="news-footer-email" as="span">admin@ltelectricalservices.co.uk</E>
								</EditableLink>
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="size-4" />
								<E id="news-footer-location" as="span">Spalding, Lincolnshire</E>
							</div>
						</div>
					</div>
					<div>
						<E id="news-footer-links-title" as="h3" className="font-semibold mb-4">Quick Links</E>
						<ul className="space-y-2 text-slate-400">
							<li>
								<Link to="/" className="hover:text-white transition-colors">Home</Link>
							</li>
							<li>
								<Link to="/news" className="hover:text-white transition-colors">News & Guides</Link>
							</li>
						</ul>
					</div>
					<div>
						<E id="news-footer-areas-title" as="h3" className="font-semibold mb-4">Areas Served</E>
						<ul className="space-y-2 text-slate-400">
							<li><E id="news-footer-area1" as="span">Spalding</E></li>
							<li><E id="news-footer-area2" as="span">Pinchbeck</E></li>
							<li><E id="news-footer-area3" as="span">Bourne</E></li>
							<li><E id="news-footer-area4" as="span">Holbeach</E></li>
							<li><E id="news-footer-area5" as="span">Market Deeping</E></li>
							<li><E id="news-footer-area6" as="span">Stamford</E></li>
							<li><E id="news-footer-area7" as="span">Peterborough</E></li>
						</ul>
					</div>
				</div>
				<div className="border-t border-slate-800 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
						<E id="news-footer-copyright" as="p">&copy; 2026 LT Electrical Services. All rights reserved.</E>
						<div className="flex gap-6">
							<EditableLink
								id="news-footer-privacy-link"
								defaultHref="#"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="hover:text-white transition-colors"
							>
								<E id="news-footer-privacy" as="span">Privacy Policy</E>
							</EditableLink>
							<EditableLink
								id="news-footer-terms-link"
								defaultHref="#"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="hover:text-white transition-colors"
							>
								<E id="news-footer-terms" as="span">Terms of Service</E>
							</EditableLink>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
