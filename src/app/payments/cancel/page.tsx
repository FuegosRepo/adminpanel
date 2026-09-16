import { XCircle } from 'lucide-react'

/**
 * Página pública a la que Stripe redirige si el cliente cancela el pago
 * antes de terminar. No significa que haya un error, solo que no pagó.
 */
export default function PaymentCancelPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Helvetica Neue, Arial, sans-serif', padding: 24 }}>
            <div style={{ background: 'white', borderRadius: 8, padding: '40px 32px', maxWidth: 420, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <XCircle size={48} color="#d97706" style={{ margin: '0 auto 16px' }} />
                <h1 style={{ fontSize: 20, margin: '0 0 8px', color: '#111' }}>Paiement annulé</h1>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.5 }}>
                    Le paiement n&apos;a pas été finalisé. Aucun montant n&apos;a été débité.
                    Vous pouvez redemander un lien de paiement à Fuegos d&apos;Azur si besoin.
                </p>
            </div>
        </div>
    )
}
