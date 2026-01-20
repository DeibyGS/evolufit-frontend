import React from 'react'
import { Hero } from '../components/Hero.jsx'
import { ServiceSection } from '../components/ServiceSection.jsx'
import { PlanCard } from '../components/PlanCard.jsx'
import { ReviewsSection } from '../components/ReviewsSection.jsx'
import { ContactSection } from '../components/ContactSection.jsx'

export const Home = () => {
  return (
    <>
       <Hero/>
       <ServiceSection/>
       <PlanCard/>
       <ReviewsSection/>
       <ContactSection/>
    </>
  )
}


