import { FC } from 'react'

import CupCakeImage from 'assets/images/cupcake.png'
import CupcakeWhiteImage from 'assets/images/cupcake-white.png'
import NameBorderImage from 'assets/images/name-border.svg'

interface TicketFrontProps {
  customerName: string
}

export const TicketFront: FC<TicketFrontProps> = ({ customerName }) => (
  <section className='bc-card --front'>
    <div className="bc-card__background">
      <img className='bc-card__background-cupcake' src={CupcakeWhiteImage} alt='imagen de cupcake blanco de fondo' />
      <img className='bc-card__background-cupcake' src={CupcakeWhiteImage} alt='imagen de cupcake blanco de fondo' />
      <img className='bc-card__background-cupcake' src={CupcakeWhiteImage} alt='imagen de cupcake blanco de fondo' />
      <img className='bc-card__background-cupcake' src={CupcakeWhiteImage} alt='imagen de cupcake blanco de fondo' />
    </div>

    <div className="bc-card__banner">
      <img className="bc-card__banner-cupcake" src={CupCakeImage} />
      <div className="bc-card__banner-texts">
        <p className="bc-card__banner-texts__title">Bocato</p>
        <p className="bc-card__banner-texts__subtitle">el arte de endulzar</p>
      </div>

    </div>
    <div className='bc-card__customer-name'>
      <p>{customerName}</p>
      <img src={NameBorderImage} />
    </div>
  </section>
)