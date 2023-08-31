import { FC } from 'react'
import cn from 'classnames'

interface TicketBackProps {
  gifts: number[]
  stage: number
}

export const TicketBack: FC<TicketBackProps> = ({ gifts, stage = 1 }) => (
  <section className="bc-card --back">
    <div className="bc-card__title">
      <span>Gracias por elegirnos</span>
      <span>Obtén un 15% de descuento por tu cuarta compra y la septima es gratis</span>
    </div>
    <div className="bc-card__square-container">
      {gifts.map((obj, index) => (
        <div
          className={
            cn(
              'bc-card__square',
              (obj > 0 && obj < 100) && '--with-gift',
              (index + 1) <= stage && '--stage-passed'
            )
          }
          key={index}>
          <span className='bc-card__square-value'>
            {obj === 0 ? index + 1 : `${obj}%`}
          </span>
        </div>
      ))}
    </div>

    {/* <img className='bc-card__chips --bottom' src={ChipsHorImage} alt="imagen de chips de colores" /> */}
  </section>
)
