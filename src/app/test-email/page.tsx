
import { BaseLayout } from '@/lib/emails/templates/BaseLayout'
import { QuoteFollowUpTemplate } from '@/lib/emails/templates/QuoteFollowUp'

export const dynamic = 'force-dynamic'

export default function EmailPreviewPage() {
    const mockData = {
        clientName: 'Franco Corujo',
        logoUrl: 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/minilogoblack.png',
        headerUrl: 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headerblack.png',
    }

    const sampleBody = `Je me permets de revenir vers vous concernant le devis que nous vous avons envoyé il y a quelques jours pour votre événement.

Avez-vous eu l’occasion de le consulter tranquillement ?

N’hésitez pas à revenir vers nous si vous avez :

• Des modifications à apporter (menu, format, nombre d’invités, options)

• Des questions spécifiques sur notre fonctionnement ou nos services

• Ou simplement envie d’en discuter plus en détail par téléphone

Notre équipe est à votre écoute pour ajuster l’offre au plus près de vos envies et vous accompagner dans la réalisation d’un événement unique et sur mesure.

Dans l’attente de votre retour,`

    const innerHtml = QuoteFollowUpTemplate(sampleBody, {
        clientName: mockData.clientName,
        logoUrl: mockData.logoUrl
    })

    const fullHtml = BaseLayout(innerHtml, { headerUrl: mockData.headerUrl })

    return (
        <div dangerouslySetInnerHTML={{ __html: fullHtml }} />
    )
}
