import React from 'react'
// Importación de componentes modulares para mantener el principio de Responsabilidad Única
import { Hero } from '../components/Hero.jsx'
import { ServiceSection } from '../components/ServiceSection.jsx'
import { PlanCard } from '../components/PlanCard.jsx'
import { ReviewsSection } from '../components/ReviewsSection.jsx'
import { ContactSection } from '../components/ContactSection.jsx'

/**
 * COMPONENTE HOME - EVOLUTFIT
 * Este es el punto de entrada principal (Landing Page).
 * Sigue un patrón de diseño vertical orientado a la conversión (AIDA: Atención, Interés, Deseo, Acción).
 */
export const Home = () => {
  return (
    <>
       {/* 1. SECCIÓN HERO: Captación inmediata. 
           Debe contener el mensaje principal (Value Proposition) y el CTA primario. */}
       <Hero/>

       {/* 2. SERVICIOS: Fase de Interés. 
           Explica qué ofrece la plataforma (Rutinas, Dietas, Seguimiento). */}
       <ServiceSection/>

       {/* 3. PLANES DE PRECIO: Fase de Deseo/Decisión. 
           Muestra las opciones de suscripción para convertir al visitante en cliente. */}
       <PlanCard/>

       {/* 4. RESEÑAS: Prueba Social. 
           Genera confianza mediante testimonios de otros atletas de la comunidad. */}
       <ReviewsSection/>

       {/* 5. CONTACTO: Cierre de dudas y soporte. 
           Último punto de contacto antes de que el usuario abandone la página. */}
       <ContactSection/>
    </>
  )
}