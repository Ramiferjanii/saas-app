import React from 'react'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import CompanionsCard from '@/components/CompanionsCard'


const Page = () => {
  return (
    <main>
      <h1  >Popular companions  </h1>
      <section className='home-section' >
        <CompanionsCard id="123" name='Naura the brainy Explorer' topic="Neural Netwark of the Brain " subject="science" duration={45}  color="#ffda6e" />
        <CompanionsCard id="34" name='Country the Number Wizard ' topic=" Derivations & Integrals " subject="Math" duration={30}  color="#e5d0ff" />
        <CompanionsCard  id="23" name='Verba the Vocabulary Builder' topic="Language " subject="Enlish Literature" duration={45}  color="#BDE7FF"/>
      </section>

      <section className='home-section' >
        <CompanionsList />
        <CTA />
      </section>
  
      </main>
  )
}

export default Page