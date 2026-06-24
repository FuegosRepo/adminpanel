import { BudgetData } from "../types/budget";
import { groupMeatsByCategory, MEAT_CATEGORIES } from "../meatMapping";
import { getEntreeDisplayName } from "../entreeMapping";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Font,
	Image,
} from "@react-pdf/renderer";

// ============================================================================
// FONT REGISTRATION - Roboto from Google Fonts CDN
// ============================================================================
Font.register({
	family: "Roboto",
	fonts: [
		{
			src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf",
			fontWeight: 400,
		},
		{
			src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf",
			fontWeight: 700,
		},
	],
});

// ============================================================================
// COLORS & CONSTANTS
// ============================================================================
const COLORS = {
	background: "#ffd8ab",
	orange: "#e2943a",
	text: "#333333",
	white: "#ffffff",
};

const SUPABASE_IMAGES = {
	miniLogo:
		"https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/minilogoblack.png",
	header:
		"https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headerblack.png",
	waves:
		"https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/waves.png",
};

const GENERAL_CONDITIONS = [
	"Aucun aliment ne pourra être laissé à disposition après la prestation, Fuegos d’Azur SAS ne pouvant garantir les conditions de conservation des produits après le service.",
	"Aucun aliment fourni par le client ou par un tiers ne pourra être cuisiné ou manipulé sur nos braseros, Fuegos d’Azur SAS ne pouvant garantir la provenance ni les conditions de conservation des produits avant leur consommation.",
	`La prestation Fuegos d’Azur SAS comprend une durée totale de 4h30, répartie comme suit :
– 1h d’installation
– 2h30 de service
– 1h de démontage et remise en ordre`,
];

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
	page: {
		backgroundColor: COLORS.background,
		fontFamily: "Roboto",
		fontSize: 10,
		color: COLORS.text,
		paddingTop: 40, // Space from top on ALL pages
		paddingBottom: 40,
		paddingHorizontal: 30,
	},
	// Header - uses negative margins to extend to page edges
	header: {
		backgroundColor: COLORS.orange,
		padding: "10mm 20mm",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		position: "relative",
		marginTop: -40, // Compensate for page padding
		marginHorizontal: -30, // Extend to edges
	},
	headerLogoLeft: {
		width: 40,
		height: 40,
		objectFit: "contain",
	},
	headerLogoCenter: {
		width: 286,
		height: 72,
		objectFit: "contain",
		position: "absolute",
		left: "50%",
		marginLeft: -143,
	},
	// Content
	content: {
		padding: "20 40", // More horizontal padding
		paddingTop: 20,
	},
	// Client Info
	clientInfo: {
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		borderRadius: 8,
		padding: 12,
		marginBottom: 15,
	},
	clientInfoGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	clientInfoItem: {
		width: "50%",
		flexDirection: "row",
		marginBottom: 4,
		paddingRight: 10, // Prevent text from touching adjacent column
	},
	clientInfoItemFull: {
		width: "100%",
		flexDirection: "row",
		marginBottom: 4,
	},
	clientInfoLabel: {
		fontWeight: 700,
		marginRight: 8,
		width: 70,
		flexShrink: 0, // Don't shrink the label
	},
	clientInfoValue: {
		flex: 1,
		flexWrap: "wrap",
	},
	// Sections
	section: {
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 700,
		color: COLORS.orange,
		marginBottom: 8,
		paddingBottom: 4,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.orange,
	},
	sectionSubtitle: {
		fontSize: 11,
		fontWeight: 700,
		color: COLORS.orange,
		marginBottom: 4,
	},
	menuCategory: {
		marginBottom: 8,
	},
	menuItem: {
		marginBottom: 2,
		paddingLeft: 8,
	},
	// Orange Box (Amount sections)
	orangeBox: {
		backgroundColor: COLORS.orange,
		color: COLORS.white,
		padding: 12,
		borderRadius: 6,
		marginBottom: 10,
	},
	amountTitle: {
		fontSize: 11,
		fontWeight: 700,
		marginBottom: 8,
		color: COLORS.white,
	},
	amountRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 4,
		color: COLORS.white,
	},
	amountTotal: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 6,
		paddingTop: 6,
		borderTopWidth: 1,
		borderTopColor: "#ffffff",
		fontWeight: 700,
		color: COLORS.white,
	},
	// General conditions and signature
	termsAndSignature: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 4,
		marginBottom: 12,
	},
	generalConditions: {
		width: "68%",
		backgroundColor: "rgba(255, 255, 255, 0.45)",
		borderRadius: 6,
		padding: 10,
	},
	generalConditionsTitle: {
		fontSize: 10,
		fontWeight: 700,
		color: COLORS.orange,
		marginBottom: 6,
	},
	generalConditionItem: {
		fontSize: 7.5,
		lineHeight: 1.35,
		marginBottom: 4,
	},
	signatureArea: {
		width: "28%",
		alignItems: "stretch",
	},
	signatureBox: {
		height: 72,
		borderWidth: 1,
		borderColor: COLORS.text,
		backgroundColor: "rgba(255, 255, 255, 0.35)",
		borderRadius: 4,
		marginBottom: 5,
	},
	signatureLabel: {
		fontSize: 9,
		fontWeight: 700,
		textAlign: "center",
		color: COLORS.text,
	},
	// Footer
	footer: {
		alignItems: "center",
		paddingTop: 15,
	},
	footerImage: {
		width: 100,
	},
	// Watermark
	watermark: {
		position: "absolute",
		bottom: 20,
		right: 20,
		width: 30,
		opacity: 0.3,
	},
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function cleanText(text: string): string {
	if (!text) return "";
	return text
		.replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
		.replace(/[\u{2600}-\u{26FF}]/gu, "")
		.replace(/[\u{2700}-\u{27BF}]/gu, "")
		.replace(/[\u{1F600}-\u{1F64F}]/gu, "")
		.replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
		.trim();
}

