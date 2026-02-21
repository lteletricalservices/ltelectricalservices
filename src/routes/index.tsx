import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { ContactQuoteORM, ContactQuoteServiceType, type ContactQuoteModel } from "@/sdk/database/orm/orm_contact_quote";
import { useAdmin, E, EditableLink, EditableImage, EditableColor } from "@/lib/admin-context";

export const Route = createFileRoute("/")({
	component: App,
});

const formSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 characters"),
	service_type: z.string().min(1, "Please select a service type"),
	message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const HERO_IMAGE_KEY = "lt-electrical-hero-image";

function EICRGuideContent() {
	return (
		<div className="prose prose-lg max-w-none">
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-slate-900">
					Do You Need an EICR in Lincolnshire?
				</DialogTitle>
				<p className="text-lg text-slate-600 mt-2">
					A guide for landlords and homeowners across Spalding, Pinchbeck and surrounding areas.
				</p>
			</DialogHeader>

			<div className="mt-6 space-y-6">
				<p className="text-base text-slate-700 leading-relaxed">
					Electrical safety is something many property owners don't think about until there's a problem. An Electrical Installation Condition Report (EICR) is designed to identify issues before they become dangerous or expensive.
				</p>

				<p className="text-base text-slate-700 leading-relaxed">
					At LT Electrical Services, we carry out EICRs for landlords, homeowners, businesses and parish properties across Spalding, Pinchbeck, Bourne, Holbeach, Market Deeping and surrounding areas.
				</p>

				<div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
					<div className="flex items-start gap-3">
						<ClipboardCheck className="size-6 text-blue-600 shrink-0 mt-1" />
						<div>
							<h3 className="font-semibold text-base text-slate-900 mb-2">Quick Contact</h3>
							<p className="text-sm text-slate-700 mb-2">Need an EICR? Get in touch today.</p>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<a href="tel:01775710743" className="flex items-center gap-2 hover:text-blue-600">
									<Phone className="size-3" />
									01775 710743
								</a>
								<a href="mailto:admin@ltelectricalservices.co.uk" className="flex items-center gap-2 hover:text-blue-600">
									<Mail className="size-3" />
									admin@ltelectricalservices.co.uk
								</a>
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">What is an EICR?</h2>
				<p className="text-base text-slate-700">
					An EICR is a formal inspection of the electrical systems in a property. It checks:
				</p>

				<ul className="space-y-2">
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Wiring condition</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Consumer unit safety</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Earthing and bonding</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Sockets, switches and fittings</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Potential fire or shock risks</span>
					</li>
				</ul>

				<p className="text-base text-slate-700">
					At the end of the inspection, you receive a report showing whether the installation is:
				</p>

				<div className="grid md:grid-cols-2 gap-3">
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<CheckCircle2 className="size-5 text-green-600" />
							<h3 className="font-semibold text-base text-slate-900">Satisfactory</h3>
						</div>
						<p className="text-sm text-slate-700">Your electrical installation is safe and compliant</p>
					</div>
					<div className="border-2 border-orange-200 bg-orange-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<AlertCircle className="size-5 text-orange-600" />
							<h3 className="font-semibold text-base text-slate-900">Unsatisfactory</h3>
						</div>
						<p className="text-sm text-slate-700">Recommended actions and repairs are needed</p>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">Who needs an EICR?</h2>

				<div className="space-y-4">
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Users className="size-8 text-blue-600 shrink-0" />
							<div>
								<h3 className="font-semibold text-lg text-slate-900 mb-2">Landlords</h3>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<span className="text-sm text-slate-700">Required by law to have a valid EICR</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<span className="text-sm text-slate-700">Must be renewed every 5 years or at change of tenancy</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Home className="size-8 text-blue-600 shrink-0" />
							<div>
								<h3 className="font-semibold text-lg text-slate-900 mb-2">Homeowners</h3>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<span className="text-sm text-slate-700">Recommended every 10 years</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<span className="text-sm text-slate-700">Essential when buying or selling a property</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Building2 className="size-8 text-blue-600 shrink-0" />
							<div>
								<h3 className="font-semibold text-lg text-slate-900 mb-2">Businesses</h3>
								<ul className="space-y-1">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<span className="text-sm text-slate-700">Required as part of health and safety compliance</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
										<span className="text-sm text-slate-700">Frequency depends on the type of premises</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">What happens during the inspection?</h2>
				<p className="text-base text-slate-700">Our qualified 2391 electrician will:</p>

				<div className="bg-slate-50 rounded-lg p-4 space-y-3">
					<div className="flex items-start gap-2">
						<span className="flex items-center justify-center size-6 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0">1</span>
						<div>
							<h4 className="font-semibold text-sm text-slate-900">Visually inspect the installation</h4>
							<p className="text-sm text-slate-700">Check all visible electrical components</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<span className="flex items-center justify-center size-6 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0">2</span>
						<div>
							<h4 className="font-semibold text-sm text-slate-900">Carry out electrical tests</h4>
							<p className="text-sm text-slate-700">Test circuits, earthing, and protection devices</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<span className="flex items-center justify-center size-6 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0">3</span>
						<div>
							<h4 className="font-semibold text-sm text-slate-900">Identify any faults or risks</h4>
							<p className="text-sm text-slate-700">Highlight safety hazards</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<span className="flex items-center justify-center size-6 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0">4</span>
						<div>
							<h4 className="font-semibold text-sm text-slate-900">Provide a full written report</h4>
							<p className="text-sm text-slate-700">Detailed documentation of findings</p>
						</div>
					</div>
				</div>

				<p className="text-base text-slate-700">
					We always explain the findings clearly and provide honest advice on any remedial work.
				</p>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">Why choose LT Electrical Services?</h2>
				<div className="grid md:grid-cols-2 gap-3">
					<div className="flex items-start gap-2">
						<Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<div>
							<h4 className="font-semibold text-sm text-slate-900">NAPIT registered electricians</h4>
							<p className="text-xs text-slate-700">Certified professionals you can trust</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<div>
							<h4 className="font-semibold text-sm text-slate-900">Government TrustMark approved</h4>
							<p className="text-xs text-slate-700">Recognized for quality</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<ClipboardCheck className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<div>
							<h4 className="font-semibold text-sm text-slate-900">2391 qualified for testing</h4>
							<p className="text-xs text-slate-700">Specialist qualifications</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<Users className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<div>
							<h4 className="font-semibold text-sm text-slate-900">Trusted by councils</h4>
							<p className="text-xs text-slate-700">Serving councils and businesses</p>
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8">
					<h3 className="text-xl font-bold mb-2">Book your EICR</h3>
					<p className="text-sm mb-4">
						Get in touch for an EICR in Spalding, Pinchbeck or surrounding areas.
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<a href="tel:01775710743" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Phone className="size-4" />
							Call: 01775 710743
						</a>
						<a href="mailto:admin@ltelectricalservices.co.uk" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Mail className="size-4" />
							Email Us
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

function PATTestingGuideContent() {
	return (
		<div className="prose prose-lg max-w-none">
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-slate-900">
					What Is PAT Testing and Does Your Business Need It?
				</DialogTitle>
				<p className="text-lg text-slate-600 mt-2">
					A simple guide to PAT testing for offices, shops, parish buildings and commercial properties in Spalding and surrounding areas.
				</p>
			</DialogHeader>

			<div className="mt-6 space-y-6">
				<p className="text-base text-slate-700 leading-relaxed">
					If you run a business, office, shop or community building, you're responsible for making sure electrical equipment is safe. One of the simplest ways to do this is through PAT testing.
				</p>

				<p className="text-base text-slate-700 leading-relaxed">
					LT Electrical Services provides professional PAT testing across Lincolnshire and Cambridgeshire working with businesses, parish councils, and commercial clients.
				</p>

				<div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
					<div className="flex items-start gap-3">
						<Plug className="size-6 text-blue-600 shrink-0 mt-1" />
						<div>
							<h3 className="font-semibold text-base text-slate-900 mb-2">Quick Contact</h3>
							<p className="text-sm text-slate-700 mb-2">Need PAT testing? Get in touch today.</p>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<a href="tel:01775710743" className="flex items-center gap-2 hover:text-blue-600">
									<Phone className="size-3" />
									01775 710743
								</a>
								<a href="mailto:admin@ltelectricalservices.co.uk" className="flex items-center gap-2 hover:text-blue-600">
									<Mail className="size-3" />
									admin@ltelectricalservices.co.uk
								</a>
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">What is PAT testing?</h2>
				<p className="text-base text-slate-700">
					PAT stands for Portable Appliance Testing. It involves checking electrical appliances to make sure they are safe to use.
				</p>
				<p className="text-base text-slate-700">This includes items such as:</p>

				<ul className="space-y-2">
					{["Kettles", "Computers", "Extension leads", "Power tools", "Printers", "Kitchen appliances", "Heaters"].map((item) => (
						<li key={item} className="flex items-start gap-2">
							<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
							<span className="text-base text-slate-700">{item}</span>
						</li>
					))}
				</ul>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">Is PAT testing a legal requirement?</h2>
				<p className="text-base text-slate-700">
					PAT testing itself is not specifically required by law, but the law does require all electrical equipment to be safe.
				</p>
				<p className="text-base text-slate-700">For businesses, this falls under:</p>

				<ul className="space-y-2">
					<li className="flex items-start gap-2">
						<Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Health and Safety at Work Act</span>
					</li>
					<li className="flex items-start gap-2">
						<Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Electricity at Work Regulations</span>
					</li>
				</ul>

				<p className="text-base text-slate-700">
					PAT testing is the easiest way to prove you are meeting these responsibilities.
				</p>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">How often should PAT testing be done?</h2>
				<p className="text-base text-slate-700">This depends on the environment:</p>

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
								<td className="p-3 text-slate-700">Offices</td>
								<td className="p-3 text-slate-700">Every 2–4 years</td>
							</tr>
							<tr className="border-t bg-slate-50">
								<td className="p-3 text-slate-700">Shops</td>
								<td className="p-3 text-slate-700">Every 1–2 years</td>
							</tr>
							<tr className="border-t">
								<td className="p-3 text-slate-700">Construction sites</td>
								<td className="p-3 text-slate-700">Every 3–6 months</td>
							</tr>
							<tr className="border-t bg-slate-50">
								<td className="p-3 text-slate-700">Community buildings</td>
								<td className="p-3 text-slate-700">Every 1–2 years</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p className="text-base text-slate-700">
					We can advise the correct schedule for your premises.
				</p>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">What you receive</h2>
				<p className="text-base text-slate-700">After testing, you'll receive:</p>

				<div className="grid md:grid-cols-2 gap-3">
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<CheckCircle2 className="size-5 text-green-600" />
							<h3 className="font-semibold text-base text-slate-900">Appliance labels</h3>
						</div>
						<p className="text-sm text-slate-700">Clear pass/fail labels on every tested appliance</p>
					</div>
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<ClipboardCheck className="size-5 text-green-600" />
							<h3 className="font-semibold text-base text-slate-900">Full test report</h3>
						</div>
						<p className="text-sm text-slate-700">Comprehensive documentation of all tests performed</p>
					</div>
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<AlertCircle className="size-5 text-green-600" />
							<h3 className="font-semibold text-base text-slate-900">Pass/fail results</h3>
						</div>
						<p className="text-sm text-slate-700">Clear outcome for each appliance tested</p>
					</div>
					<div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<Shield className="size-5 text-green-600" />
							<h3 className="font-semibold text-base text-slate-900">Compliance record</h3>
						</div>
						<p className="text-sm text-slate-700">For insurance or inspection purposes</p>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">Trusted by local organisations</h2>
				<p className="text-base text-slate-700">We carry out work for:</p>

				<div className="space-y-4">
					{[
						{ icon: Users, label: "Parish councils" },
						{ icon: Building2, label: "Commercial clients" },
						{ icon: Home, label: "Retail premises" },
						{ icon: Users, label: "Community buildings" },
					].map((item) => (
						<div key={item.label} className="flex items-center gap-3 border rounded-lg p-3">
							<item.icon className="size-6 text-blue-600 shrink-0" />
							<span className="text-base text-slate-700 font-medium">{item.label}</span>
						</div>
					))}
				</div>

				<p className="text-base text-slate-700">
					Including clients such as KFC Spalding, YMCA Peterborough and local parish organisations.
				</p>

				<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8">
					<h3 className="text-xl font-bold mb-2">Book PAT testing</h3>
					<p className="text-sm mb-4">
						Contact us today for reliable and efficient PAT testing across Spalding, Pinchbeck and surrounding areas.
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<a href="tel:01775710743" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Phone className="size-4" />
							Call: 01775 710743
						</a>
						<a href="mailto:admin@ltelectricalservices.co.uk" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Mail className="size-4" />
							Email Us
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

function DefibrillatorArticleContent() {
	return (
		<div className="prose prose-lg max-w-none">
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-slate-900">
					Supporting the Community: Free Defibrillator Installations in Pinchbeck
				</DialogTitle>
				<p className="text-lg text-slate-600 mt-2">
					How LT Electrical Services has supported local safety by installing defibrillators for community organisations in Pinchbeck and the surrounding area.
				</p>
			</DialogHeader>

			<div className="mt-6 space-y-6">
				<p className="text-base text-slate-700 leading-relaxed">
					At LT Electrical Services, we believe being part of the community means more than just carrying out electrical work. It means giving something back.
				</p>

				<p className="text-base text-slate-700 leading-relaxed">
					Over the years, we've been proud to install defibrillators free of charge for local organisations to help improve public safety.
				</p>

				<div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
					<div className="flex items-start gap-3">
						<Heart className="size-6 text-red-500 shrink-0 mt-1" />
						<div>
							<h3 className="font-semibold text-base text-slate-900 mb-2">Quick Contact</h3>
							<p className="text-sm text-slate-700 mb-2">Want to discuss a defibrillator installation? Get in touch.</p>
							<div className="flex flex-col gap-1 text-sm text-slate-700">
								<a href="tel:01775710743" className="flex items-center gap-2 hover:text-blue-600">
									<Phone className="size-3" />
									01775 710743
								</a>
								<a href="mailto:admin@ltelectricalservices.co.uk" className="flex items-center gap-2 hover:text-blue-600">
									<Mail className="size-3" />
									admin@ltelectricalservices.co.uk
								</a>
							</div>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">Supporting local organisations</h2>
				<p className="text-base text-slate-700">
					We have provided free defibrillator installations for:
				</p>

				<div className="space-y-4">
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Users className="size-8 text-red-500 shrink-0" />
							<div>
								<h3 className="font-semibold text-lg text-slate-900">YMCA Trinity Group</h3>
							</div>
						</div>
					</div>
					<div className="border rounded-lg p-4">
						<div className="flex items-start gap-3">
							<Home className="size-8 text-red-500 shrink-0" />
							<div>
								<h3 className="font-semibold text-lg text-slate-900">St Mary's Church Hall, Pinchbeck</h3>
							</div>
						</div>
					</div>
				</div>

				<p className="text-base text-slate-700">
					These installations ensure that life-saving equipment is available in the event of a cardiac emergency.
				</p>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">Why defibrillators matter</h2>
				<p className="text-base text-slate-700">
					When someone suffers a cardiac arrest:
				</p>

				<ul className="space-y-2">
					<li className="flex items-start gap-2">
						<AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Every minute without treatment reduces survival chances</span>
					</li>
					<li className="flex items-start gap-2">
						<Heart className="size-5 text-red-500 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">A defibrillator can dramatically increase survival rates</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
						<span className="text-base text-slate-700">Community access to defibrillators saves lives</span>
					</li>
				</ul>

				<p className="text-base text-slate-700">
					By installing these units, we're helping create a safer environment for everyone.
				</p>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">A business rooted in the community</h2>
				<p className="text-base text-slate-700">
					We're proud to work with and support:
				</p>

				<div className="space-y-4">
					{[
						{ icon: Users, label: "Pinchbeck Parish" },
						{ icon: Users, label: "Gosberton Parish" },
						{ icon: Building2, label: "YMCA Peterborough" },
						{ icon: Heart, label: "Local charities and community groups" },
					].map((item) => (
						<div key={item.label} className="flex items-center gap-3 border rounded-lg p-3">
							<item.icon className="size-6 text-blue-600 shrink-0" />
							<span className="text-base text-slate-700 font-medium">{item.label}</span>
						</div>
					))}
				</div>

				<div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mt-6">
					<div className="flex items-start gap-3">
						<PawPrint className="size-8 text-purple-600 shrink-0" />
						<div>
							<h3 className="font-semibold text-lg text-slate-900 mb-2">Supporting animal welfare</h3>
							<p className="text-base text-slate-700">
								As fervent animal lovers, we have also supported Peterborough Cats Protection by wiring their cat runs and donating food and blankets.
							</p>
						</div>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-slate-900 mt-8">Looking after the community we serve</h2>
				<p className="text-base text-slate-700">
					Our work takes us into homes, businesses and community spaces every day. Supporting local causes is simply part of our ethos.
				</p>

				<p className="text-base text-slate-700">
					If your organisation is considering donating or installing a defibrillator, we're always happy to offer advice.
				</p>

				<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mt-8">
					<h3 className="text-xl font-bold mb-2">Get in touch</h3>
					<p className="text-sm mb-4">
						Whether you need electrical work or want to discuss a community defibrillator installation, we'd love to hear from you.
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<a href="tel:01775710743" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Phone className="size-4" />
							Call: 01775 710743
						</a>
						<a href="mailto:admin@ltelectricalservices.co.uk" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
							<Mail className="size-4" />
							Email Us
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

function App() {
	const { isAdmin, contentEdits, handleContentSave } = useAdmin();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [heroImage, setHeroImage] = useState<string | null>(null);
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
			service_type: "",
			message: "",
		},
	});

	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true);
		try {
			const orm = ContactQuoteORM.getInstance();

			const serviceTypeMap: Record<string, ContactQuoteServiceType> = {
				"Domestic Electrical": ContactQuoteServiceType.DomesticElectrical,
				"Commercial Electrical": ContactQuoteServiceType.CommercialElectrical,
				"Emergency Callouts": ContactQuoteServiceType.EmergencyCallouts,
			};

			const contactQuote: Partial<ContactQuoteModel> = {
				name: values.name,
				email: values.email,
				phone: values.phone,
				service_type: serviceTypeMap[values.service_type] || ContactQuoteServiceType.Unspecified,
				message: values.message,
			};

			await orm.insertContactQuote([contactQuote as ContactQuoteModel]);
			setSubmitSuccess(true);
			form.reset();
			setTimeout(() => setSubmitSuccess(false), 5000);
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const scrollToContact = () => {
		document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
	};

	const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const dataUrl = event.target?.result as string;
			setHeroImage(dataUrl);
			localStorage.setItem(HERO_IMAGE_KEY, dataUrl);
		};
		reader.readAsDataURL(file);
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
						<Zap className="size-8 text-blue-400" />
						<E id="header-name" as="span" className="text-xl font-bold">LT Electrical Services</E>
					</div>
					<div className="flex items-center gap-6">
						<Link to="/news" className="hidden sm:inline hover:text-blue-400 transition-colors font-medium">
							News
						</Link>
						<EditableLink id="header-phone-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
							<Phone className="size-4" />
							<span className="hidden sm:inline"><E id="header-phone-text" as="span">01775 710743</E></span>
						</EditableLink>
						<Button onClick={scrollToContact} size="sm" className="bg-blue-600 hover:bg-blue-700">
							<E id="header-btn-text" as="span">Get Quote</E>
						</Button>
					</div>
				</div>
			</EditableColor>

			<section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 md:py-32 overflow-hidden">
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
										>
											<Upload className="size-4 mr-1" />
											Upload Image
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
			</section>

			<section className="py-12 bg-white border-b">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div className="flex flex-col items-center text-center gap-3">
							<Shield className="size-12 text-blue-600" />
							<div>
								<E id="trust-1-title" as="div" className="font-semibold text-slate-900">NAPIT Registered</E>
								<E id="trust-1-sub" as="div" className="text-sm text-slate-600">Certified professionals</E>
							</div>
						</div>
						<div className="flex flex-col items-center text-center gap-3">
							<CheckCircle2 className="size-12 text-green-600" />
							<div>
								<E id="trust-2-title" as="div" className="font-semibold text-slate-900">Fully Insured</E>
								<E id="trust-2-sub" as="div" className="text-sm text-slate-600">Complete protection</E>
							</div>
						</div>
						<div className="flex flex-col items-center text-center gap-3">
							<Clock className="size-12 text-orange-600" />
							<div>
								<E id="trust-3-title" as="div" className="font-semibold text-slate-900">24/7 Emergency</E>
								<E id="trust-3-sub" as="div" className="text-sm text-slate-600">Always available</E>
							</div>
						</div>
						<div className="flex flex-col items-center text-center gap-3">
							<Star className="size-12 text-yellow-600" />
							<div>
								<E id="trust-4-title" as="div" className="font-semibold text-slate-900">5-Star Reviews</E>
								<E id="trust-4-sub" as="div" className="text-sm text-slate-600">Customer rated</E>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-slate-50">
				<div className="container mx-auto px-4">
					<E id="services-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Our Services</E>
					<E id="services-sub" as="p" className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Comprehensive electrical solutions for homes and businesses across Lincolnshire and Cambridgeshire</E>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<Zap className="size-10 text-blue-600 mb-3" />
								<CardTitle><E id="svc-1-title" as="span">Domestic Electrical</E></CardTitle>
								<CardDescription>
									<E id="svc-1-desc" as="span">Complete home electrical services including rewiring, socket installation, lighting, and consumer unit upgrades.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<Building2 className="size-10 text-blue-600 mb-3" />
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
								<AlertCircle className="size-10 text-orange-600 mb-3" />
								<CardTitle><E id="svc-3-title" as="span">Emergency Callouts</E></CardTitle>
								<CardDescription>
									<E id="svc-3-desc" as="span">24/7 emergency electrical services for urgent repairs, power failures, and safety concerns.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<ClipboardCheck className="size-10 text-green-600 mb-3" />
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
								<Car className="size-10 text-purple-600 mb-3" />
								<CardTitle><E id="svc-5-title" as="span">EV Charger Installation</E></CardTitle>
								<CardDescription>
									<E id="svc-5-desc" as="span">Expert installation of electric vehicle charging points for home and commercial properties.</E>
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<Flame className="size-10 text-red-600 mb-3" />
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
			</section>

			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<E id="why-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Why Choose Us</E>
					<E id="why-sub" as="p" className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Local expertise, professional service, and complete peace of mind</E>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="flex gap-4">
							<MapPin className="size-6 text-blue-600 shrink-0 mt-1" />
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
							<Users className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-2-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Qualified Electricians</E>
								<E id="why-2-desc" as="p" className="text-slate-600">NAPIT registered professionals with extensive training and experience.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<DollarSign className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-3-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Clear Pricing</E>
								<E id="why-3-desc" as="p" className="text-slate-600">Transparent quotes with no hidden fees. You know the cost upfront.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<Sparkles className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-4-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Tidy Work</E>
								<E id="why-4-desc" as="p" className="text-slate-600">We respect your property and leave it clean and tidy after every job.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<TrendingUp className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-5-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Fast Response</E>
								<E id="why-5-desc" as="p" className="text-slate-600">Quick turnaround times and same-day emergency callouts available.</E>
							</div>
						</div>
						<div className="flex gap-4">
							<Shield className="size-6 text-blue-600 shrink-0 mt-1" />
							<div>
								<E id="why-6-title" as="h3" className="font-semibold text-lg mb-2 text-slate-900">Quality Guaranteed</E>
								<E id="why-6-desc" as="p" className="text-slate-600">All work backed by our quality guarantee and public liability insurance.</E>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-slate-50">
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
			</section>

			<section className="py-16 bg-white">
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
			</section>

			<section className="py-16 bg-slate-50">
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
			</section>

			<EditableColor id="cta-bg-color" defaultColor="#2563eb" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
				<div className="container mx-auto px-4 text-center">
					<E id="cta-heading" as="h2" className="text-3xl md:text-4xl font-bold mb-4">Need a reliable electrician?</E>
					<E id="cta-sub" as="p" className="text-xl mb-6">Get your free quote today</E>
					<Button onClick={scrollToContact} size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8">
						<E id="cta-btn-text" as="span">Request Free Quote</E>
					</Button>
				</div>
			</EditableColor>

			<section id="contact-form" className="py-16 bg-white">
				<div className="container mx-auto px-4 max-w-2xl">
					<E id="contact-heading" as="h2" className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">Get Your Free Quote</E>
					<E id="contact-sub" as="p" className="text-center text-slate-600 mb-8">Fill in the form below and we'll get back to you as soon as possible</E>

					{submitSuccess && (
						<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
							<CheckCircle2 className="size-5" />
							<p>Thank you! Your quote request has been submitted. We'll be in touch soon.</p>
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
										{isSubmitting ? "Submitting..." : "Submit Quote Request"}
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</section>

			<footer className="bg-slate-900 text-white py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<Zap className="size-8 text-blue-400" />
								<E id="footer-name" as="span" className="text-xl font-bold">LT Electrical</E>
							</div>
							<E id="footer-desc" as="p" className="text-slate-400">Professional electrical services across Lincolnshire and Cambridgeshire</E>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Contact</h3>
							<div className="space-y-2 text-slate-400">
								<div className="flex items-center gap-2">
									<Phone className="size-4" />
									<EditableLink id="footer-phone-link" defaultHref="tel:01775710743" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="hover:text-white transition-colors">
										<E id="footer-phone-text" as="span">01775 710743</E>
									</EditableLink>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="size-4" />
									<EditableLink id="footer-email-link" defaultHref="mailto:info@ltelectrical.co.uk" isAdmin={isAdmin} contentEdits={contentEdits} onSave={handleContentSave} className="hover:text-white transition-colors">
										<E id="footer-email-text" as="span">info@ltelectrical.co.uk</E>
									</EditableLink>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="size-4" />
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
