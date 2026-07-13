import { BudgetData } from "./types/budget";
import { generateBudgetHTML } from "./budgetPDFTemplate";
export { getBudgetPDFFilename } from "./pdfFilename";

// Nueva función que usa HTML + Puppeteer (más fácil de maquetar)
export async function generateBudgetPDFFromHTML(
	budgetData: BudgetData,
): Promise<Blob> {
	const html = generateBudgetHTML(budgetData);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Puppeteer types differ between core/full packages
	let browser: any = null;

	try {
		console.log("🚀 Iniciando Puppeteer...");

		// Configuración condicional para Producción (Serverless) vs Desarrollo
		if (process.env.NODE_ENV === "production") {
			console.log("☁️ Ejecutando en entorno de PRODUCCIÓN (Chromium)");
			try {
				const chromium = await import("@sparticuz/chromium");
				const puppeteerCore = await import("puppeteer-core");

				// Manejar interop ESM/CJS
				const chromiumLib = (chromium.default || chromium) as any;

				// Configurar ruta de fuentes si es necesario (opcional)
				// await chromiumLib.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');

				// IMPORTANTE: En Netlify/Lambda, a veces es necesario pasar una ruta explícita si la detección automática falla
				// Por ahora confiamos en la detección automática pero aseguramos que next.config.js evite el bundling
				const executablePath = await chromiumLib.executablePath();
				console.log("📦 Executable path:", executablePath);

				browser = await puppeteerCore.default.launch({
					args: [
						...chromiumLib.args,
						"--no-sandbox",
						"--disable-setuid-sandbox",
					], // Agregar flags extra por seguridad
					defaultViewport: chromiumLib.defaultViewport,
					executablePath,
					headless: chromiumLib.headless,
					ignoreHTTPSErrors: true,
				} as any);
			} catch (launchError) {
				console.error("❌ Error lanzando Chromium en producción:", launchError);
				throw launchError;
			}
		} else {
			console.log("💻 Ejecutando en entorno LOCAL (Puppeteer Core)");
			const puppeteerCore = await import("puppeteer-core");
			const executablePath =
				process.env.PUPPETEER_EXECUTABLE_PATH ||
				process.env.CHROME_EXECUTABLE_PATH;

			browser = await puppeteerCore.default.launch({
				...(executablePath ? { executablePath } : { channel: "chrome" }),
				headless: true,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
				],
			} as any);
		}

		console.log("✅ Browser lanzado correctamente");

		try {
			const page = await browser.newPage();
			await page.setContent(html, { waitUntil: "networkidle0" });

			// Configurar el viewport para A4
			await page.setViewport({
				width: 794, // A4 width in pixels at 96 DPI
				height: 1123, // A4 height in pixels at 96 DPI
			});

			const pdfBuffer = await page.pdf({
				format: "A4",
				printBackground: true,
				preferCSSPageSize: false, // Usar el formato A4 estándar
				margin: {
					top: "0mm",
					right: "0mm",
					bottom: "0mm",
					left: "0mm",
				},
				displayHeaderFooter: false,
			});

			// Convertir Buffer a Blob correctamente
			const buffer = Buffer.from(pdfBuffer);
			return new Blob([buffer], { type: "application/pdf" });
		} finally {
			if (browser) await browser.close();
		}
	} catch (error) {
		console.error("❌ Error crítico en Puppeteer:", error);
		throw error;
	}
}

// Función principal - ahora usa HTML por defecto
export async function generateBudgetPDF(budgetData: BudgetData): Promise<Blob> {
	return generateBudgetPDFFromHTML(budgetData);
}

// Función original con jsPDF eliminada por limpieza de código legacy
