
export const QuoteFollowUpTemplate = (content: string, vars: { clientName: string; logoUrl?: string }) => {
  // Convert newlines to paragraphs/breaks to preserve user formatting
  // We assume content is plain text coming from the textarea
  const formattedContent = content
    .split('\n')
    .filter(line => line.trim() !== '') // Remove empty lines to avoid excess spacing
    .map(line => {
      const isListItem = line.trim().startsWith('•')
      const paddingStyle = isListItem ? 'padding-left: 30px;' : ''
      return `<p style="font-size: 15px; margin: 10px 0; color: #374151; line-height: 1.5; ${paddingStyle}">${line}</p>`
    })
    .join('')

  return `
    <h1 style="color: #d97706; font-size: 20px; margin-bottom: 15px; margin-top: 0; text-align: left;">Bonjour ${vars.clientName},</h1>

    ${formattedContent}

    <div class="signature-box" style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="middle" width="90" style="padding-right: 15px;">
            ${vars.logoUrl ? `<img src="${vars.logoUrl}" alt="Fuegos d'Azur" width="70" style="display: block; width: 70px;" />` : ''}
          </td>
          <td valign="middle" style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #374151; line-height: 1.4;">
            <div style="margin-bottom: 5px;">Cordialement.</div>
            <div style="font-weight: bold; color: #d97706; font-size: 15px;">Jeronimo Negrotto</div>
            <div style="color: #6b7280; font-size: 13px;">Fuegos d'Azur</div>
            <div style="color: #9ca3af; font-size: 12px; font-style: italic; margin-top: 5px;">Authenticité – Élégance – Feu</div>
          </td>
        </tr>
      </table>
    </div>
  `
}
