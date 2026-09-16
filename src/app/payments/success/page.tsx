import { CheckCircle2 } from 'lucide-react'

/**
 * Página pública (sin login) a la que Stripe redirige al cliente después
 * de pagar. Fuera de (admin) a propósito: el cliente que paga no tiene
 * sesión de admin. Ver proxy.ts para la excepción de auth.
 */
export default function PaymentSuccessPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Helvetica Neue, Arial, sans-serif', padding: 24 }}>
            <div style={{ background: 'white', borderRadius: 8, padding: '40px 32px', maxWidth: 420, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                <h1 style={{ fontSize: 20, margin: '0 0 8px', color: '#111' }}>Paiement confirmé</h1>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.5 }}>
                    Merci ! Votre paiement a bien été enregistré. Vous recevrez une confirmation
                    par email. À bientôt pour votre événement.
                </p>
            </div>
        </div>
    )
}
