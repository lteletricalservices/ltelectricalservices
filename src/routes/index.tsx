import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
	Phone,
	Mail,
	MapPin,
	Shield,
	Clock,
	Star,
	CheckCircle2,
	Zap,
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
	ExternalLink,
	Plug,
	Heart,
	PawPrint,
	Upload,
	Trash2,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin, E, EIcon, EditableIcon, EditableLink, EditableImage, EditableColor, AdminSection } from "@/lib/admin-context";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const Route = createFileRoute("/")({
	component: App,
});

const formSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	phone: z.string().min(10, "Please enter a valid phone number").regex(/^[\d\s+()-]+$/, "Phone number can only contain digits, spaces, +, () and -"),
	postcode: z.string().optional(),
	service_type: z.string().min(1, "Please select a service type"),
	message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const HERO_IMAGE_KEY = "lt-electrical-hero-image";

function EICRGuideContent() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	return (
		<div className="prose prose-lg max-w-none">
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-slate-900">
					<E id="modal-eicr-title" as="span">Do You Need an EICR in Lincolnshire?</E>
				</DialogTitle>
				<E id="modal-eicr-subtitle" as="p" className="text-lg text-slate-600 mt-2" multiline>
					A guide for landlords and homeowners across Spalding, Pinchbeck and surrounding areas.
				</E>
			</DialogHeader>

			<div className="mt-6 space-y-6">
				<EditableImage
					id="modal-eicr-image"
					alt="EICR Testing"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					optional
					label="Article image"
					className="w-full rounded-lg object-cover max-h-64"
					wrapperClassName="w-full rounded-lg overflow-hidden"
				/>
				{contentEdits["modal-eicr-image"] && (
					<E id="modal-eicr-caption" as="p" className="text-sm text-slate-500 italic text-center -mt-4">Image caption (click to edit)</E>
				)}
				<E id="modal-eicr-intro1" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					Electrical safety is something many property owners don't think about until there's a problem. An Electrical Installation Condition Report (EICR) is designed to identify issues before they become dangerous or expensive.
				</E>

				<E id="modal-eicr-intro2" as="p" className="text-base text-slate-700 leading-relaxed" multiline>
					At LT Electrical Services, we carry out EICRs for landlords, homeowners, businesses and parish properties across Spalding, Pinchbeck, Bourne, Holbeach, Market Deeping and surrounding areas.
				</E>

				<div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
					<div className="flex items-start gap-3">
						<ClipboardCheck className="size-6 text-blue-600 shrink-0 mt-1" />
						<div>
							<E id="modal-eicr-callout-title" as="h3" className="font-semibold text-base text-slate-900 mb-2">Quick Contact</E>
							<E id="modal-eicr-callout-body" as="p" className="text-sm text-slate-700 mb-2" multiline>Need an EICR? Get in touch today.</E>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<EditableLink id="modal-eicr-phone-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-600">
									<Phone className="size-3" />
									<E id="modal-eicr-phone-label" as="span">01775 710743</E>
								</EditableLink>
								<EditableLink id="modal-eicr-email-link" defaultHref="mailto:admin@ltelectricalservices.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-600">
									<Mail className="size-3" />
									<E id="modal-eicr-email-label" as="span">admin@ltelectricalservices.co.uk</E>
								</EditableLink>
							</div>
						</div>
					</div>
				</div>

				<E id="modal-eicr-h2-what" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What is an EICR?</E>
				<E id="modal-eicr-what-intro" as="p" className="text-base text-slate-700" multiline>
					An EICR is a formal inspection of the electrical systems in a property. It checks:
				</E>

				<ul className="space-y-2">
					{[
						{ id: "modal-eicr-check-0", text: "Wiring condition" },
						{ id: "modal-eicr-check-1", text: "Consumer unit safety" },
						{ id: "modal-eicr-check-2", text: "Earthing and bonding" },
						{ id: "modal-eicr-check-3", text: "Sockets, switches and fittings" },
						{ id: "modal-eicr-check-4", text: "Potential fire or shock risks" },
					].map((item) => (
						<li key={item.id} className="flex items-start gap-2">
							<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
							<E id={item.id} as="span" className="text-base text-slate-700">{item.text}</E>
						</li>
					))}
				</ul>

				<E id="modal-eicr-result-intro" as="p" className="text-base text-slate-700" multiline>
					At the end of the inspection, you receive a report showing whether the installation is:
				</E>

				<div className="grid md:grid-cols-2 gap-3">
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<CheckCircle2 className="size-5 text-green-600" />
							<E id="modal-eicr-sat-title" as="h3" className="font-semibold text-base text-slate-900">Satisfactory</E>
						</div>
						<E id="modal-eicr-sat-desc" as="p" className="text-sm text-slate-700">Your electrical installation is safe and compliant</E>
					</div>
					<div className="border-2 border-orange-200 bg-orange-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<AlertCircle className="size-5 text-orange-600" />
							<E id="modal-eicr-unsat-title" as="h3" className="font-semibold text-base text-slate-900">Unsatisfactory</E>
						</div>
						<E id="modal-eicr-unsat-desc" as="p" className="text-sm text-slate-700">Recommended actions and repairs are needed</E>
					</div>
				</div>

				<E id="modal-eicr-h2-who" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Who needs an EICR?</E>

				<div className="space-y-4">
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Users className="size-8 text-blue-600 shrink-0" />
							<div>
								<E id="modal-eicr-landlord-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Landlords</E>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="modal-eicr-landlord-1" as="span" className="text-sm text-slate-700">Required by law to have a valid EICR</E>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="modal-eicr-landlord-2" as="span" className="text-sm text-slate-700">Must be renewed every 5 years or at change of tenancy</E>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Home className="size-8 text-blue-600 shrink-0" />
							<div>
								<E id="modal-eicr-homeowner-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Homeowners</E>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="modal-eicr-homeowner-1" as="span" className="text-sm text-slate-700">Recommended every 10 years</E>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="modal-eicr-homeowner-2" as="span" className="text-sm text-slate-700">Essential when buying or selling a property</E>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Building2 className="size-8 text-blue-600 shrink-0" />
							<div>
								<E id="modal-eicr-business-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Businesses</E>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="modal-eicr-business-1" as="span" className="text-sm text-slate-700">Required as part of health and safety compliance</E>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<E id="modal-eicr-business-2" as="span" className="text-sm text-slate-700">Frequency depends on the type of premises</E>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<E id="modal-eicr-h2-inspect" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What happens during the inspection?</E>
				<E id="modal-eicr-inspect-intro" as="p" className="text-base text-slate-700">Our qualified 2391 electrician will:</E>

				<div className="bg-slate-50 rounded-lg p-4 space-y-3">
					{[
						{ step: "1", titleId: "modal-eicr-step1-title", title: "Visually inspect the installation", descId: "modal-eicr-step1-desc", desc: "Check all visible electrical components" },
						{ step: "2", titleId: "modal-eicr-step2-title", title: "Carry out electrical tests", descId: "modal-eicr-step2-desc", desc: "Test circuits, earthing, and protection devices" },
						{ step: "3", titleId: "modal-eicr-step3-title", title: "Identify any faults or risks", descId: "modal-eicr-step3-desc", desc: "Highlight safety hazards" },
						{ step: "4", titleId: "modal-eicr-step4-title", title: "Provide a full written report", descId: "modal-eicr-step4-desc", desc: "Detailed documentation of findings" },
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

				<E id="modal-eicr-explain" as="p" className="text-base text-slate-700" multiline>
					We always explain the findings clearly and provide honest advice on any remedial work.
				</E>

				<E id="modal-eicr-h2-why" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Why choose LT Electrical Services?</E>
				<div className="grid md:grid-cols-2 gap-3">
					{[
						{ icon: Shield, color: "text-blue-600", titleId: "modal-eicr-why1-title", title: "NAPIT registered electricians", descId: "modal-eicr-why1-desc", desc: "Certified professionals you can trust" },
						{ icon: CheckCircle2, color: "text-green-600", titleId: "modal-eicr-why2-title", title: "Government TrustMark approved", descId: "modal-eicr-why2-desc", desc: "Recognized for quality" },
						{ icon: ClipboardCheck, color: "text-blue-600", titleId: "modal-eicr-why3-title", title: "2391 qualified for testing", descId: "modal-eicr-why3-desc", desc: "Specialist qualifications" },
						{ icon: Users, color: "text-blue-600", titleId: "modal-eicr-why4-title", title: "Trusted by councils", descId: "modal-eicr-why4-desc", desc: "Serving councils and businesses" },
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

				<EditableColor id="modal-eicr-cta-bg" defaultColor="#2563eb" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8">
					<E id="modal-eicr-cta-title" as="h3" className="text-xl font-bold mb-2">Book your EICR</E>
					<E id="modal-eicr-cta-desc" as="p" className="text-sm mb-4" multiline>
						Get in touch for an EICR in Spalding, Pinchbeck or surrounding areas.
					</E>
					<div className="flex flex-col sm:flex-row gap-3">
						<EditableLink id="modal-eicr-cta-phone" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Phone className="size-4" />
							<E id="modal-eicr-cta-phone-text" as="span">Call: 01775 710743</E>
						</EditableLink>
						<EditableLink id="modal-eicr-cta-email" defaultHref="mailto:admin@ltelectricalservices.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Mail className="size-4" />
							<E id="modal-eicr-cta-email-text" as="span">Email Us</E>
						</EditableLink>
					</div>
				</EditableColor>
			</div>
		</div>
	);
}

function PATTestingGuideContent() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	return (
		<div className="prose prose-lg max-w-none">
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-slate-900">
					<E id="modal-pat-title" as="span">What Is PAT Testing and Does Your Business Need It?</E>
				</DialogTitle>
				<E id="modal-pat-subtitle" as="p" className="text-lg text-slate-600 mt-2" multiline>A simple guide to PAT testing for offices, shops, parish buildings and commercial properties in Spalding and surrounding areas.</E>
			</DialogHeader>

			<div className="mt-6 space-y-6">
				<EditableImage
					id="modal-pat-image"
					alt="PAT Testing"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					optional
					label="Article image"
					className="w-full rounded-lg object-cover max-h-64"
					wrapperClassName="w-full rounded-lg overflow-hidden"
				/>
				{contentEdits["modal-pat-image"] && (
					<E id="modal-pat-caption" as="p" className="text-sm text-slate-500 italic text-center -mt-4">Image caption (click to edit)</E>
				)}
				<E id="modal-pat-intro1" as="p" className="text-base text-slate-700 leading-relaxed" multiline>If you run a business, office, shop or community building, you're responsible for making sure electrical equipment is safe. One of the simplest ways to do this is through PAT testing.</E>

				<E id="modal-pat-intro2" as="p" className="text-base text-slate-700 leading-relaxed" multiline>LT Electrical Services provides professional PAT testing across Lincolnshire and Cambridgeshire working with businesses, parish councils, and commercial clients.</E>

				<div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
					<div className="flex items-start gap-3">
						<Plug className="size-6 text-blue-600 shrink-0 mt-1" />
						<div>
							<E id="modal-pat-callout-title" as="h3" className="font-semibold text-base text-slate-900 mb-2">Quick Contact</E>
							<E id="modal-pat-callout-body" as="p" className="text-sm text-slate-700 mb-2" multiline>Need PAT testing? Get in touch today.</E>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<EditableLink id="modal-pat-phone-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-600">
									<Phone className="size-3" />
									<E id="modal-pat-phone-label" as="span">01775 710743</E>
								</EditableLink>
								<EditableLink id="modal-pat-email-link" defaultHref="mailto:admin@ltelectricalservices.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-600">
									<Mail className="size-3" />
									<E id="modal-pat-email-label" as="span">admin@ltelectricalservices.co.uk</E>
								</EditableLink>
							</div>
						</div>
					</div>
				</div>

				<E id="modal-pat-h2-what" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What is PAT testing?</E>
				<E id="modal-pat-body-what1" as="p" className="text-base text-slate-700" multiline>PAT stands for Portable Appliance Testing. It involves checking electrical appliances to make sure they are safe to use.</E>
				<E id="modal-pat-body-what2" as="p" className="text-base text-slate-700">This includes items such as:</E>

				<ul className="space-y-2">
					{[
						{ id: "modal-pat-item-0", text: "Kettles" },
						{ id: "modal-pat-item-1", text: "Computers" },
						{ id: "modal-pat-item-2", text: "Extension leads" },
						{ id: "modal-pat-item-3", text: "Power tools" },
						{ id: "modal-pat-item-4", text: "Printers" },
						{ id: "modal-pat-item-5", text: "Kitchen appliances" },
						{ id: "modal-pat-item-6", text: "Heaters" },
					].map((item) => (
						<li key={item.id} className="flex items-start gap-2">
							<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
							<E id={item.id} as="span" className="text-base text-slate-700">{item.text}</E>
						</li>
					))}
				</ul>

				<E id="modal-pat-h2-legal" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Is PAT testing a legal requirement?</E>
				<E id="modal-pat-body-legal1" as="p" className="text-base text-slate-700" multiline>PAT testing itself is not specifically required by law, but the law does require all electrical equipment to be safe.</E>
				<E id="modal-pat-body-legal2" as="p" className="text-base text-slate-700">For businesses, this falls under:</E>

				<ul className="space-y-2">
					<li className="flex items-start gap-2">
						<Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<E id="modal-pat-reg-0" as="span" className="text-base text-slate-700">Health and Safety at Work Act</E>
					</li>
					<li className="flex items-start gap-2">
						<Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<E id="modal-pat-reg-1" as="span" className="text-base text-slate-700">Electricity at Work Regulations</E>
					</li>
				</ul>

				<E id="modal-pat-body-legal3" as="p" className="text-base text-slate-700" multiline>PAT testing is the easiest way to prove you are meeting these responsibilities.</E>

				<E id="modal-pat-h2-frequency" as="h2" className="text-2xl font-bold text-slate-900 mt-8">How often should PAT testing be done?</E>
				<E id="modal-pat-body-freq" as="p" className="text-base text-slate-700">This depends on the environment:</E>

				<div className="overflow-hidden rounded-lg border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-slate-100">
								<th className="text-left p-3 font-semibold text-slate-900">Environment</th>
								<th className="text-left p-3 font-semibold text-slate-900">Suggested Frequency</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-t">
								<td className="p-3 text-slate-700"><E id="modal-pat-table-env-0" as="span">Offices</E></td>
								<td className="p-3 text-slate-700"><E id="modal-pat-table-freq-0" as="span">Every 2–4 years</E></td>
							</tr>
							<tr className="border-t bg-slate-50">
								<td className="p-3 text-slate-700"><E id="modal-pat-table-env-1" as="span">Shops</E></td>
								<td className="p-3 text-slate-700"><E id="modal-pat-table-freq-1" as="span">Every 1–2 years</E></td>
							</tr>
							<tr className="border-t">
								<td className="p-3 text-slate-700"><E id="modal-pat-table-env-2" as="span">Construction sites</E></td>
								<td className="p-3 text-slate-700"><E id="modal-pat-table-freq-2" as="span">Every 3–6 months</E></td>
							</tr>
							<tr className="border-t bg-slate-50">
								<td className="p-3 text-slate-700"><E id="modal-pat-table-env-3" as="span">Community buildings</E></td>
								<td className="p-3 text-slate-700"><E id="modal-pat-table-freq-3" as="span">Every 1–2 years</E></td>
							</tr>
						</tbody>
					</table>
				</div>

				<E id="modal-pat-body-advise" as="p" className="text-base text-slate-700" multiline>We can advise the correct schedule for your premises.</E>

				<E id="modal-pat-h2-receive" as="h2" className="text-2xl font-bold text-slate-900 mt-8">What you receive</E>
				<E id="modal-pat-body-receive" as="p" className="text-base text-slate-700">After testing, you'll receive:</E>

				<div className="grid md:grid-cols-2 gap-3">
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<CheckCircle2 className="size-5 text-green-600" />
							<E id="modal-pat-result-title-0" as="h3" className="font-semibold text-base text-slate-900">Appliance labels</E>
						</div>
						<E id="modal-pat-result-desc-0" as="p" className="text-sm text-slate-700">Clear pass/fail labels on every tested appliance</E>
					</div>
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<ClipboardCheck className="size-5 text-green-600" />
							<E id="modal-pat-result-title-1" as="h3" className="font-semibold text-base text-slate-900">Full test report</E>
						</div>
						<E id="modal-pat-result-desc-1" as="p" className="text-sm text-slate-700">Comprehensive documentation of all tests performed</E>
					</div>
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<AlertCircle className="size-5 text-green-600" />
							<E id="modal-pat-result-title-2" as="h3" className="font-semibold text-base text-slate-900">Pass/fail results</E>
						</div>
						<E id="modal-pat-result-desc-2" as="p" className="text-sm text-slate-700">Clear outcome for each appliance tested</E>
					</div>
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<Shield className="size-5 text-green-600" />
							<E id="modal-pat-result-title-3" as="h3" className="font-semibold text-base text-slate-900">Compliance record</E>
						</div>
						<E id="modal-pat-result-desc-3" as="p" className="text-sm text-slate-700">For insurance or inspection purposes</E>
					</div>
				</div>

				<E id="modal-pat-h2-trusted" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Trusted by local organisations</E>
				<E id="modal-pat-body-trusted" as="p" className="text-base text-slate-700">We carry out work for:</E>

				<div className="space-y-4">
					{[
						{ id: "modal-pat-org-0", icon: Users, label: "Parish councils" },
						{ id: "modal-pat-org-1", icon: Building2, label: "Commercial clients" },
						{ id: "modal-pat-org-2", icon: Home, label: "Retail premises" },
						{ id: "modal-pat-org-3", icon: Users, label: "Community buildings" },
					].map((item) => (
						<div key={item.id} className="flex items-center gap-3 border rounded-lg p-3">
							<item.icon className="size-6 text-blue-600 shrink-0" />
							<E id={item.id} as="span" className="text-base text-slate-700 font-medium">{item.label}</E>
						</div>
					))}
				</div>

				<E id="modal-pat-body-clients" as="p" className="text-base text-slate-700" multiline>Including clients such as KFC Spalding, YMCA Peterborough and local parish organisations.</E>

				<EditableColor id="modal-pat-cta-bg" defaultColor="#2563eb" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8">
					<E id="modal-pat-cta-title" as="h3" className="text-xl font-bold mb-2">Book PAT testing</E>
					<E id="modal-pat-cta-body" as="p" className="text-sm mb-4" multiline>Contact us today for reliable and efficient PAT testing across Spalding, Pinchbeck and surrounding areas.</E>
					<div className="flex flex-col sm:flex-row gap-3">
						<EditableLink id="modal-pat-cta-phone" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Phone className="size-4" />
							<E id="modal-pat-cta-phone-text" as="span">Call: 01775 710743</E>
						</EditableLink>
						<EditableLink id="modal-pat-cta-email" defaultHref="mailto:admin@ltelectricalservices.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Mail className="size-4" />
							<E id="modal-pat-cta-email-text" as="span">Email Us</E>
						</EditableLink>
					</div>
				</EditableColor>
			</div>
		</div>
	);
}

function DefibrillatorArticleContent() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	return (
		<div className="prose prose-lg max-w-none">
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-slate-900">
					<E id="modal-defib-title" as="span">Supporting the Community: Free Defibrillator Installations in Pinchbeck</E>
				</DialogTitle>
				<E id="modal-defib-subtitle" as="p" className="text-lg text-slate-600 mt-2" multiline>How LT Electrical Services has supported local safety by installing defibrillators for community organisations in Pinchbeck and the surrounding area.</E>
			</DialogHeader>

			<div className="mt-6 space-y-6">
				<EditableImage
					id="modal-defib-image"
					alt="Community Defibrillator"
					isAdmin={isAdmin}
					contentEdits={contentEdits}
					onSave={handleContentSave}
					optional
					label="Article image"
					className="w-full rounded-lg object-cover max-h-64"
					wrapperClassName="w-full rounded-lg overflow-hidden"
				/>
				{contentEdits["modal-defib-image"] && (
					<E id="modal-defib-caption" as="p" className="text-sm text-slate-500 italic text-center -mt-4">Image caption (click to edit)</E>
				)}
				<E id="modal-defib-intro1" as="p" className="text-base text-slate-700 leading-relaxed" multiline>At LT Electrical Services, we believe being part of the community means more than just carrying out electrical work. It means giving something back.</E>

				<E id="modal-defib-intro2" as="p" className="text-base text-slate-700 leading-relaxed" multiline>Over the years, we've been proud to install defibrillators free of charge for local organisations to help improve public safety.</E>

				<div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
					<div className="flex items-start gap-3">
						<Heart className="size-6 text-red-500 shrink-0 mt-1" />
						<div>
							<E id="modal-defib-callout-title" as="h3" className="font-semibold text-base text-slate-900 mb-2">Quick Contact</E>
							<E id="modal-defib-callout-body" as="p" className="text-sm text-slate-700 mb-2" multiline>Want to discuss a defibrillator installation? Get in touch.</E>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<EditableLink id="modal-defib-phone-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-600">
									<Phone className="size-3" />
									<E id="modal-defib-phone-label" as="span">01775 710743</E>
								</EditableLink>
								<EditableLink id="modal-defib-email-link" defaultHref="mailto:admin@ltelectricalservices.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-600">
									<Mail className="size-3" />
									<E id="modal-defib-email-label" as="span">admin@ltelectricalservices.co.uk</E>
								</EditableLink>
							</div>
						</div>
					</div>
				</div>

				<E id="modal-defib-h2-orgs" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Supporting local organisations</E>
				<E id="modal-defib-body-orgs" as="p" className="text-base text-slate-700" multiline>We have provided free defibrillator installations for:</E>

				<div className="space-y-4">
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Users className="size-8 text-red-500 shrink-0" />
							<div>
								<E id="modal-defib-org-0" as="h3" className="font-semibold text-lg text-slate-900">YMCA Trinity Group</E>
							</div>
						</div>
					</div>
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Home className="size-8 text-red-500 shrink-0" />
							<div>
								<E id="modal-defib-org-1" as="h3" className="font-semibold text-lg text-slate-900">St Mary's Church Hall, Pinchbeck</E>
							</div>
						</div>
					</div>
				</div>

				<E id="modal-defib-body-orgs2" as="p" className="text-base text-slate-700" multiline>These installations ensure that life-saving equipment is available in the event of a cardiac emergency.</E>

				<E id="modal-defib-h2-why" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Why defibrillators matter</E>
				<E id="modal-defib-body-why" as="p" className="text-base text-slate-700" multiline>When someone suffers a cardiac arrest:</E>

				<ul className="space-y-2">
					<li className="flex items-start gap-2">
						<AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
						<E id="modal-defib-fact-0" as="span" className="text-base text-slate-700">Every minute without treatment reduces survival chances</E>
					</li>
					<li className="flex items-start gap-2">
						<Heart className="size-5 text-red-500 shrink-0 mt-0.5" />
						<E id="modal-defib-fact-1" as="span" className="text-base text-slate-700">A defibrillator can dramatically increase survival rates</E>
					</li>
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<E id="modal-defib-fact-2" as="span" className="text-base text-slate-700">Community access to defibrillators saves lives</E>
					</li>
				</ul>

				<E id="modal-defib-body-safer" as="p" className="text-base text-slate-700" multiline>By installing these units, we're helping create a safer environment for everyone.</E>

				<E id="modal-defib-h2-rooted" as="h2" className="text-2xl font-bold text-slate-900 mt-8">A business rooted in the community</E>
				<E id="modal-defib-body-rooted" as="p" className="text-base text-slate-700" multiline>We're proud to work with and support:</E>

				<div className="space-y-4">
					{[
						{ id: "modal-defib-partner-0", icon: Users, label: "Pinchbeck Parish" },
						{ id: "modal-defib-partner-1", icon: Users, label: "Gosberton Parish" },
						{ id: "modal-defib-partner-2", icon: Building2, label: "YMCA Peterborough" },
						{ id: "modal-defib-partner-3", icon: Heart, label: "Local charities and community groups" },
					].map((item) => (
						<div key={item.id} className="flex items-center gap-3 border rounded-lg p-3">
							<item.icon className="size-6 text-blue-600 shrink-0" />
							<E id={item.id} as="span" className="text-base text-slate-700 font-medium">{item.label}</E>
						</div>
					))}
				</div>

				<div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mt-6">
					<div className="flex items-start gap-3">
						<PawPrint className="size-8 text-purple-600 shrink-0" />
						<div>
							<E id="modal-defib-animal-title" as="h3" className="font-semibold text-lg text-slate-900 mb-2">Supporting animal welfare</E>
							<E id="modal-defib-animal-body" as="p" className="text-base text-slate-700" multiline>As fervent animal lovers, we have also supported Peterborough Cats Protection by wiring their cat runs and donating food and blankets.</E>
						</div>
					</div>
				</div>

				<E id="modal-defib-h2-looking" as="h2" className="text-2xl font-bold text-slate-900 mt-8">Looking after the community we serve</E>
				<E id="modal-defib-body-looking1" as="p" className="text-base text-slate-700" multiline>Our work takes us into homes, businesses and community spaces every day. Supporting local causes is simply part of our ethos.</E>

				<E id="modal-defib-body-looking2" as="p" className="text-base text-slate-700" multiline>If your organisation is considering donating or installing a defibrillator, we're always happy to offer advice.</E>

				<EditableColor id="modal-defib-cta-bg" defaultColor="#2563eb" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8">
					<E id="modal-defib-cta-title" as="h3" className="text-xl font-bold mb-2">Get in touch</E>
					<E id="modal-defib-cta-body" as="p" className="text-sm mb-4" multiline>Whether you need electrical work or want to discuss a community defibrillator installation, we'd love to hear from you.</E>
					<div className="flex flex-col sm:flex-row gap-3">
						<EditableLink id="modal-defib-cta-phone" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Phone className="size-4" />
							<E id="modal-defib-cta-phone-text" as="span">Call: 01775 710743</E>
						</EditableLink>
						<EditableLink id="modal-defib-cta-email" defaultHref="mailto:admin@ltelectricalservices.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Mail className="size-4" />
							<E id="modal-defib-cta-email-text" as="span">Email Us</E>
						</EditableLink>
					</div>
				</EditableColor>
			</div>
		</div>
	);
}

function App() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
	const [heroImage, setHeroImage] = useState<string | null>(null);
	const [heroUploading, setHeroUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const stored = localStorage.getItem(HERO_IMAGE_KEY);
		if (stored) {
			setHeroImage(stored);
		}
	}, []);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			postcode: "",
			service_type: "",
			message: "",
		},
	});

	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true);
		setSubmitStatus("idle");
		try {
			const res = await fetch("/api/quote-request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					phone: values.phone,
					postcode: values.postcode || "",
					serviceType: values.service_type,
					message: values.message,
				}),
			});

			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				throw new Error(data?.error || "Failed to submit");
			}

			setSubmitStatus("success");
			toast.success("Thanks — your quote request has been sent.");
			form.reset();
		} catch (error) {
			console.error("Error submitting form:", error);
			setSubmitStatus("error");
			toast.error("Something went wrong. Please call 01775 710743.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const scrollToContact = () => {
		document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
	};

	const handleImageUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) return;

		if (isCloudinaryConfigured()) {
			setHeroUploading(true);
			try {
				const secureUrl = await uploadToCloudinary(file);
				setHeroImage(secureUrl);
				localStorage.setItem(HERO_IMAGE_KEY, secureUrl);
			} catch (err) {
				console.error("Cloudinary upload failed:", err);
			} finally {
				setHeroUploading(false);
			}
		} else {
			const reader = new FileReader();
			reader.onload = (event) => {
				const dataUrl = event.target?.result as string;
				setHeroImage(dataUrl);
				localStorage.setItem(HERO_IMAGE_KEY, dataUrl);
			};
			reader.readAsDataURL(file);
		}
	}, []);

	const handleRemoveImage = useCallback(() => {
		setHeroImage(null);
		localStorage.removeItem(HERO_IMAGE_KEY);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<EditableColor id="header-bg-color" defaultColor="#0f172a" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="bg-slate-900 text-white py-4 sticky top-0 z-50 shadow-md">
				<div className="container mx-auto px-4 flex justify-between items-center">
					<div className="flex items-center gap-2">
						<EIcon id="header-logo-icon" defaultIcon="zap" className="size-8 text-blue-400" />
						<E id="header-name" as="span" className="text-xl font-bold">LT Electrical Services</E>
					</div>
					<div className="flex items-center gap-6">
						<Link to="/news" className="hidden sm:inline hover:text-blue-400 transition-colors font-medium">
							News
						</Link>
						<EditableLink id="header-phone-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
							<EIcon id="header-phone-icon" defaultIcon="phone" className="size-4" />
							<span className="hidden sm:inline"><E id="header-phone-text" as="span">01775 710743</E></span>
						</EditableLink>
						<Button onClick={scrollToContact} size="sm" className="bg-blue-600 hover:bg-blue-700">
							<E id="header-btn-text" as="span">Get Quote</E>
						</Button>
					</div>
				</div>
			</EditableColor>

			<AdminSection sectionId="hero" className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 md:py-32 overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="text-center lg:text-left">
							<E id="hero-heading" as="h1" className="text-4xl md:text-6xl font-bold mb-6">Reliable Electricians in Lincolnshire & Cambridgeshire</E>
							<E id="hero-subheading" as="p" className="text-xl md:text-2xl mb-8 text-slate-300">Professional domestic, commercial & emergency electrical services you can trust</E>
							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								<Button onClick={scrollToContact} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
									<E id="hero-quote-btn" as="span">Get a Free Quote</E>
								</Button>
								<EditableLink id="hero-call-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-lg px-8 h-11 rounded-md font-medium">
									<Phone className="size-5" />
									<E id="hero-call-text" as="span">Call Now</E>
								</EditableLink>
							</div>
						</div>
						<div className="relative">
							<div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800">
								{heroImage ? (
									<img
										src={heroImage}
										alt="Professional electrical work by LT Electrical Services"
										className="absolute inset-0 w-full h-full object-cover"
										onError={() => { setHeroImage(null); localStorage.removeItem(HERO_IMAGE_KEY); }}
									/>
								) : (
									<>
										<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNi0yLjY4Ni02LTYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="grid grid-cols-3 gap-8 p-8">
												<div className="flex items-center justify-center">
													<Zap className="size-16 md:size-20 text-yellow-400 animate-pulse" />
												</div>
												<div className="flex items-center justify-center">
													<Shield className="size-16 md:size-20 text-blue-200" />
												</div>
												<div className="flex items-center justify-center">
													<CheckCircle2 className="size-16 md:size-20 text-green-400" />
												</div>
												<div className="flex items-center justify-center">
													<Building2 className="size-16 md:size-20 text-slate-200" />
												</div>
												<div className="flex items-center justify-center col-span-1">
													<div className="relative">
														<div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
														<Zap className="size-20 md:size-24 text-yellow-300 relative z-10" />
													</div>
												</div>
												<div className="flex items-center justify-center">
													<Car className="size-16 md:size-20 text-purple-300" />
												</div>
												<div className="flex items-center justify-center">
													<ClipboardCheck className="size-16 md:size-20 text-green-300" />
												</div>
												<div className="flex items-center justify-center">
													<AlertCircle className="size-16 md:size-20 text-orange-400" />
												</div>
												<div className="flex items-center justify-center">
													<Flame className="size-16 md:size-20 text-red-400" />
												</div>
											</div>
										</div>
									</>
								)}
								<div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6">
									<div className="flex items-center gap-3 text-sm md:text-base">
										<Shield className="size-6 text-blue-400" />
										<span className="font-semibold">NAPIT Registered & Fully Insured</span>
									</div>
								</div>
								{isAdmin && (
									<div className="absolute top-3 right-3 flex gap-2">
										<Button
											size="sm"
											className="bg-blue-600 hover:bg-blue-700 shadow-lg"
											onClick={() => fileInputRef.current?.click()}
											disabled={heroUploading}
										>
											{heroUploading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Upload className="size-4 mr-1" />}
											{heroUploading ? "Uploading..." : "Upload Image"}
										</Button>
										{heroImage && (
											<Button
												size="sm"
												variant="destructive"
												className="shadow-lg"
												onClick={handleRemoveImage}
											>
												<Trash2 className="size-4 mr-1" />
												Remove
											</Button>
										)}
										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
									</div>
								)}
							</div>
							<div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-3xl rounded-full"></div>
						</div>
					</div>
				</div>
			</AdminSection>

			<AdminSection sectionId="trust" className="py-12 bg-white border-b">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div className="flex flex-col items-center text-center gap-3">
							<EIcon id="trust-1-icon" defaultIcon="shield" className="size-12 text-blue-600" />
							<div>
								<E id="trust-1-title" as="div" className="font-semibold text-slate-900">NAPIT Registered</E>
								<E id="trust-1-sub" as="div" className="text-sm text-slate-600">Certified professionals</E>
							</div>
						</div>
						<div className="flex flex-col items-center text-center gap-3">
							<EIcon id="trust-2-icon" defaultIcon="check" className="size-12 text-green-600" />
							<div>
								<E id="trust-2-title" as="div" className="font-semibold text-slate-900">Fully Insured</E>
								<E id="trust-2-sub" as="div" className="text-sm text-slate-600">Complete protection</E>
							</div>
						</div>
						<div className="flex flex-col items-center text-center gap-3">
							<EIcon id="trust-3-icon" defaultIcon="clock" className="size-12 text-orange-600" />
							<div>
								<E id="trust-3-title" as="div" className="font-semibold text-slate-900">24/7 Emergency</E>
								<E id="trust-3-sub" as="div" className="text-sm text-slate-600">Always available</E>
							</div>
						</div>
						<div className="flex flex-col items-center text-center gap-3">
							<EIcon id="trust-4-icon" defaultIcon="star" className="size-12 text-yellow-600" />
							<div>
								<E id="trust-4-title" as="div" className="font-semibold text-slate-900">5-Star Reviews</E>
								<E id="trust-4-sub" as="div" className="text-sm text-slate-600">Customer rated</E>
							</div>
						</div>
					</div>
				</div>
			</AdminSection>

			<AdminSection sectionId="services" className="py-16 bg-slate-50">
				<div className="container mx-auto px-4">
					<E id="services-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Our Services</E>
					<E id="services-sub" as="p" className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Comprehensive electrical solutions for homes and businesses across Lincolnshire and Cambridgeshire</E>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<EIcon id="svc-1-icon" defaultIcon="zap" className="size-10 text-blue-600 mb-3" />
								<CardTitle><E id="svc-1-title" as="span">Domestic Electrical</E></CardTitle>
								<CardDescription>
									<E id="svc-1-desc" as="span">Complete home electrical services including rewiring, socket installation, lighting, and consumer unit upgrades.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<EIcon id="svc-2-icon" defaultIcon="building" className="size-10 text-blue-600 mb-3" />
								<CardTitle><E id="svc-2-title" as="span">Commercial Electrical</E></CardTitle>
								<CardDescription>
									<E id="svc-2-desc" as="span">Professional electrical solutions for offices, shops, and industrial premises with minimal disruption.</E>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="link" className="p-0 h-auto text-blue-600">
											Learn about PAT Testing <ExternalLink className="size-3 ml-1" />
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
										<PATTestingGuideContent />
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<EIcon id="svc-3-icon" defaultIcon="alert" className="size-10 text-orange-600 mb-3" />
								<CardTitle><E id="svc-3-title" as="span">Emergency Callouts</E></CardTitle>
								<CardDescription>
									<E id="svc-3-desc" as="span">24/7 emergency electrical services for urgent repairs, power failures, and safety concerns.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<EIcon id="svc-4-icon" defaultIcon="clipboard" className="size-10 text-green-600 mb-3" />
								<CardTitle><E id="svc-4-title" as="span">EICR & Testing</E></CardTitle>
								<CardDescription>
									<E id="svc-4-desc" as="span">Comprehensive electrical testing and certification to ensure your property meets safety standards.</E>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="link" className="p-0 h-auto text-blue-600">
											Learn more about EICRs <ExternalLink className="size-3 ml-1" />
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
										<EICRGuideContent />
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<EIcon id="svc-5-icon" defaultIcon="car" className="size-10 text-purple-600 mb-3" />
								<CardTitle><E id="svc-5-title" as="span">EV Charger Installation</E></CardTitle>
								<CardDescription>
									<E id="svc-5-desc" as="span">Expert installation of electric vehicle charging points for home and commercial properties.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<EIcon id="svc-6-icon" defaultIcon="flame" className="size-10 text-red-600 mb-3" />
								<CardTitle><E id="svc-6-title" as="span">Fire & Safety Systems</E></CardTitle>
								<CardDescription>
									<E id="svc-6-desc" as="span">Installation and maintenance of fire alarms, emergency lighting, and safety systems.</E>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="link" className="p-0 h-auto text-blue-600">
											Community defibrillator installations <ExternalLink className="size-3 ml-1" />
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
										<DefibrillatorArticleContent />
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>
					</div>
				</div>
			</AdminSection>

			<AdminSection sectionId="why" className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<E id="why-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Why Choose Us</E>
					<E id="why-sub" as="p" className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Local expertise, professional service, and complete peace of mind</E>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="flex gap-4">
							<EIcon id="why-1-icon" defaultIcon="map-pin" className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-1-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Local Business</E>
								<E id="why-1-desc" as="p" className="text-slate-600">Based in Spalding, serving Lincolnshire and Cambridgeshire with fast response times.</E>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="link" className="p-0 h-auto text-blue-600 mt-1 text-sm">
											See our community work <ExternalLink className="size-3 ml-1" />
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
										<DefibrillatorArticleContent />
									</DialogContent>
								</Dialog>
							</div>
						</div>
						<div className="flex gap-4">
							<EIcon id="why-2-icon" defaultIcon="users" className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-2-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Qualified Electricians</E>
								<E id="why-2-desc" as="p" className="text-slate-600">NAPIT registered professionals with extensive training and experience.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<EIcon id="why-3-icon" defaultIcon="pound" className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-3-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Clear Pricing</E>
								<E id="why-3-desc" as="p" className="text-slate-600">Transparent quotes with no hidden fees. You know the cost upfront.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<EIcon id="why-4-icon" defaultIcon="sparkles" className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-4-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Tidy Work</E>
								<E id="why-4-desc" as="p" className="text-slate-600">We respect your property and leave it clean and tidy after every job.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<EIcon id="why-5-icon" defaultIcon="trending" className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-5-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Fast Response</E>
								<E id="why-5-desc" as="p" className="text-slate-600">Quick turnaround times and same-day emergency callouts available.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<EIcon id="why-6-icon" defaultIcon="shield" className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-6-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Quality Guaranteed</E>
								<E id="why-6-desc" as="p" className="text-slate-600">All work backed by our quality guarantee and public liability insurance.</E>
							</div>
						</div>
					</div>
				</div>
			</AdminSection>

			<AdminSection sectionId="areas" className="py-16 bg-slate-50">
				<div className="container mx-auto px-4">
					<E id="areas-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Areas We Cover</E>
					<E id="areas-sub" as="p" className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Providing professional electrical services throughout Lincolnshire and Cambridgeshire</E>
					<div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
						{["Spalding", "Pinchbeck", "Bourne", "Holbeach", "Market Deeping", "Stamford", "Peterborough"].map((town) => (
							<div key={town} className="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-200 font-medium text-slate-700">
								{town}
							</div>
						))}
					</div>
				</div>
			</AdminSection>

			<AdminSection sectionId="projects" className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<E id="projects-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Recent Projects</E>
					<E id="projects-sub" as="p" className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">See some of our recent electrical work across the region</E>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Card>
							<EditableImage
								id="proj-1-img"
								alt="Complete House Rewire"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="h-48 w-full object-cover rounded-t-xl"
								wrapperClassName="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl flex items-center justify-center overflow-hidden"
							/>
							<CardHeader>
								<CardTitle><E id="proj-1-title" as="span">Complete House Rewire</E></CardTitle>
								<CardDescription>
									<E id="proj-1-desc" as="span">Full electrical rewiring of a 4-bedroom property in Spalding, including new consumer unit and LED lighting throughout.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<EditableImage
								id="proj-2-img"
								alt="Commercial Office Fit-Out"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="h-48 w-full object-cover rounded-t-xl"
								wrapperClassName="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-xl flex items-center justify-center overflow-hidden"
							/>
							<CardHeader>
								<CardTitle><E id="proj-2-title" as="span">Commercial Office Fit-Out</E></CardTitle>
								<CardDescription>
									<E id="proj-2-desc" as="span">Electrical installation for new office space in Peterborough, including data points, lighting, and power distribution.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<EditableImage
								id="proj-3-img"
								alt="EV Charger Installation"
								isAdmin={isAdmin}
								contentEdits={contentEdits}
								onSave={handleContentSave}
								className="h-48 w-full object-cover rounded-t-xl"
								wrapperClassName="h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-t-xl flex items-center justify-center overflow-hidden"
							/>
							<CardHeader>
								<CardTitle><E id="proj-3-title" as="span">EV Charger Installation</E></CardTitle>
								<CardDescription>
									<E id="proj-3-desc" as="span">Installation of Tesla home charger in Bourne with dedicated circuit and safety certification.</E>
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</AdminSection>

			<AdminSection sectionId="testimonials" className="py-16 bg-slate-50">
				<div className="container mx-auto px-4">
					<E id="testimonials-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">What Our Customers Say</E>
					<E id="testimonials-sub" as="p" className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Don't just take our word for it - hear from our satisfied customers</E>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<Card>
							<CardContent className="pt-6">
								<div className="flex gap-1 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
									))}
								</div>
								<E id="review-1-text" as="p" className="text-slate-700 mb-4">"Excellent service from start to finish. Professional, tidy, and great value. Highly recommend for any electrical work."</E>
								<E id="review-1-author" as="p" className="font-semibold text-slate-900">- Sarah Thompson, Spalding</E>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="flex gap-1 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
									))}
								</div>
								<E id="review-2-text" as="p" className="text-slate-700 mb-4">"Called for an emergency and they came out same day. Fixed the issue quickly and explained everything clearly. Very impressed."</E>
								<E id="review-2-author" as="p" className="font-semibold text-slate-900">- John Davies, Peterborough</E>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="flex gap-1 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
									))}
								</div>
								<E id="review-3-text" as="p" className="text-slate-700 mb-4">"Had our EV charger installed by LT Electrical. Professional job, competitive price, and all certified properly. Thanks!"</E>
								<E id="review-3-author" as="p" className="font-semibold text-slate-900">- Michael Brown, Bourne</E>
							</CardContent>
						</Card>
					</div>
				</div>
			</AdminSection>

			<AdminSection sectionId="cta">
				<EditableColor id="cta-bg-color" defaultColor="#2563eb" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
					<div className="container mx-auto px-4 text-center">
						<E id="cta-heading" as="h2" className="text-3xl md:text-4xl font-bold mb-4">Need a reliable electrician?</E>
						<E id="cta-sub" as="p" className="text-xl mb-6">Get your free quote today</E>
						<Button onClick={scrollToContact} size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8">
							<E id="cta-btn-text" as="span">Request Free Quote</E>
						</Button>
					</div>
				</EditableColor>
			</AdminSection>

			<AdminSection sectionId="contact" className="py-16 bg-white">
				<div id="contact-form" className="container mx-auto px-4 max-w-2xl">
					<E id="contact-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Get Your Free Quote</E>
					<E id="contact-sub" as="p" className="text-center text-slate-600 mb-8">Fill in the form below and we'll get back to you as soon as possible</E>

					{submitStatus === "success" && (
						<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
							<CheckCircle2 className="size-5 shrink-0" />
							<p>Thanks — your quote request has been sent.</p>
						</div>
					)}
					{submitStatus === "error" && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
							<AlertCircle className="size-5 shrink-0" />
							<p>Something went wrong. Please call <a href="tel:01775710743" className="font-semibold underline">01775 710743</a>.</p>
						</div>
					)}

					<Card>
						<CardContent className="pt-6">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="Your name" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input type="email" placeholder="your.email@example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone</FormLabel>
												<FormControl>
													<Input type="tel" placeholder="01775 123456" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="postcode"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Postcode <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
												<FormControl>
													<Input placeholder="PE11 1AA" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="service_type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Service Type</FormLabel>
												<Select onValueChange={field.onChange} value={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a service" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Domestic Electrical">Domestic Electrical</SelectItem>
														<SelectItem value="Commercial Electrical">Commercial Electrical</SelectItem>
														<SelectItem value="Emergency Callouts">Emergency Callouts</SelectItem>
														<SelectItem value="EICR & Testing">EICR & Testing</SelectItem>
														<SelectItem value="EV Charger Installation">EV Charger Installation</SelectItem>
														<SelectItem value="Fire & Safety Systems">Fire & Safety Systems</SelectItem>
														<SelectItem value="Other">Other</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="message"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Message</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Please describe the work you need done..."
														className="min-h-32"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<Loader2 className="size-5 animate-spin" />
												Sending…
											</>
										) : "Submit Quote Request"}
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</AdminSection>

			<footer className="bg-slate-900 text-white py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<EIcon id="footer-logo-icon" defaultIcon="zap" className="size-8 text-blue-400" />
								<E id="footer-name" as="span" className="text-xl font-bold">LT Electrical</E>
							</div>
							<E id="footer-desc" as="p" className="text-slate-400">Professional electrical services across Lincolnshire and Cambridgeshire</E>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Contact</h3>
							<div className="space-y-2 text-slate-400">
								<div className="flex items-center gap-2">
									<EIcon id="footer-phone-icon" defaultIcon="phone" className="size-4" />
									<EditableLink id="footer-phone-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="hover:text-white transition-colors">
										<E id="footer-phone-text" as="span">01775 710743</E>
									</EditableLink>
								</div>
								<div className="flex items-center gap-2">
									<EIcon id="footer-email-icon" defaultIcon="mail" className="size-4" />
									<EditableLink id="footer-email-link" defaultHref="mailto:info@ltelectrical.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="hover:text-white transition-colors">
										<E id="footer-email-text" as="span">info@ltelectrical.co.uk</E>
									</EditableLink>
								</div>
								<div className="flex items-center gap-2">
									<EIcon id="footer-address-icon" defaultIcon="map-pin" className="size-4" />
									<E id="footer-address" as="span">Spalding, Lincolnshire</E>
								</div>
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Services</h3>
							<ul className="space-y-2 text-slate-400">
								<li>Domestic Electrical</li>
								<li>Commercial Electrical</li>
								<li>Emergency Callouts</li>
								<li>
									<Dialog>
										<DialogTrigger className="hover:text-white transition-colors cursor-pointer">
											EICR & Testing →
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
											<EICRGuideContent />
										</DialogContent>
									</Dialog>
								</li>
								<li>
									<Dialog>
										<DialogTrigger className="hover:text-white transition-colors cursor-pointer">
											PAT Testing →
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
											<PATTestingGuideContent />
										</DialogContent>
									</Dialog>
								</li>
								<li>EV Charger Installation</li>
								<li>Fire & Safety Systems</li>
								<li>
									<Dialog>
										<DialogTrigger className="hover:text-white transition-colors cursor-pointer">
											Community Defibrillators →
										</DialogTrigger>
										<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
											<DefibrillatorArticleContent />
										</DialogContent>
									</Dialog>
								</li>
								<li>
									<Link to="/news" className="hover:text-white transition-colors">
										News & Guides →
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Areas Served</h3>
							<ul className="space-y-2 text-slate-400">
								<li>Spalding</li>
								<li>Pinchbeck</li>
								<li>Bourne</li>
								<li>Holbeach</li>
								<li>Market Deeping</li>
								<li>Stamford</li>
								<li>Peterborough</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-slate-800 pt-8">
						<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
							<p>&copy; 2026 LT Electrical Services. All rights reserved.</p>
							<div className="flex gap-6">
								<EditableLink id="footer-privacy-link" defaultHref="#" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="hover:text-white transition-colors">
									<E id="footer-privacy-text" as="span">Privacy Policy</E>
								</EditableLink>
								<EditableLink id="footer-terms-link" defaultHref="#" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="hover:text-white transition-colors">
									<E id="footer-terms-text" as="span">Terms of Service</E>
								</EditableLink>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