function formatText(text: string): string {
	if (!text) return "";

	// Limpiar emojis primero
	let formatted = cleanText(text);

	// Mejorar casos específicos comunes primero (antes de procesar guiones)
	const replacements: { [key: string]: string } = {
		"verres-eau": "Verres d'eau",
		"verres-vin": "Verres de vin",
		"verres-champagne": "Verres de champagne",
		"mange-debout": "Mange-debout",
		"assiettes-plates": "Assiettes plates",
		"assiettes-creuses": "Assiettes creuses",
		choripan:
			"Choripan (Chorizo argentin grillé au brasero, accompagné d'un sauce maison et pain artisanal)",
		"fruits-grilles":
			"Fruits de saison grillés au brasero et flambés au cognac, accompagnés de glace vanille artisanale, noix concassées et spéculoos émiettés",
		"fruits-grille":
			"Fruits de saison grillés au brasero et flambés au cognac, accompagnés de glace vanille artisanale, noix concassées et spéculoos émiettés",
		"fruits grillés":
			"Fruits de saison grillés au brasero et flambés au cognac, accompagnés de glace vanille artisanale, noix concassées et spéculoos émiettés",
		"fruits grilles":
			"Fruits de saison grillés au brasero et flambés au cognac, accompagnés de glace vanille artisanale, noix concassées et spéculoos émiettés",
		"fruits grille":
			"Fruits de saison grillés au brasero et flambés au cognac, accompagnés de glace vanille artisanale, noix concassées et spéculoos émiettés",
		"fruits grillé":
			"Fruits de saison grillés au brasero et flambés au cognac, accompagnés de glace vanille artisanale, noix concassées et spéculoos émiettés",
		miniburger:
			"Miniburger maison au brasero (sauce chimimayo, cornichon, pain brioché)",
		burger:
			"Miniburger maison au brasero (sauce chimimayo, cornichon, pain brioché)",
		empanadas: '"Empanadas" spécialité d\'argentine',
		panqueques:
			"Panqueques argentins traditionnels avec dulce de leche fondu au brasero, glace vanille et fruits de saison fresco",
		// Issue #3: Specific naming fixes
		"brochettes de jambon ibérique": "Brochettes de jambon ibérique",
		"brochettes de jamón ibérico": "Brochettes de jambon ibérique",
		"secreto iberico": "Secreto de porc Ibérique",
		"secreto ibérico": "Secreto de porc Ibérique",
	};

	// Aplicar reemplazos específicos (case insensitive)
	const lowerText = formatted.toLowerCase();
	for (const [key, value] of Object.entries(replacements)) {
		if (lowerText.includes(key.toLowerCase())) {
			formatted = formatted.replace(
				new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
				value,
			);
			// Si se aplicó un reemplazo, retornar directamente
			if (formatted.toLowerCase() !== lowerText) {
				return formatted;
			}
		}
	}

	// Si no hay reemplazo específico, capitalizar palabras separadas por guiones, manteniendo el guion
	formatted = formatted
		.split(/([-_])/) // Dividir manteniendo los separadores
		.map((part) => {
			// Si es un separador, mantenerlo
			if (part === "-" || part === "_") {
				return part;
			}
			// Capitalizar primera letra de cada palabra
			if (part.length > 0) {
				return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
			}
			return part;
		})
		.join("");

	// Capitalizar primera letra de la frase completa
	if (formatted.length > 0) {
		formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
	}

	return formatted;
}

