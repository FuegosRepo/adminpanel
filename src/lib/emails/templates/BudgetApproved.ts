
interface BudgetApprovedTemplateProps {
  clientName: string
  totalTTC: string
  eventDate?: string
  logoUrl?: string
}

export function BudgetApprovedTemplate({ clientName, totalTTC, eventDate, logoUrl }: BudgetApprovedTemplateProps): string {
  // Note: We only return the inner content because we will likely wrap it in BaseLayout for consistency
  // However, the original design had a very specific layout. For this refactor, I will adapt it to fit the BaseLayout
  // OR keep it self-contained if it diverges too much.
  // The original one had its own html/head/body structure which is bad practice to nest.
  // I will produce the inner HTML body content here.

  return `
    <h1 style="color: #d97706; font-size: 20px; margin-bottom: 20px; margin-top: 0; text-align: left;">Bonjour ${clientName},</h1>

    <p style="font-size: 15px; margin-bottom: 15px; margin-top: 0; color: #374151;">Nous avons le plaisir de vous envoyer votre devis personnalisé pour votre événement.</p>
    
    ${eventDate ? `<p style="font-size: 15px; margin-bottom: 15px; margin-top: 0; color: #374151;"><strong>Date de l'événement:</strong> ${eventDate}</p>` : ''}

    <div class="highlight-box">
      <p class="highlight-title">Notre offre inclut:</p>
      <p style="font-size: 15px; color: #9a3412; margin-bottom: 5px; margin-top: 0; font-style: italic;">Une expérience gastronomique au brasero, 100 % sur mesure</p>
      <p style="font-size: 14px; color: #9a3412; margin: 0;">La préparation, Le service, et les options complémentaires demandées</p>
    </div>

    <div style="margin: 25px 0;">
      <p style="font-size: 15px; font-weight: 600; color: #1f2937; margin-bottom: 10px; margin-top: 0;">Pour confirmer votre date, il vous suffit de:</p>
      <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px; margin: 5px 0; color: #374151;">
        <li style="margin-bottom: 5px;">Nous renvoyer le devis signé</li>
        <li style="margin-bottom: 5px;">Verser un acompte de <strong style="color: #d97706;">30 %</strong></li>
      </ul>
    </div>

    <p style="font-size: 15px; margin: 15px 0; color: #374151; line-height: 1.6;">Notre objectif est de créer une expérience aussi fluide que mémorable, parfaitement adaptée à vos attentes.</p>

    <p style="font-size: 15px; margin: 15px 0; color: #374151; line-height: 1.6;">Si vous souhaitez apporter des modifications au menu ou discuter de tout autre détail, n’hésitez pas à me contacter. Je serai ravi de répondre à vos demandes et d’adapter la proposition selon vos besoins.</p>

    <p style="font-size: 15px; margin: 15px 0; color: #374151; line-height: 1.6;">Je reste à votre disposition pour toute question ou complément d’information.</p>

    <div class="signature-box">
      <div style="margin-bottom: 15px;">
        <p style="font-size: 15px; margin-bottom: 5px; margin-top: 0; color: #374151;">Cordialement.</p>
        <p class="signature-name">Jeronimo Negrotto</p>
        <p class="signature-name" style="font-size: 13px; color: #6b7280; font-weight: normal; margin: 0;">Fuegos d'Azur</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="middle" width="80" style="padding-right: 15px;">
            ${logoUrl ? `<img src="${logoUrl}" alt="Fuegos d'Azur" width="80" style="display: block;" />` : ''}
          </td>
          <td valign="middle" style="font-size: 13px; color: #6b7280; line-height: 1.5;">
            Tel: 07 50 85 35 99 • 06 70 65 97 84<br>
            Email: contact@fuegosdazur.com
          </td>
        </tr>
      </table>
    </div>
  `
}
