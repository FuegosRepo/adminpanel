import { BudgetData } from '../types'

export const recalculateTotals = (data: BudgetData): BudgetData => {
    const updated = { ...data }

    // Recalcular menú
    if (updated.menu) {
        const menuHT = updated.menu.pricePerPerson * updated.menu.totalPersons
        updated.menu.totalHT = menuHT
        updated.menu.tva = menuHT * (updated.menu.tvaPct / 100)
        let menuTTC = menuHT + updated.menu.tva

        // Descuento 10% para Déjeuner (solo al menú)
        if (updated.clientInfo.menuType === 'dejeuner') {
            const discountAmount = menuHT * 0.10
            updated.menu.discount = {
                percentage: 10,
                amount: discountAmount,
                reason: 'Événement à midi - 10%'
            }
            menuTTC -= discountAmount
        } else {
            updated.menu.discount = undefined
        }
        updated.menu.totalTTC = menuTTC
    }

    // Recalcular servicio (valores fijos: 40€/hora HT, TVA 20%)
    if (updated.service) {
        // Asegurar valores fijos
        updated.service.pricePerHour = 40
        updated.service.tvaPct = 20
        const serviceHT = updated.service.mozos * updated.service.hours * updated.service.pricePerHour
        updated.service.totalHT = serviceHT
        updated.service.tva = serviceHT * (updated.service.tvaPct / 100)
        updated.service.totalTTC = serviceHT + updated.service.tva
    }

    // Recalcular material (excluyendo "Serveurs") y aplicar Seguro
    if (updated.material && updated.material.items) {
        let materialHTForInsurance = 0
        updated.material.items
            .filter(item => {
                // Excluir items relacionados con "Serveurs"
                const itemNameLower = item.name.toLowerCase()
                const isServer = itemNameLower.includes('serveur') ||
                    itemNameLower.includes('servicio') ||
                    itemNameLower.includes('mozos')

                // También excluir items que sean manualmente "Livraison" o "Reprise" para no duplicar seguro
                const isDeliveryReprise = itemNameLower.includes('livraison') ||
                    itemNameLower.includes('reprise')

                return !isServer && !isDeliveryReprise
            })
            .forEach(item => {
                item.total = item.quantity * item.pricePerUnit
                materialHTForInsurance += item.total
            })

        // Calcular HT total de materiales (incluyendo los de entrega/recogida manuales que no llevan seguro)
        let totalMaterialItemsHT = 0
        updated.material.items
            .filter(item => {
                const itemNameLower = item.name.toLowerCase()
                return !itemNameLower.includes('serveur') &&
                    !itemNameLower.includes('servicio') &&
                    !itemNameLower.includes('mozos')
            })
            .forEach(item => {
                totalMaterialItemsHT += item.total
            })

        const insPct = (updated.material.insurancePct ?? 6) / 100
        const insurance = materialHTForInsurance * insPct
        updated.material.insurancePct = insPct * 100
        updated.material.insuranceAmount = insurance

        // ✅ Calcular Livraison HT + TVA al 20%
        const lrHT = (updated.deliveryReprise?.deliveryCost || 0) + (updated.deliveryReprise?.pickupCost || 0)
        const lrTVA = lrHT * 0.20  // TVA fijo 20% para Livraison

        // Material HT = Items + Insurance + Livraison
        const materialHTWithInsurance = totalMaterialItemsHT + insurance
        const materialTVA = materialHTWithInsurance * (updated.material.tvaPct / 100)

        // ✅ Material TTC incluye Livraison con su propia TVA calculada aparte
        updated.material.totalHT = materialHTWithInsurance + lrHT
        updated.material.tva = materialTVA + lrTVA  // Suma ambas TVAs
        updated.material.totalTTC = updated.material.totalHT + updated.material.tva
    }

    // Actualizar valores de Livraison (solo para referencia, ya está incluido en Material)
    if (updated.deliveryReprise) {
        const lrHT = (updated.deliveryReprise.deliveryCost || 0) + (updated.deliveryReprise.pickupCost || 0)
        updated.deliveryReprise.totalHT = lrHT
        updated.deliveryReprise.tvaPct = 20
        updated.deliveryReprise.tva = lrHT * 0.20
        updated.deliveryReprise.totalTTC = updated.deliveryReprise.totalHT + updated.deliveryReprise.tva
    }

    // Recalcular Boissons Soft
    if (updated.boissonsSoft) {
        const bsHT = updated.boissonsSoft.pricePerPerson * updated.boissonsSoft.totalPersons
        updated.boissonsSoft.totalHT = bsHT
        // Asegurar TVA fijo del 20%
        updated.boissonsSoft.tvaPct = 20
        updated.boissonsSoft.tva = bsHT * 0.20
        updated.boissonsSoft.totalTTC = bsHT + updated.boissonsSoft.tva
    }

    // Recalcular desplazamiento
    if (updated.deplacement) {
        const deplacementHT = updated.deplacement.distance * updated.deplacement.pricePerKm
        updated.deplacement.totalHT = deplacementHT
        updated.deplacement.tva = deplacementHT * (updated.deplacement.tvaPct / 100)
        updated.deplacement.totalTTC = deplacementHT + updated.deplacement.tva
    }

    // Recalcular totales generales
    let totalHT = updated.menu.totalHT
    let totalTVA = updated.menu.tva

    if (updated.material) {
        totalHT += updated.material.totalHT
        totalTVA += updated.material.tva
    }

    // ⚠️ Livraison ya está incluido en Material, NO sumar aquí para evitar duplicación
    // if (updated.deliveryReprise) {
    //     totalHT += updated.deliveryReprise.totalHT
    //     totalTVA += updated.deliveryReprise.tva
    // }

    if (updated.boissonsSoft) {
        totalHT += updated.boissonsSoft.totalHT
        totalTVA += updated.boissonsSoft.tva
    }

    if (updated.deplacement) {
        totalHT += updated.deplacement.totalHT
        totalTVA += updated.deplacement.tva
    }

    // Recalcular extras
    if (updated.extras) {
        totalHT += updated.extras.totalHT
        totalTVA += updated.extras.totalTVA
    }

    if (updated.service) {
        totalHT += updated.service.totalHT
        totalTVA += updated.service.tva
    }

    let totalTTC = totalHT + totalTVA

    // Aplicar descuento si existe
    if (updated.totals.discount && updated.totals.discount.amount > 0) {
        totalTTC -= updated.totals.discount.amount
    }

    updated.totals = {
        ...updated.totals,
        totalHT,
        totalTVA,
        totalTTC
    }

    return updated
}
