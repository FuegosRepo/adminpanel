import { BudgetData } from './types/budget'
import fs from 'fs'
import path from 'path'

// Función helper para convertir imagen a base64
function imageToBase64(imagePath: string): string {
  try {
    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️ Imagen no encontrada: ${imagePath}`)
      return ''
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const ext = path.extname(imagePath).toLowerCase()
    let mimeType = 'image/png'

    if (ext === '.webp') {
      mimeType = 'image/webp'
    } else if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg'
    }

    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`
  } catch (error) {
    console.error(`❌ Error leyendo imagen ${imagePath}:`, error)
    return ''
  }
}

// Función helper para obtener la ruta de las imágenes
function getImagePath(filename: string): string {
  const possiblePaths = [
    path.join(process.cwd(), 'src', 'lib', filename),
    path.join(process.cwd(), '.next', 'server', 'src', 'lib', filename),
    path.join(process.cwd(), 'lib', filename),
  ]

  for (const imagePath of possiblePaths) {
    if (fs.existsSync(imagePath)) {
      return imagePath
    }
  }

  return path.join(process.cwd(), 'src', 'lib', filename)
}

// Función helper para limpiar texto (remover emojis)
function cleanText(text: string): string {
  if (!text) return ''
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .trim()
}

// Función helper para mejorar el formato de textos con guiones y otros casos
function formatText(text: string): string {
  if (!text) return ''

  // Limpiar emojis primero
  let formatted = cleanText(text)

  // Mejorar casos específicos comunes primero (antes de procesar guiones)
  const replacements: { [key: string]: string } = {
    'verres-eau': 'Verres d\'eau',
    'verres-vin': 'Verres de vin',
    'verres-champagne': 'Verres de champagne',
    'mange-debout': 'Mange-debout',
    'assiettes-plates': 'Assiettes plates',
    'assiettes-creuses': 'Assiettes creuses',
  }

  // Aplicar reemplazos específicos (case insensitive)
  const lowerText = formatted.toLowerCase()
  for (const [key, value] of Object.entries(replacements)) {
    if (lowerText.includes(key.toLowerCase())) {
      formatted = formatted.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), value)
      // Si se aplicó un reemplazo, retornar directamente
      if (formatted.toLowerCase() !== lowerText) {
        return formatted
      }
    }
  }

  // Si no hay reemplazo específico, capitalizar palabras separadas por guiones, manteniendo el guion
  formatted = formatted
    .split(/([-_])/) // Dividir manteniendo los separadores
    .map((part) => {
      // Si es un separador, mantenerlo
      if (part === '-' || part === '_') {
        return part
      }
      // Capitalizar primera letra de cada palabra
      if (part.length > 0) {
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      }
      return part
    })
    .join('')

  // Capitalizar primera letra de la frase completa
  if (formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  return formatted
}

