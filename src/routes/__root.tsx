import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminProvider, AdminToolbar, AdminLoginDialog } from "@/lib/admin-context";

export const Route = createRootRoute({
	component: Root,
});

function Root() {
	return (
		<AdminProvider>
			<div className="flex flex-col min-h-screen">
				<ErrorBoundary tagName="main" className="flex-1">
					<Outlet />
				</ErrorBoundary>
				<TanStackRouterDevtools position="bottom-right" />
				<AdminToolbar />
				<div className="fixed bottom-4 left-4 z-50">
					<AdminLoginDialog />
				</div>
			</div>
		</AdminProvider>
	);
}
