import { BudgetData } from './types/budget'

export async function generateBudgetPDF(budgetData: BudgetData): Promise<Blob> {
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20

  const primaryColor: [number, number, number] = [226, 148, 58]
  const darkGray: [number, number, number] = [51, 51, 51]

  
  let yPosition = margin

  // HEADER
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text("🔥 Fuegos d'Azur", margin, 20)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Service Traiteur - Asado Argentin', margin, 30)

  yPosition = 50

  // TÍTULO
  doc.setTextColor(...darkGray)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('DEVIS', margin, yPosition)
  yPosition += 15

  // INFO CLIENTE CON EMOJIS (como el ejemplo)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  
  doc.text(`👤 Nom : ${budgetData.clientInfo.name}`, margin, yPosition)
  yPosition += 6
  
  doc.text(`📞 Téléphone : ${budgetData.clientInfo.phone}`, margin, yPosition)
  yPosition += 6
  
  doc.text(`📧 Email : ${budgetData.clientInfo.email}`, margin, yPosition)
  yPosition += 6
  
  doc.text(`🎉 Événement : ${budgetData.clientInfo.eventType}`, margin, yPosition)
  yPosition += 6
  
  if (budgetData.clientInfo.address) {
    doc.text(`📍 Lieu : ${budgetData.clientInfo.address}`, margin, yPosition)
    yPosition += 6
  }
  
  doc.text(`📅 Date : ${new Date(budgetData.clientInfo.eventDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, margin, yPosition)
  yPosition += 6
  
  doc.text(`👥 Nombre de convives : ${budgetData.clientInfo.guestCount} personnes`, margin, yPosition)
  yPosition += 6
  
  doc.text(`🕓 Moment : ${budgetData.clientInfo.menuType === 'dejeuner' ? 'Déjeuner' : 'Dîner'}`, margin, yPosition)
  yPosition += 12

  // MENÚ DETALLADO
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...primaryColor)
  doc.text('Menu Sélectionné', margin, yPosition)
  yPosition += 8

  doc.setTextColor(...darkGray)
  doc.setFontSize(10)

  // Entrées
  if (budgetData.menu.entrees && budgetData.menu.entrees.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Entrées :', margin, yPosition)
    yPosition += 5
    doc.setFont('helvetica', 'normal')
    budgetData.menu.entrees.forEach((entree) => {
      doc.text(`  ${entree.name}`, margin, yPosition)
      yPosition += 5
    })
    yPosition += 2
  }

  // Viandes
  if (budgetData.menu.viandes && budgetData.menu.viandes.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Viandes :', margin, yPosition)
    yPosition += 5
    doc.setFont('helvetica', 'normal')
    budgetData.menu.viandes.forEach((viande) => {
      doc.text(`  ${viande.name}`, margin, yPosition)
      yPosition += 5
    })
    yPosition += 2
  }

  // Accompagnements
  if (budgetData.menu.accompagnements && budgetData.menu.accompagnements.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Accompagnements et Sauces :', margin, yPosition)
    yPosition += 5
    doc.setFont('helvetica', 'normal')
    budgetData.menu.accompagnements.forEach((acc) => {
      doc.text(`  ${acc}`, margin, yPosition)
      yPosition += 5
    })
    yPosition += 2
  }

  // Dessert
  if (budgetData.menu.dessert) {
    doc.setFont('helvetica', 'bold')
    doc.text('Dessert :', margin, yPosition)
    yPosition += 5
    doc.setFont('helvetica', 'normal')
    doc.text(`  ${budgetData.menu.dessert.name}`, margin, yPosition)
    yPosition += 8
  }

  // Montant Menu
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...primaryColor)
  doc.text('Montant - Menu', margin, yPosition)
  yPosition += 6

  doc.setFontSize(10)
  doc.setTextColor(...darkGray)
  doc.setFont('helvetica', 'normal')
  doc.text(`Montant HT : ${budgetData.menu.totalHT.toFixed(2)} €`, margin, yPosition)
  yPosition += 5
  doc.text(`TVA (${budgetData.menu.tvaPct}%) : ${budgetData.menu.tva.toFixed(2)} €`, margin, yPosition)
  yPosition += 5
  doc.setFont('helvetica', 'bold')
  doc.text(`Montant TTC : ${budgetData.menu.totalTTC.toFixed(2)} €`, margin, yPosition)
  yPosition += 12

  // Material
  if (budgetData.material && budgetData.material.items && budgetData.material.items.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...primaryColor)
    doc.text('Matériel demandé :', margin, yPosition)
    yPosition += 6

    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')
    
    budgetData.material.items.forEach((item) => {
      doc.text(`  ${item.name}`, margin, yPosition)
      yPosition += 5
    })
    yPosition += 3

    doc.text(`Montant HT : ${budgetData.material.totalHT.toFixed(2)} €`, margin, yPosition)
    yPosition += 5
    doc.text(`TVA (${budgetData.material.tvaPct}%) : ${budgetData.material.tva.toFixed(2)} €`, margin, yPosition)
    yPosition += 5
    doc.setFont('helvetica', 'bold')
    doc.text(`Montant TTC : ${budgetData.material.totalTTC.toFixed(2)} €`, margin, yPosition)
    yPosition += 12
  }

  // Déplacement
  if (budgetData.deplacement && budgetData.deplacement.distance > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...primaryColor)
    doc.text('Montant – Déplacement', margin, yPosition)
    yPosition += 6

    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')
    doc.text(`Distance : ${budgetData.deplacement.distance} km`, margin, yPosition)
    yPosition += 5
    doc.text(`Montant HT : ${budgetData.deplacement.totalHT.toFixed(2)} €`, margin, yPosition)
    yPosition += 5
    doc.text(`TVA (${budgetData.deplacement.tvaPct}%) : ${budgetData.deplacement.tva.toFixed(2)} €`, margin, yPosition)
    yPosition += 5
    doc.setFont('helvetica', 'bold')
    doc.text(`Montant TTC : ${budgetData.deplacement.totalTTC.toFixed(2)} €`, margin, yPosition)
    yPosition += 12
  }

  // Service
  if (budgetData.service && budgetData.service.mozos > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...primaryColor)
    doc.text('Montant – Service', margin, yPosition)
    yPosition += 6

    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')
    doc.text(`${budgetData.service.mozos} serveur(s) x ${budgetData.service.hours} heures`, margin, yPosition)
    yPosition += 5
    doc.text(`Montant HT : ${budgetData.service.totalHT.toFixed(2)} €`, margin, yPosition)
    yPosition += 5
    doc.text(`TVA (${budgetData.service.tvaPct}%) : ${budgetData.service.tva.toFixed(2)} €`, margin, yPosition)
    yPosition += 5
    doc.setFont('helvetica', 'bold')
    doc.text(`Montant TTC : ${budgetData.service.totalTTC.toFixed(2)} €`, margin, yPosition)
    yPosition += 12
  }

  // TOTALES FINALES
  doc.setFillColor(...primaryColor)
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Montant Général', margin + 5, yPosition + 8)
  doc.setFontSize(11)
  doc.text(`Montant HT total : ${budgetData.totals.totalHT.toFixed(2)} €`, margin + 5, yPosition + 14)
  doc.text(`TVA totale : ${budgetData.totals.totalTVA.toFixed(2)} €`, margin + 5, yPosition + 19)
  doc.setFontSize(13)
  doc.text(`Montant TTC total : ${budgetData.totals.totalTTC.toFixed(2)} €`, margin + 5, yPosition + 24)

  yPosition += 30

  // FOOTER
  if (yPosition < pageHeight - 30) {
    const footerY = pageHeight - 25
    doc.setDrawColor(...primaryColor)
    doc.line(margin, footerY, pageWidth - margin, footerY)
    doc.setTextColor(...darkGray)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Fuegos d\'Azur - Service Traiteur', margin, footerY + 5)
    doc.text('📞 07 50 85 35 99 • 06 70 65 97 84', margin, footerY + 9)
    doc.text('📧 fuegosdazur@proton.me', margin, footerY + 13)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7)
    doc.text(`Devis valable jusqu'au: ${new Date(budgetData.validUntil).toLocaleDateString('fr-FR')}`, pageWidth - margin - 45, footerY + 5)
    doc.text(`Généré le: ${new Date(budgetData.generatedAt).toLocaleDateString('fr-FR')}`, pageWidth - margin - 45, footerY + 9)
  }

  const pdfBlob = doc.output('blob')
  return pdfBlob
}

export function getBudgetPDFFilename(budgetData: BudgetData): string {
  const clientName = budgetData.clientInfo.name.replace(/\s+/g, '_')
  const date = new Date(budgetData.generatedAt).toISOString().split('T')[0]
  return `Devis_Fuegos_${clientName}_${date}.pdf`
}

