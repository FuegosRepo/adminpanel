
import { BudgetData } from '../types'

export function BudgetApprovedTemplate(data: BudgetData): string {
  const { clientName, eventDate, logoCid } = data

  // Note: We only return the inner content because we will likely wrap it in BaseLayout for consistency
  // However, the original design had a very specific layout. For this refactor, I will adapt it to fit the BaseLayout
  // OR keep it self-contained if it diverges too much.
  // The original one had its own html/head/body structure which is bad practice to nest.
  // I will produce the inner HTML body content here.

  return `
    <h1 style="color: #e2943a; font-size: 22px; margin-bottom: 8px;">Bonjour ${clientName},</h1>
    
    <p style="font-size: 15px; margin-bottom: 8px;">Nous avons le plaisir de vous envoyer votre devis personnalisé pour votre événement.</p>
    
    ${eventDate ? `<p style="font-size: 15px; margin-bottom: 8px;"><strong>Date de l'événement:</strong> ${eventDate}</p>` : ''}
    
    <div class="highlight-box">
      <p class="highlight-title">Notre offre inclut :</p>
      <p style="font-size: 15px; color: #78350f; margin-bottom: 5px; font-style: italic;">Une expérience gastronomique au brasero, 100 % sur mesure</p>
      <p style="font-size: 13px; color: #78350f; margin: 0;">La préparation, Le service, et les options complémentaires demandées</p>
    </div>
    
    <div style="margin: 10px 0;">
      <p style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 5px;">Pour confirmer votre date, il vous suffit de :</p>
      <ul style="font-size: 15px; line-height: 1.4; padding-left: 20px; margin: 5px 0;">
        <li style="margin-bottom: 3px;">Nous renvoyer le devis signé</li>
        <li style="margin-bottom: 3px;">Verser un acompte de <strong style="color: #e2943a;">30 %</strong></li>
      </ul>
    </div>
    
    <p style="font-size: 15px; margin: 8px 0;">Notre objectif est de créer une expérience aussi fluide que mémorable, parfaitement adaptée à vos attentes.</p>
    
    <p style="font-size: 15px; margin: 8px 0;">Si vous souhaitez apporter des modifications au menu ou discuter de tout autre détail, n’hésitez pas à me contacter. Je serai ravi de répondre à vos demandes et d’adapter la proposition selon vos besoins.</p>

    <p style="font-size: 15px; margin: 8px 0;">Je reste à votre disposition pour toute question ou complément d’information.</p>
    
    <div class="signature-box">
      <div style="margin-bottom: 8px;">
          <p style="font-size: 15px; margin-bottom: 5px; color: white;">Cordialement.</p>
          <p class="signature-name">Jeronimo Negrotto</p>
          <p class="signature-name" style="font-size: 13px; color: #e5e7eb; font-weight: normal;">Fuegos d'Azur</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #374151; margin: 8px 0;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
              <td valign="middle" width="70" style="padding-right: 10px;">
                  ${logoCid ? `<img src="cid:${logoCid}" alt="Fuegos d'Azur" width="60" style="display: block;" />` : ''}
              </td>
              <td valign="middle" style="font-size: 13px; color: #e5e7eb;">
                  Tel: 07 50 85 35 99 • 06 70 65 97 84<br>
                  Email: fuegosdazur@proton.me
              </td>
          </tr>
      </table>
    </div>
  `
}
