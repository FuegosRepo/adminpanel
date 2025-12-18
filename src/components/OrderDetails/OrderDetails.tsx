import React from 'react'
import { CateringOrder } from '@/types'
import { X, Calendar, Users, MapPin, Clock, Mail, Phone, User, CreditCard } from 'lucide-react'
import styles from './OrderDetails.module.css'
import { ProductListResolver } from '../admin/ProductListResolver'

interface OrderDetailsProps {
    isOpen: boolean
    order: CateringOrder
    onClose: () => void
}

export default function OrderDetails({ isOpen, order, onClose }: OrderDetailsProps) {
    if (!isOpen) return null

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return 'Non spécifié'
        try {
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        } catch (error) {
            return 'Date invalide'
        }
    }

    const formatEventType = (type: string) => {
        const types: { [key: string]: string } = {
            wedding: 'Mariage',
            birthday: 'Anniversaire',
            corporate: 'Événement Professionnel',
            other: 'Autre'
        }
        return types[type] || type
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Détails de la Commande</h2>
                    <button onClick={onClose} className={styles.closeBtn} title="Fermer">
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Client Information */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <User size={20} />
                            Informations Client
                        </h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <User size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Nom</span>
                                    <span className={styles.value}>{order.contact.name}</span>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <Mail size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Email</span>
                                    <span className={styles.value}>{order.contact.email}</span>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <Phone size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Téléphone</span>
                                    <span className={styles.value}>{order.contact.phone || 'Non fourni'}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Event Information */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Calendar size={20} />
                            Informations Événement
                        </h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <Calendar size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Date</span>
                                    <span className={styles.value}>{formatDate(order.contact.eventDate)}</span>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <CreditCard size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Type</span>
                                    <span className={styles.value}>{formatEventType(order.contact.eventType)}</span>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <Users size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Invités</span>
                                    <span className={styles.value}>{order.contact.guestCount} personnes</span>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <MapPin size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Lieu</span>
                                    <span className={styles.value}>{order.contact.address || 'Non spécifié'}</span>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <Clock size={16} className={styles.icon} />
                                <div>
                                    <span className={styles.label}>Moment</span>
                                    <span className={styles.value}>{order.menu.type === 'dejeuner' ? 'Déjeuner' : 'Dîner'}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Menu Selection */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Sélection Menu</h3>

                        {/* Entrees */}
                        {order.entrees && order.entrees.length > 0 && (
                            <div className={styles.menuCategory}>
                                <h4 className={styles.categoryTitle}>Entrées</h4>
                                <ProductListResolver ids={order.entrees} category="entrees" />
                            </div>
                        )}

                        {/* Viandes */}
                        {order.viandes && order.viandes.length > 0 && (
                            <div className={styles.menuCategory}>
                                <h4 className={styles.categoryTitle}>Viandes</h4>
                                <ProductListResolver ids={order.viandes} category="viandes" />
                            </div>
                        )}

                        {/* Desserts */}
                        {order.dessert && order.dessert.length > 0 && (
                            <div className={styles.menuCategory}>
                                <h4 className={styles.categoryTitle}>Desserts</h4>
                                <ProductListResolver ids={order.dessert} category="desserts" />
                            </div>
                        )}
                    </section>

                    {/* Additional Notes */}
                    {order.notes && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Informations Supplémentaires</h3>
                            <p className={styles.additionalInfo}>{order.notes}</p>
                        </section>
                    )}

                    {/* Order Metadata */}
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Informations Commande</h3>
                        <div className={styles.metadata}>
                            <div>
                                <span className={styles.label}>Reçu le:</span>
                                <span className={styles.value}>{formatDate(order.createdAt)}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Dernière modification:</span>
                                <span className={styles.value}>{formatDate(order.updatedAt)}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