function formatDate(dateStr: string | undefined): string {
	if (!dateStr) return "Date non définie";
	try {
		const datePart = dateStr.split("T")[0];
		const [year, month, day] = datePart.split("-").map(Number);
		if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
			return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
		}
	} catch (e) {
		console.error("Error formatting date:", e);
	}
	return "Date non définie";
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================
function Header() {
	return (
		<View style={styles.header}>
			<Image src={SUPABASE_IMAGES.miniLogo} style={styles.headerLogoLeft} />
			<Image src={SUPABASE_IMAGES.header} style={styles.headerLogoCenter} />
			<View style={{ width: 50 }} />
		</View>
	);
}

function ClientInfoSection({
	clientInfo,
	menuType,
}: {
	clientInfo: BudgetData["clientInfo"];
	menuType: string;
}) {
	const menuTypeText = menuType === "dejeuner" ? "Déjeuner" : "Dîner";

	return (
		<View style={styles.clientInfo}>
			<View style={styles.clientInfoGrid}>
				<View style={styles.clientInfoItem}>
					<Text style={styles.clientInfoLabel}>Nom :</Text>
					<Text style={styles.clientInfoValue}>
						{cleanText(clientInfo.name)}
					</Text>
				</View>
				<View style={styles.clientInfoItem}>
					<Text style={styles.clientInfoLabel}>Téléphone :</Text>
					<Text style={styles.clientInfoValue}>
						{cleanText(clientInfo.phone)}
					</Text>
				</View>
				<View style={styles.clientInfoItem}>
					<Text style={styles.clientInfoLabel}>Email :</Text>
					<Text style={styles.clientInfoValue}>
						{cleanText(clientInfo.email)}
					</Text>
				</View>
				<View style={styles.clientInfoItem}>
					<Text style={styles.clientInfoLabel}>Événement :</Text>
					<Text style={styles.clientInfoValue}>
						{cleanText(clientInfo.eventType)}
					</Text>
				</View>
				<View style={styles.clientInfoItem}>
					<Text style={styles.clientInfoLabel}>Date :</Text>
					<Text style={styles.clientInfoValue}>
						{formatDate(clientInfo.eventDate)}
					</Text>
				</View>
				<View style={styles.clientInfoItem}>
					<Text style={styles.clientInfoLabel}>Moment :</Text>
					<Text style={styles.clientInfoValue}>{menuTypeText}</Text>
				</View>
				<View style={styles.clientInfoItem}>
					<Text style={styles.clientInfoLabel}>Convives :</Text>
					<Text style={styles.clientInfoValue}>
						{clientInfo.guestCount} personnes
					</Text>
				</View>
				{clientInfo.address && (
					<View style={styles.clientInfoItemFull}>
						<Text style={styles.clientInfoLabel}>Lieu :</Text>
						<Text style={styles.clientInfoValue}>
							{cleanText(clientInfo.address)}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}

function MenuSection({
	menu,
	boissonsSoft,
}: {
	menu: BudgetData["menu"];
	boissonsSoft?: BudgetData["boissonsSoft"];
}) {
	const groupedMeats = menu.viandes
		? groupMeatsByCategory(menu.viandes)
		: { premium: [], classique: [] };

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Menu Sélectionné</Text>

			{/* Entrees */}
			{menu.entrees && menu.entrees.length > 0 && (
				<View style={styles.menuCategory}>
					<Text style={styles.sectionSubtitle}>Entrées</Text>
					{menu.entrees.map((entree, i) => (
						<Text key={i} style={styles.menuItem}>
							• {getEntreeDisplayName(entree.name)}
						</Text>
					))}
				</View>
			)}

			{/* Viandes */}
			{menu.viandes && menu.viandes.length > 0 && (
				<View style={styles.menuCategory}>
					<Text style={styles.sectionSubtitle}>Viandes</Text>

					{groupedMeats.premium.length > 0 && (
						<View style={{ marginBottom: 6 }}>
							<Text
								style={{
									fontWeight: 700,
									color: COLORS.orange,
									marginBottom: 2,
								}}
							>
								{MEAT_CATEGORIES.premium}
							</Text>
							{groupedMeats.premium.map((meat, i) => (
								<Text key={i} style={styles.menuItem}>
									• {meat.displayName}
								</Text>
							))}
						</View>
					)}

					{groupedMeats.classique.length > 0 && (
						<View style={{ marginBottom: 6 }}>
							<Text
								style={{
									fontWeight: 700,
									color: COLORS.orange,
									marginBottom: 2,
								}}
							>
								{MEAT_CATEGORIES.classique}
							</Text>
							{groupedMeats.classique.map((meat, i) => (
								<Text key={i} style={styles.menuItem}>
									• {meat.displayName}
								</Text>
							))}
						</View>
					)}
				</View>
			)}

			{/* Accompagnements */}
			<View style={styles.menuCategory}>
				<Text style={styles.sectionSubtitle}>Accompagnements et Sauces</Text>
				<Text style={styles.menuItem}>
					• Pommes de terre « Rusticas » en persillade.
				</Text>
				<Text style={styles.menuItem}>
					• Salade verte, fruits de saison, fromage feta, grains et vinaigrette.
				</Text>
				<Text style={styles.menuItem}>• Légumes grillés.</Text>
				<Text style={styles.menuItem}>• Pain (divers).</Text>
				<Text style={styles.menuItem}>• Sauce traditionnelle Chimichurri.</Text>
			</View>

			{/* Dessert */}
			{menu.dessert && (
				<View style={styles.menuCategory}>
					<Text style={styles.sectionSubtitle}>Dessert</Text>
					<Text style={styles.menuItem}>
						• {((menu.dessert.name || "").toLowerCase().includes("pièce montée") || 
							(menu.dessert.name || "").toLowerCase().includes("gateau d'anniversaire") || 
							(menu.dessert.name || "").toLowerCase().includes("gâteau d'anniversaire") ||
							(menu.dessert.description || "").toLowerCase().includes("vous avez prévu") ||
							(menu.dessert.description || "").toLowerCase().includes("pièce montée") ||
							(menu.dessert.description || "").toLowerCase().includes("gâteau d'anniversaire"))
								? formatText(menu.dessert.name)
								: (menu.dessert.description || formatText(menu.dessert.name))}
					</Text>
				</View>
			)}

			{/* Boissons Soft */}
			{boissonsSoft && boissonsSoft.totalHT > 0 && (
				<View style={styles.menuCategory}>
					<Text style={styles.sectionSubtitle}>Boissons soft</Text>
					<Text style={styles.menuItem}>
						• Boissons soft ({boissonsSoft.totalPersons} personnes à {boissonsSoft.pricePerPerson.toFixed(2)} € / personne)
					</Text>
				</View>
			)}
		</View>
	);
}

function AmountBox({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<View style={styles.orangeBox} wrap={false}>
			<Text style={styles.amountTitle}>{title}</Text>
			{children}
		</View>
	);
}

function AmountRow({
	label,
	value,
	isTotal = false,
}: {
	label: string;
	value: string;
	isTotal?: boolean;
}) {
	return (
		<View style={isTotal ? styles.amountTotal : styles.amountRow}>
			<Text>{label}</Text>
			<Text>{value}</Text>
		</View>
	);
}

function GeneralConditionsSection() {
	return (
		<View style={styles.termsAndSignature} wrap={false}>
			<View style={styles.generalConditions}>
				<Text style={styles.generalConditionsTitle}>Conditions générales</Text>
				{GENERAL_CONDITIONS.map((condition, index) => (
					<Text key={index} style={styles.generalConditionItem}>
						• {condition}
					</Text>
				))}
			</View>
			<View style={styles.signatureArea}>
				<View style={styles.signatureBox} />
				<Text style={styles.signatureLabel}>Signature client</Text>
			</View>
		</View>
	);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
interface BudgetPdfDocumentProps {
	budgetData: BudgetData;
}

export function BudgetPdfDocument({ budgetData }: BudgetPdfDocumentProps) {
	const {
		menu,
		material,
		deplacement,
		boissonsSoft,
		extras,
		service,
		totals,
		clientInfo,
		adminNotes,
	} = budgetData;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Watermark */}
				<Image src={SUPABASE_IMAGES.miniLogo} style={styles.watermark} fixed />

				{/* Header */}
				<Header />

				{/* Content */}
				<View style={styles.content}>
					{/* Client Info */}
					<ClientInfoSection
						clientInfo={clientInfo}
						menuType={clientInfo.menuType}
					/>

					{/* Menu */}
					<MenuSection menu={menu} boissonsSoft={boissonsSoft} />

					{/* Menu Amount */}
					<AmountBox title="Montant - Menu">
						<AmountRow
							label="Montant HT :"
							value={`${menu.totalHT.toFixed(2)} €`}
						/>
						{menu.discount && menu.discount.amount > 0 && (
							<AmountRow
								label={`Remise (${menu.discount.percentage}% - ${menu.discount.reason}) :`}
								value={`- ${menu.discount.amount.toFixed(2)} €`}
							/>
						)}
						{menu.discount && menu.discount.amount > 0 && (
							<AmountRow
								label="Montant HT Après Remise :"
								value={`${(menu.totalHTApresRemise ?? menu.totalHT).toFixed(2)} €`}
							/>
						)}
						<AmountRow
							label={`TVA (${menu.tvaPct}%) :`}
							value={`${menu.tva.toFixed(2)} €`}
						/>
						<AmountRow
							label="Montant TTC :"
							value={`${menu.totalTTC.toFixed(2)} €`}
							isTotal
						/>
					</AmountBox>

					{/* Material */}
					{material && material.items && material.items.length > 0 && (
						<>
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Matériel demandé</Text>
								{material.items
									.filter((item) => {
										const name = item.name.toLowerCase();
										return (
											!name.includes("serveur") &&
											!name.includes("servicio") &&
											!name.includes("mozos")
										);
									})
									.map((item, i) => (
										<Text key={i} style={styles.menuItem}>
											• {item.quantity} x {formatText(item.name)}
										</Text>
									))}
							</View>

							<AmountBox title="Montant - Matériel">
								<AmountRow
									label="Total Matériel :"
									value={`${material.items
										.filter((item) => {
											const name = item.name.toLowerCase();
											return (
												!name.includes("serveur") &&
												!name.includes("servicio") &&
												!name.includes("mozos")
											);
										})
										.reduce((acc, item) => acc + item.total, 0)
										.toFixed(2)} €`}
								/>
								{material.insuranceAmount && material.insuranceAmount > 0 && (
									<AmountRow
										label={`Assurance Perte et Casse (${material.insurancePct || 6}%):`}
										value={`${material.insuranceAmount.toFixed(2)} €`}
									/>
								)}
								{budgetData.deliveryReprise &&
									(budgetData.deliveryReprise.deliveryCost > 0 ||
										budgetData.deliveryReprise.pickupCost > 0) && (
										<AmountRow
											label="Livraison et Reprise :"
											value={`${((budgetData.deliveryReprise.deliveryCost || 0) + (budgetData.deliveryReprise.pickupCost || 0)).toFixed(2)} €`}
										/>
									)}
								<AmountRow
									label="Montant HT :"
									value={`${material.totalHT.toFixed(2)} €`}
								/>
								<AmountRow
									label={`TVA (${material.tvaPct}%) :`}
									value={`${material.tva.toFixed(2)} €`}
								/>
								<AmountRow
									label="Montant TTC :"
									value={`${material.totalTTC.toFixed(2)} €`}
									isTotal
								/>
							</AmountBox>
						</>
					)}

					{/* Deplacement */}
					{deplacement && deplacement.totalHT > 0 && (
						<AmountBox title="Montant – Déplacement">
							<AmountRow
								label="Distance :"
								value={`${deplacement.distance} km`}
							/>
							<AmountRow
								label="Montant HT :"
								value={`${deplacement.totalHT.toFixed(2)} €`}
							/>
							<AmountRow
								label={`TVA (${deplacement.tvaPct}%) :`}
								value={`${deplacement.tva.toFixed(2)} €`}
							/>
							<AmountRow
								label="Montant TTC :"
								value={`${deplacement.totalTTC.toFixed(2)} €`}
								isTotal
							/>
						</AmountBox>
					)}

					{/* Boissons Soft */}
					{boissonsSoft && boissonsSoft.totalHT > 0 && (
						<AmountBox title="Montant – Boissons soft">
							<AmountRow
								label="Nombre de personnes :"
								value={`${boissonsSoft.totalPersons}`}
							/>
							<AmountRow
								label="Prix par personne :"
								value={`${boissonsSoft.pricePerPerson.toFixed(2)} €`}
							/>
							<AmountRow
								label="Montant HT :"
								value={`${boissonsSoft.totalHT.toFixed(2)} €`}
							/>
							<AmountRow
								label={`TVA (${boissonsSoft.tvaPct}%) :`}
								value={`${boissonsSoft.tva.toFixed(2)} €`}
							/>
							<AmountRow
								label="Montant TTC :"
								value={`${boissonsSoft.totalTTC.toFixed(2)} €`}
								isTotal
							/>
						</AmountBox>
					)}

					{/* Extras */}
					{extras && extras.items.length > 0 && (
						<AmountBox title="Montant – Extras">
							{extras.items.map((item, i) => (
								<View key={i}>
									<AmountRow
										label={cleanText(item.description)}
										value={`${item.priceHT.toFixed(2)} €`}
									/>
									<AmountRow
										label={`TVA (${item.tvaPct}%) :`}
										value={`${item.tva.toFixed(2)} €`}
									/>
									<AmountRow
										label="Total TTC :"
										value={`${item.priceTTC.toFixed(2)} €`}
										isTotal
									/>
									{i < extras.items.length - 1 && (
										<View
											style={{
												borderTopWidth: 1,
												borderTopColor: "rgba(255,255,255,0.3)",
												marginVertical: 6,
											}}
										/>
									)}
								</View>
							))}
							{extras.items.length > 1 && (
								<>
									<View
										style={{
											borderTopWidth: 1,
											borderTopColor: "rgba(255,255,255,0.3)",
											marginTop: 8,
											marginBottom: 6,
										}}
									/>
									<AmountRow
										label="TOTAL EXTRAS HT :"
										value={`${extras.totalHT.toFixed(2)} €`}
									/>
									<AmountRow
										label="TOTAL TVA :"
										value={`${extras.totalTVA.toFixed(2)} €`}
									/>
									<AmountRow
										label="TOTAL TTC :"
										value={`${extras.totalTTC.toFixed(2)} €`}
										isTotal
									/>
								</>
							)}
							{extras.notes && (
								<Text
									style={{ marginTop: 8, fontSize: 9, color: COLORS.white }}
								>
									Notes : {cleanText(extras.notes)}
								</Text>
							)}
						</AmountBox>
					)}

					{/* Service */}
					{service && service.totalHT > 0 && (
						<AmountBox title="Montant – Service">
							<AmountRow
								label={`${service.mozos} serveur(s) x ${service.hours} heures`}
								value=""
							/>
							<AmountRow
								label="Montant HT :"
								value={`${service.totalHT.toFixed(2)} €`}
							/>
							<AmountRow
								label={`TVA (${service.tvaPct}%) :`}
								value={`${service.tva.toFixed(2)} €`}
							/>
							<AmountRow
								label="Montant TTC :"
								value={`${service.totalTTC.toFixed(2)} €`}
								isTotal
							/>
						</AmountBox>
					)}

					{/* Final Totals */}
					<AmountBox title="Montant Général">
						<AmountRow
							label="Montant HT total :"
							value={`${totals.totalHT.toFixed(2)} €`}
						/>
						<AmountRow
							label="TVA totale :"
							value={`${totals.totalTVA.toFixed(2)} €`}
						/>
						<AmountRow
							label="Montant TTC total :"
							value={`${totals.totalTTC.toFixed(2)} €`}
							isTotal
						/>
					</AmountBox>

					{/* Admin Notes */}
					{adminNotes && (
						<View style={styles.section}>
							<Text style={styles.sectionSubtitle}>Notes importantes</Text>
							<View
								style={{
									backgroundColor: COLORS.orange,
									borderLeftWidth: 3,
									borderLeftColor: "#d18634",
									padding: 10,
									borderRadius: 4,
								}}
							>
								<Text style={{ color: COLORS.white, fontSize: 9 }}>
									{cleanText(adminNotes)}
								</Text>
							</View>
						</View>
					)}

					{/* General conditions and client signature */}
					<GeneralConditionsSection />

					{/* Footer */}
					<View style={styles.footer}>
						<Image src={SUPABASE_IMAGES.waves} style={styles.footerImage} />
					</View>
				</View>
			</Page>
		</Document>
	);
}
