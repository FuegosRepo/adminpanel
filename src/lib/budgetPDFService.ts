import { BudgetData } from './types/budget'
import fs from 'fs'
import path from 'path'
import { generateBudgetHTML } from './budgetPDFTemplate'

// Función helper para convertir imagen a base64
function imageToBase64(imagePath: string): string {
  try {
    // Verificar si el archivo existe
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
  // Intentar diferentes rutas posibles
  const possiblePaths = [
    path.join(process.cwd(), 'src', 'lib', filename), // Desarrollo
    path.join(process.cwd(), '.next', 'server', 'src', 'lib', filename), // Producción Next.js
    path.join(process.cwd(), 'lib', filename), // Alternativa
  ]

  for (const imagePath of possiblePaths) {
    if (fs.existsSync(imagePath)) {
      return imagePath
    }
  }

  // Si no se encuentra, devolver la ruta más probable
  return path.join(process.cwd(), 'src', 'lib', filename)
}

// Nueva función que usa HTML + Puppeteer (más fácil de maquetar)
export async function generateBudgetPDFFromHTML(budgetData: BudgetData): Promise<Blob> {
  const html = generateBudgetHTML(budgetData)
  let browser

  try {
    console.log('🚀 Iniciando Puppeteer...')

    // Configuración condicional para Producción (Serverless) vs Desarrollo
    if (process.env.NODE_ENV === 'production') {
      console.log('☁️ Ejecutando en entorno de PRODUCCIÓN (Chromium)')
      const chromium = await import('@sparticuz/chromium')
      const puppeteerCore = await import('puppeteer-core')

      const chromiumLib = chromium.default as any

      browser = await puppeteerCore.default.launch({
        args: chromiumLib.args,
        defaultViewport: chromiumLib.defaultViewport,
        executablePath: await chromiumLib.executablePath(),
        headless: chromiumLib.headless,
      })
    } else {
      console.log('💻 Ejecutando en entorno LOCAL (Puppeteer Standard)')
      const puppeteer = await import('puppeteer')

      browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      })
    }

    console.log('✅ Browser lanzado correctamente')

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })

      // Configurar el viewport para A4
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false, // Usar el formato A4 estándar
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        },
        displayHeaderFooter: false
      })

      // Convertir Buffer a Blob correctamente
      const buffer = Buffer.from(pdfBuffer)
      return new Blob([buffer], { type: 'application/pdf' })
    } finally {
      if (browser) await browser.close()
    }
  } catch (error) {
    console.error('❌ Error crítico en Puppeteer:', error)
    throw error
  }
}

// Función principal - ahora usa HTML por defecto
export async function generateBudgetPDF(budgetData: BudgetData): Promise<Blob> {
  return generateBudgetPDFFromHTML(budgetData)
}

// Función original con jsPDF eliminada por limpieza de código legacy


export function getBudgetPDFFilename(budgetData: BudgetData): string {
  const clientName = (budgetData.clientInfo.name || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_')

  let dateStr: string
  try {
    const d = new Date(budgetData.generatedAt)
    if (isNaN(d.getTime())) {
      dateStr = new Date().toISOString().split('T')[0]
    } else {
      dateStr = d.toISOString().split('T')[0]
    }
  } catch (e) {
    dateStr = new Date().toISOString().split('T')[0]
  }

  return `Devis_Fuegos_${clientName}_${dateStr}.pdf`
}

