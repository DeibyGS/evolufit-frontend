import React from 'react'
import CountUp from 'react-countup';

/**
 * COMPONENTE REUTILIZABLE DE CONTEO ANIMADO
 * * Este componente actúa como un wrapper de 'react-countup' para 
 * animar valores numéricos de forma declarativa.
 * * Propiedades clave:
 * - start: Valor inicial (0 para que la animación suba).
 * - end: El objetivo final (100 en este caso).
 * - delay: Tiempo de espera antes de iniciar (0 para respuesta inmediata).
 * - countUpRef: Referencia de render prop que conecta la lógica con el DOM.
 */
export const useCounterPerformance = () => {
  return (
    <CountUp start={0} end={100} delay={0}>
      {({ countUpRef }) => (
        <div>
          {/* Se inyecta la referencia en el span para evitar re-renders innecesarios en React */}
          <span ref={countUpRef} />
        </div>
      )}
    </CountUp>
  )
}