export function generateBudgetHTML(budgetData: BudgetData): string {
  // Cargar imágenes
  const overlayPath = getImagePath('ground-overlay-01.png')

  // Try PNG logo first
  let miniLogoPath = getImagePath('minilogo.png')
  if (!fs.existsSync(miniLogoPath)) {
    miniLogoPath = getImagePath('minilogo.webp')
  }

  const overlayBase64 = imageToBase64(overlayPath)
  const miniLogoBase64 = imageToBase64(miniLogoPath)

  // Fix date off-by-one error by handling YYYY-MM-DD manually
  let eventDate = 'Date non définie'
  try {
    if (budgetData.clientInfo.eventDate) {
      const [year, month, day] = budgetData.clientInfo.eventDate.split('-').map(Number)
      if (year && month && day) {
        eventDate = new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }
    }
  } catch (e) {
    console.warn('Error formatting eventDate', e)
  }

  let validUntilDate = ''
  try {
    validUntilDate = new Date(budgetData.validUntil || Date.now()).toLocaleDateString('fr-FR')
  } catch (e) { validUntilDate = new Date().toLocaleDateString('fr-FR') }

  let generatedDate = ''
  try {
    generatedDate = new Date(budgetData.generatedAt || Date.now()).toLocaleDateString('fr-FR')
  } catch (e) { generatedDate = new Date().toLocaleDateString('fr-FR') }
  const menuTypeText = budgetData.clientInfo.menuType === 'dejeuner' ? 'Déjeuner' : 'Dîner'

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Devis - Fuegos d'Azur</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Helvetica', Arial, sans-serif;
      background-color: #fed7aa;
      color: #333333;
      line-height: 1.5;
      padding: 0;
      margin: 0;
      width: 210mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      background-color: #fed7aa;
      margin: 0 auto;
      padding: 0;
      position: relative;
    }

    /* HEADER */
    .header {
      background-color: #e2943a;
      color: white;
      padding: 15mm 20mm 10mm 20mm; /* Increased top padding */
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }

    .header-logo {
      width: 25mm;
      height: auto;
      object-fit: contain;
    }

    .header-text {
      flex: 1;
      text-align: center;
    }

    /* ... */

    /* CONTENT */
    .content {
      padding: 10mm 20mm 30mm 20mm; /* Increased bottom padding */
      position: relative;
    }

    .title {
      font-size: 18pt;
      font-weight: bold;
      color: #333333;
      margin-bottom: 8mm;
    }

    /* CLIENT INFO */
    .client-info {
      font-size: 10pt;
      margin-bottom: 5mm;
      padding: 3mm;
      border-radius: 4mm;
      background-color: rgba(255, 255, 255, 0.5);
    }

    .client-info-item {
      display: flex;
      align-items: center;
      margin-bottom: 2mm;
    }

    .client-info-label {
      font-weight: 600;
      color: #333333;
      margin-right: 2mm;
      min-width: 30mm;
    }

    /* MENU SECTIONS */
    .section {
      margin-bottom: 6mm;
      background-color: transparent;
      padding: 0;
      box-shadow: none;
    }

    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #e2943a;
      margin-bottom: 4mm;
      padding-bottom: 1mm;
      border-bottom: 1px solid #e2943a;
    }

    .menu-category {
      margin-bottom: 4mm;
    }

    .section-subtitle {
      font-size: 11pt;
      font-weight: bold;
      color: #e2943a;
      margin-bottom: 2mm;
    }

    .menu-items-list {
      margin-left: 0;
      display: flex;
      flex-direction: column;
      gap: 1mm;
    }

    .menu-item {
      font-size: 10pt;
      padding: 1mm 0;
      border-bottom: 1px dotted #ccc;
    }

    .menu-list {
      font-size: 10pt;
      margin-left: 10mm;
      margin-bottom: 5mm;
    }

    /* AMOUNTS */
    .amount-section {
      margin: 5mm 0;
      /* Espaciador sólido transparente para separar de la página anterior/superior */
      border-top: 5mm solid transparent;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .totals-section {
      margin: 5mm 0;
      border-top: 5mm solid transparent;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Caja visual naranja con bordes perfectos */
    .orange-box {
      background-color: #e2943a;
      color: white;
      padding: 4mm;
      border-radius: 2mm; /* Radio normal */
    }

    .amount-title {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 4mm;
    }

    .amount-row {
      font-size: 10pt;
      margin-bottom: 3mm;
      display: flex;
      justify-content: space-between;
    }

    .amount-total {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 3mm;
      padding-top: 3mm;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* ... skipped ... */
  </style>
</head>
<body>
  <div class="page">
    <!-- HEADER -->
    <div class="header">
      ${miniLogoBase64 ? `<img src="${miniLogoBase64}" alt="Logo" class="header-logo">` : ''}
      <div class="header-text">
        <div class="header-title">Fuegos d'Azur</div>
        <div class="header-subtitle">Service Traiteur - Asado Argentin</div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content">

      <!-- CLIENT INFO -->
      <div class="client-info">
        <div class="client-info-grid">
          <div class="client-info-item">
            <span class="client-info-label">Nom :</span>
            <span class="client-info-value">${cleanText(budgetData.clientInfo.name)}</span>
          </div>
          
          <div class="client-info-item">
            <span class="client-info-label">Téléphone :</span>
            <span class="client-info-value">${cleanText(budgetData.clientInfo.phone)}</span>
          </div>
          
          <div class="client-info-item">
            <span class="client-info-label">Email :</span>
            <span class="client-info-value">${cleanText(budgetData.clientInfo.email)}</span>
          </div>
          
          <div class="client-info-item">
            <span class="client-info-label">Événement :</span>
            <span class="client-info-value">${cleanText(budgetData.clientInfo.eventType)}</span>
          </div>
          
          ${budgetData.clientInfo.address ? `
          <div class="client-info-item">
            <span class="client-info-label">Lieu :</span>
            <span class="client-info-value">${cleanText(budgetData.clientInfo.address)}</span>
          </div>
          ` : ''}
          
          <div class="client-info-item">
            <span class="client-info-label">Date :</span>
            <span class="client-info-value">${eventDate}</span>
          </div>
          
          <div class="client-info-item">
            <span class="client-info-label">Convives :</span>
            <span class="client-info-value">${budgetData.clientInfo.guestCount} personnes</span>
          </div>
          
          <div class="client-info-item">
            <span class="client-info-label">Moment :</span>
            <span class="client-info-value">${menuTypeText}</span>
          </div>
        </div>
      </div>

      <!-- MENU -->
      <div class="section">
        <h2 class="section-title">Menu Sélectionné</h2>

        ${budgetData.menu.entrees && budgetData.menu.entrees.length > 0 ? `
          <div class="menu-category">
            <div class="section-subtitle">Entrees</div>
            <div class="menu-items-list">
              ${budgetData.menu.entrees.map(entree => `
                <div class="menu-item">${formatText(entree.name)}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${budgetData.menu.viandes && budgetData.menu.viandes.length > 0 ? `
          <div class="menu-category">
            <div class="section-subtitle">Viandes</div>
            <div class="menu-items-list">
              ${budgetData.menu.viandes.map(viande => `
                <div class="menu-item">${formatText(viande.name)}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${budgetData.menu.accompagnements && budgetData.menu.accompagnements.length > 0 ? `
          <div class="menu-category">
            <div class="section-subtitle">Accompagnements et Sauces</div>
            <div class="menu-items-list">
              ${budgetData.menu.accompagnements.map(acc => `
                <div class="menu-item">${formatText(acc)}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${budgetData.menu.dessert ? `
          <div class="menu-category">
            <div class="section-subtitle">Dessert</div>
            <div class="menu-items-list">
              <div class="menu-item">${formatText(budgetData.menu.dessert.name)}</div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- MONTANT MENU -->
      <div class="amount-section">
        <div class="orange-box">
            <div class="amount-title">Montant - Menu</div>
            <div class="amount-row">
            <span>Montant HT :</span>
            <span>${budgetData.menu.totalHT.toFixed(2)} €</span>
            </div>
            <div class="amount-row">
            <span>TVA (${budgetData.menu.tvaPct}%) :</span>
            <span>${budgetData.menu.tva.toFixed(2)} €</span>
            </div>
            <div class="amount-row amount-total">
            <span>Montant TTC :</span>
            <span>${budgetData.menu.totalTTC.toFixed(2)} €</span>
            </div>
        </div>
      </div>

      ${budgetData.material && budgetData.material.items && budgetData.material.items.length > 0 ? `
        <!-- MATERIAL -->
        <div class="section">
          <h2 class="section-title">Matériel demandé</h2>
          <div class="menu-items-list">
            ${budgetData.material.items
        .filter(item => {
          // Excluir items relacionados con "Serveurs" (case insensitive)
          const itemNameLower = item.name.toLowerCase()
          return !itemNameLower.includes('serveur') &&
            !itemNameLower.includes('servicio') &&
            !itemNameLower.includes('mozos')
        })
        .map(item => `
              <div class="menu-item">${formatText(item.name)}</div>
            `).join('')}
          </div>
        </div>

        <div class="amount-section">
          <div class="orange-box">
            <div class="amount-title">Montant - Matériel</div>
            <div class="amount-row">
                <span>Total Matériel :</span>
                <span>${(budgetData.material.totalHT - (budgetData.material.insuranceAmount || 0)).toFixed(2)} €</span>
            </div>
            ${budgetData.material.insuranceAmount && budgetData.material.insuranceAmount > 0 ? `
            <div class="amount-row">
                <span>Assurance Perte et Casse (${budgetData.material.insurancePct || 6}%):</span>
                <span>${budgetData.material.insuranceAmount.toFixed(2)} €</span>
            </div>
            ` : ''}
            <div class="amount-row">
                <span>Montant HT :</span>
                <span>${budgetData.material.totalHT.toFixed(2)} €</span>
            </div>
            <div class="amount-row">
                <span>TVA (${budgetData.material.tvaPct}%) :</span>
                <span>${budgetData.material.tva.toFixed(2)} €</span>
            </div>
            <div class="amount-row amount-total">
                <span>Montant TTC :</span>
                <span>${budgetData.material.totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      ` : ''}

      ${budgetData.deplacement && budgetData.deplacement.distance > 0 ? `
        <!-- DEPLACEMENT -->
        <div class="amount-section">
          <div class="orange-box">
            <div class="amount-title">Montant – Déplacement</div>
            <div class="amount-row">
                <span>Distance :</span>
                <span>${budgetData.deplacement.distance} km</span>
            </div>
            <div class="amount-row">
                <span>Montant HT :</span>
                <span>${budgetData.deplacement.totalHT.toFixed(2)} €</span>
            </div>
            <div class="amount-row">
                <span>TVA (${budgetData.deplacement.tvaPct}%) :</span>
                <span>${budgetData.deplacement.tva.toFixed(2)} €</span>
            </div>
            <div class="amount-row amount-total">
                <span>Montant TTC :</span>
                <span>${budgetData.deplacement.totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      ` : ''}

      ${budgetData.deliveryReprise && budgetData.deliveryReprise.totalHT > 0 ? `
        <!-- DELIVERY & REPRISE -->
        <div class="amount-section">
            <div class="orange-box">
                <div class="amount-title">Montant – Livraison et Reprise</div>
                ${budgetData.deliveryReprise.deliveryCost > 0 ? `
                <div class="amount-row">
                    <span>Livraison :</span>
                    <span>${budgetData.deliveryReprise.deliveryCost.toFixed(2)} €</span>
                </div>
                ` : ''}
                ${budgetData.deliveryReprise.pickupCost > 0 ? `
                <div class="amount-row">
                    <span>Reprise :</span>
                    <span>${budgetData.deliveryReprise.pickupCost.toFixed(2)} €</span>
                </div>
                ` : ''}
                <div class="amount-row">
                    <span>Montant HT :</span>
                    <span>${budgetData.deliveryReprise.totalHT.toFixed(2)} €</span>
                </div>
                <div class="amount-row">
                    <span>TVA (${budgetData.deliveryReprise.tvaPct}%) :</span>
                    <span>${budgetData.deliveryReprise.tva.toFixed(2)} €</span>
                </div>
                <div class="amount-row amount-total">
                    <span>Montant TTC :</span>
                    <span>${budgetData.deliveryReprise.totalTTC.toFixed(2)} €</span>
                </div>
            </div>
        </div>
      ` : ''}

      ${budgetData.service && budgetData.service.mozos > 0 ? `
        <!-- SERVICE -->
        <div class="amount-section">
          <div class="orange-box">
            <div class="amount-title">Montant – Service</div>
            <div class="amount-row">
                <span>${budgetData.service.mozos} serveur(s) x ${budgetData.service.hours} heures</span>
            </div>
            <div class="amount-row">
                <span>Montant HT :</span>
                <span>${budgetData.service.totalHT.toFixed(2)} €</span>
            </div>
            <div class="amount-row">
                <span>TVA (${budgetData.service.tvaPct}%) :</span>
                <span>${budgetData.service.tva.toFixed(2)} €</span>
            </div>
            <div class="amount-row amount-total">
                <span>Montant TTC :</span>
                <span>${budgetData.service.totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TOTALES FINALES -->
      <div class="totals-section">
        <div class="orange-box">
            <div class="amount-title">Montant Général</div>
            <div class="amount-row">
            <span>Montant HT total :</span>
            <span>${budgetData.totals.totalHT.toFixed(2)} €</span>
            </div>
            <div class="amount-row">
            <span>TVA totale :</span>
            <span>${budgetData.totals.totalTVA.toFixed(2)} €</span>
            </div>
            ${budgetData.totals.discount && budgetData.totals.discount.amount > 0 ? `
            <div class="amount-row" style="color: #ef4444;">
            <span>Remise (${budgetData.totals.discount.percentage}% - ${budgetData.totals.discount.reason || 'Saison'}):</span>
            <span>-${budgetData.totals.discount.amount.toFixed(2)} €</span>
            </div>
            ` : ''}
            <div class="amount-row amount-total">
            <span>Montant TTC total :</span>
            <span>${budgetData.totals.totalTTC.toFixed(2)} €</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}
