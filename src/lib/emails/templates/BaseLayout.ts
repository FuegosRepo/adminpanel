
export function BaseLayout(content: string, options?: { headerUrl?: string }): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fuegos d'Azur</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.3;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
          background-color: #f5f5f5;
        }
        .email-container {
          background-color: white;
          border-radius: 4px;
          padding: 5px;
          box-shadow: none;
        }
        .header {
          text-align: center;
          margin-bottom: 0;
          padding-bottom: 2px;
          border-bottom: 2px solid #d97706;
        }
        .logo {
          font-size: 20px;
          font-weight: bold;
          color: #d97706;
          margin: 0;
        }
        .content {
          margin-bottom: 0;
          white-space: pre-line;
        }
        .footer {
          text-align: center;
          margin-top: 5px;
          padding-top: 5px;
          border-top: 1px solid #e5e7eb;
          font-size: 10px;
          color: #6b7280;
        }
        .contact-info {
          margin-top: 2px;
        }
        .contact-info a {
          color: #d97706;
          text-decoration: none;
        }
        /* Elements from budget template */
        .highlight-box {
          background-color: #fef3c7;
          border-left: 3px solid #e2943a;
          padding: 5px;
          margin: 4px 0;
          border-radius: 4px;
        }
        .highlight-title {
          font-size: 14px;
          font-weight: 600;
          color: #78350f;
          margin-bottom: 2px;
        }
        .signature-box {
           margin-top: 5px;
           padding: 5px;
           background-color: #1f2937;
           color: white;
           border-radius: 4px;
        }
        .signature-name {
           font-size: 14px;
           font-weight: 600;
           color: #e2943a;
           margin-bottom: 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          ${options?.headerUrl
      ? `<img src="${options.headerUrl}" alt="Fuegos d'Azur" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 4px 4px 0 0;" />`
      : `
              <h1 class="logo">🔥 Fuegos d'Azur</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Service Traiteur - Asado Argentin</p>
            `
    }
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <p><strong>Fuegos d'Azur</strong></p>
          <div class="contact-info">
            <p>📞 07 50 85 35 99 • 06 70 65 97 84</p>
            <p>📧 <a href="mailto:contact@fuegosdazur.com">contact@fuegosdazur.com</a></p>
            <p>📍 Côte d'Azur, France</p>
          </div>
          <p style="margin-top: 20px; font-size: 11px;">
            © ${new Date().getFullYear()} Fuegos d'Azur. Tous droits réservés.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
