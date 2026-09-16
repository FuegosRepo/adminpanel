import { CheckCircle2 } from 'lucide-react'

const HEADER_LOGO_URL =
    process.env.EMAIL_HEADER_IMAGE_URL ||
    'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headerblack.png'

/**
 * Página pública (sin login) a la que Stripe redirige al cliente después
 * de pagar. Fuera de (admin) a propósito: el cliente que paga no tiene
 * sesión de admin. Ver proxy.ts para la excepción de auth.
 *
 * Mismo logo que ya reciben en los emails (headerblack.png en Supabase
 * Storage), y el color de marca (#d97706, hsl(30 78% 56%)) del panel.
 *
 * El archivo es la firma "Fuegos d'Azur" con el eslogan chico debajo.
 * BaseLayout.ts lo usa en los emails a 200px de ancho y se ve bien ahí
 * — el error del primer intento fue forzarlo a una franja de 36px de
 * alto, que lo dejaba ilegible. Acá se muestra completo, sin recortar,
 * a un ancho similar (220px) al que ya funciona en los emails.
 */
export default function PaymentSuccessPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4 py-12">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg overflow-hidden">
                <div className="bg-[#d97706] py-7 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={HEADER_LOGO_URL} alt="Fuegos d'Azur" className="w-[220px] h-auto" />
                </div>

                <div className="px-8 py-10 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-9 w-9 text-emerald-600" strokeWidth={1.75} />
                    </div>

                    <h1 className="text-xl font-semibold text-neutral-900">Paiement confirmé</h1>
                    <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                        Merci ! Votre paiement a bien été enregistré. Vous recevrez une
                        confirmation par email dans quelques instants.
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">
                        Nous avons hâte de vous accueillir pour votre événement.
                    </p>

                    <div className="mt-8 border-t border-neutral-100 pt-6">
                        <p className="text-xs text-neutral-400">
                            Une question ? Écrivez-nous à{' '}
                            <a href="mailto:contact@fuegosdazur.com" className="font-medium text-[#d97706] hover:underline">
                                contact@fuegosdazur.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
