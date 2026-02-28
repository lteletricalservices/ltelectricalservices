import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowLeft,
	CheckCircle2,
	Clock,
	Loader2,
	Mail,
	MapPin,
	Phone,
	RefreshCw,
	User,
} from "lucide-react";
import { toast } from "sonner";
import { ContactQuoteORM, ContactQuoteServiceType, type ContactQuoteModel } from "@/sdk/database/orm/orm_contact_quote";
import { useAdmin } from "@/lib/admin-context";

export const Route = createFileRoute("/admin/quotes")({
	component: AdminQuotesPage,
});

const SERVICE_TYPE_LABELS: Record<number, string> = {
	[ContactQuoteServiceType.Unspecified]: "Unspecified",
	[ContactQuoteServiceType.DomesticElectrical]: "Domestic Electrical",
	[ContactQuoteServiceType.CommercialElectrical]: "Commercial Electrical",
	[ContactQuoteServiceType.EmergencyCallouts]: "Emergency Callouts",
	[ContactQuoteServiceType.EICRTesting]: "EICR & Testing",
	[ContactQuoteServiceType.EVChargerInstallation]: "EV Charger Installation",
	[ContactQuoteServiceType.FireSafetySystems]: "Fire & Safety Systems",
	[ContactQuoteServiceType.Other]: "Other",
};

function formatDate(timestamp: string): string {
	if (!timestamp) return "—";
	const ms = timestamp.length <= 10 ? Number(timestamp) * 1000 : Number(timestamp);
	const d = new Date(ms);
	if (Number.isNaN(d.getTime())) return timestamp;
	return d.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function AdminQuotesPage() {
	const { isAdmin } = useAdmin();
	const [quotes, setQuotes] = useState<ContactQuoteModel[]>([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	const fetchQuotes = async () => {
		setLoading(true);
		try {
			const orm = ContactQuoteORM.getInstance();
			const all = await orm.getAllContactQuote();
			const sorted = all.sort((a, b) => {
				const tA = Number(a.create_time || 0);
				const tB = Number(b.create_time || 0);
				return tB - tA;
			});
			setQuotes(sorted);
		} catch (err) {
			console.error("Failed to load quotes:", err);
			toast.error("Failed to load quotes.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isAdmin) {
			fetchQuotes();
		}
	}, [isAdmin]);

	const markAsDone = async (quote: ContactQuoteModel) => {
		setUpdatingId(quote.id);
		try {
			const orm = ContactQuoteORM.getInstance();
			const updated: ContactQuoteModel = {
				...quote,
				status: "done",
			};
			await orm.setContactQuoteById(quote.id, updated);
			setQuotes((prev) =>
				prev.map((q) => (q.id === quote.id ? { ...q, status: "done" } : q)),
			);
			toast.success(`Marked ${quote.name}'s enquiry as done.`);
		} catch (err) {
			console.error("Failed to update quote:", err);
			toast.error("Failed to update status.");
		} finally {
			setUpdatingId(null);
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

	return (
		<div className="min-h-screen bg-muted/30 py-8 px-4">
			<div className="max-w-6xl mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link to="/">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="size-4" />
								Back
							</Button>
						</Link>
						<h1 className="text-2xl font-bold">Quote Enquiries</h1>
						<span className="text-sm text-muted-foreground">
							{quotes.length} total
						</span>
					</div>
					<Button variant="outline" size="sm" onClick={fetchQuotes} disabled={loading}>
						<RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
						Refresh
					</Button>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="size-8 animate-spin text-muted-foreground" />
					</div>
				) : quotes.length === 0 ? (
					<Card>
						<CardContent className="text-center py-16">
							<p className="text-muted-foreground">No enquiries yet.</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{quotes.map((quote) => {
							const isDone = quote.status === "done";
							return (
								<Card
									key={quote.id}
									className={isDone ? "opacity-60" : ""}
								>
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-4">
											<div className="space-y-1">
												<CardTitle className="text-lg flex items-center gap-2">
													<User className="size-4 text-muted-foreground" />
													{quote.name}
													{isDone && (
														<span className="inline-flex items-center gap-1 text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
															<CheckCircle2 className="size-3" />
															Done
														</span>
													)}
													{!isDone && (
														<span className="inline-flex items-center gap-1 text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
															<Clock className="size-3" />
															New
														</span>
													)}
												</CardTitle>
												<p className="text-xs text-muted-foreground">
													{formatDate(quote.create_time)} &middot;{" "}
													{SERVICE_TYPE_LABELS[quote.service_type] || "Unknown"}
												</p>
											</div>
											{!isDone && (
												<Button
													size="sm"
													variant="outline"
													onClick={() => markAsDone(quote)}
													disabled={updatingId === quote.id}
												>
													{updatingId === quote.id ? (
														<Loader2 className="size-4 animate-spin" />
													) : (
														<CheckCircle2 className="size-4" />
													)}
													Mark as done
												</Button>
											)}
										</div>
									</CardHeader>
									<CardContent className="pt-0 space-y-3">
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
											<div className="flex items-center gap-2">
												<Phone className="size-3.5 text-muted-foreground shrink-0" />
												<a
													href={`tel:${quote.phone}`}
													className="text-blue-600 hover:underline"
												>
													{quote.phone}
												</a>
											</div>
											<div className="flex items-center gap-2">
												<Mail className="size-3.5 text-muted-foreground shrink-0" />
												<a
													href={`mailto:${quote.email}`}
													className="text-blue-600 hover:underline truncate"
												>
													{quote.email}
												</a>
											</div>
											{quote.postcode && (
												<div className="flex items-center gap-2">
													<MapPin className="size-3.5 text-muted-foreground shrink-0" />
													<span>{quote.postcode}</span>
												</div>
											)}
										</div>
										{quote.message && (
											<div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap">
												{quote.message}
											</div>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
