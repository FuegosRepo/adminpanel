import { Ban } from 'lucide-react'

const HEADER_LOGO_URL =
    process.env.EMAIL_HEADER_IMAGE_URL ||
    'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headerblack.png'

/**
 * Página pública a la que Stripe redirige si el cliente cancela el pago
 * antes de terminar. No significa que haya un error, solo que no pagó.
 * Mismo diseño que /payments/success, en tono neutro (no rojo: cancelar
 * no es una falla, es una decisión del cliente).
 */
export default function PaymentCancelPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4 py-12">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg overflow-hidden">
                <div className="bg-[#d97706] py-6 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={HEADER_LOGO_URL} alt="Fuegos d'Azur" className="h-9 w-auto" />
                </div>

                <div className="px-8 py-10 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                        <Ban className="h-9 w-9 text-neutral-500" strokeWidth={1.75} />
                    </div>

                    <h1 className="text-xl font-semibold text-neutral-900">Paiement annulé</h1>
                    <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                        Le paiement n&apos;a pas été finalisé. Aucun montant n&apos;a été débité.
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">
                        Vous pouvez redemander un lien de paiement à Fuegos d&apos;Azur si besoin.
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
