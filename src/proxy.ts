import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Proteger rutas (excepto login, api/auth, etc)
	const isLoginPage = request.nextUrl.pathname.startsWith("/login");
	// Rutas de API que llaman servicios externos sin sesión de usuario
	// (Stripe llama al webhook servidor a servidor, sin cookie de login).
	// Se protegen con su propia verificación de firma adentro de la ruta,
	// no con el login. Sin esto, Stripe nunca llegaría a /webhook — es lo
	// que probablemente le pasaba también al webhook de Systempay.
	const isPublicApi =
		request.nextUrl.pathname.startsWith("/api/auth") ||
		request.nextUrl.pathname === "/api/payments/stripe/webhook";
	// El cliente que paga no tiene sesión de admin: la pantalla a la que
	// Stripe lo devuelve tiene que ser pública, si no el proxy lo manda a /login.
	const isPublicPaymentResult = request.nextUrl.pathname.startsWith("/payments/success") ||
		request.nextUrl.pathname.startsWith("/payments/cancel");
	const isStaticAsset = request.nextUrl.pathname.match(/\.(.*)$/);

	if (!user && !isLoginPage && !isPublicApi && !isPublicPaymentResult && !isStaticAsset) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/login";
		return NextResponse.redirect(redirectUrl);
	}

	// Si ya está logueado e intenta ir al login, mandar al home
	if (user && isLoginPage) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/";
		return NextResponse.redirect(redirectUrl);
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
