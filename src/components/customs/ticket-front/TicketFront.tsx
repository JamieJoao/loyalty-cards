import { FC } from 'react'

import CupCakeImage from 'assets/images/cupcake.png'
import HeartImage from 'assets/images/heart.svg'
import ChipsImage from 'assets/images/chips.png'

interface TicketFrontProps {
  customerName: string
}

export const TicketFront: FC<TicketFrontProps> = ({ customerName }) => (
  <section className='bc-card --front'>
    <div className="bc-card__banner">
      <img className='bc-card__banner__logo --left' src={CupCakeImage} alt="imagen de cupcake" />
      <span className='bc-card__banner__name'>
        <span>Bocato</span>
        <span className='bc-card__subtitle'>
          <img className='bc-card__heart --left' src={HeartImage} alt="imagen de un corazon" />
          El arte de endulzar
          <img className='bc-card__heart --right' src={HeartImage} alt="imagen de un corazon" />
        </span>
      </span>
    </div>

    <span className='bc-card__title'>{customerName}</span>
    <div className="bc-card__line-dotted"></div>

    <img className='bc-card__chips --left' src={ChipsImage} alt="imagen de chips de colores" />
    <img className='bc-card__chips --right' src={ChipsImage} alt="imagen de chips de colores" />
  </section>
)