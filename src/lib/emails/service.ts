
import { Resend } from 'resend'
import { EmailParams, EmailResult } from './types'

// Lazy initialization to ensure env vars are available at runtime (Turbopack)
function getResendClient() {
    if (!process.env.RESEND_API_KEY) return null
    return new Resend(process.env.RESEND_API_KEY)
}

export async function sendEmail(params: EmailParams): Promise<EmailResult> {
    const { to, subject, html, from, fromName, attachments, tags } = params

    try {
        const resend = getResendClient()
        if (!resend) {
            console.warn('⚠️ RESEND_API_KEY no configurada. Email simulado.')
            return {
                success: false,
                error: 'RESEND_API_KEY no configurada'
            }
        }

        const defaultFromEmail = process.env.EMAIL_FROM || 'contact@fuegosdazur.fr'
        const defaultFromName = process.env.EMAIL_FROM_NAME || "Fuegos d'Azur"

        // In dev mode or without domain verification, we might need to fallback to onboarding
        // Logic: If on localhost or if explicitly requested via env for testing
        // Note: User can set EMAIL_FROM to onboarding@resend.dev in .env if needed
        const finalFrom = from || `${fromName || defaultFromName} <${defaultFromEmail}>`

        const { data, error } = await resend.emails.send({
            from: finalFrom,
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: html,
            attachments: attachments,
            tags: tags
        })

        if (error) {
            console.error('Error enviando email con Resend:', error)

            // Check for domain verification error
            if (error.message?.includes('verify a domain') || error.message?.includes('testing emails')) {
                return {
                    success: false,
                    error: 'Resend Domain Verification Error: ' + error.message
                }
            }

            throw new Error(`Error al enviar email: ${error.message}`)
        }

        console.log('✅ Email enviado correctamente:', data?.id)

        return {
            success: true,
            messageId: data?.id
        }

    } catch (error) {
        console.error('Error inesperado al enviar email:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

/**
 * Validar configuración de email
 */
export function validateEmailConfig(): { valid: boolean; error?: string } {
    if (!process.env.RESEND_API_KEY) {
        return {
            valid: false,
            error: 'RESEND_API_KEY no está configurada en las variables de entorno'
        }
    }

    if (!process.env.RESEND_API_KEY.startsWith('re_')) {
        return {
            valid: false,
            error: 'RESEND_API_KEY parece inválida (debe empezar con "re_")'
        }
    }

    return { valid: true }
}

/**
 * Procesar plantilla de email reemplazando variables
 */
export function processEmailTemplate(
    template: string,
    variables: Record<string, string | number>
): string {
    let processed = template

    Object.entries(variables).forEach(([key, value]) => {
        processed = processed.replaceAll(`{${key}}`, String(value))
    })

    return processed
}
