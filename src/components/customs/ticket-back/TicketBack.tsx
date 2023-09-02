import { FC } from 'react'
import cn from 'classnames'

import { CardBack } from 'src/types/EnviromentsInterface'

import Pow1Image from 'assets/images/pow-1.png'
import Pow2Image from 'assets/images/pow-2.png'
import HeartImage from 'assets/images/heart.svg'
import CupcakeImage from 'assets/images/cupcake.png'

interface TicketBackProps {
  cardBackData: CardBack
  stage: number
}

export const TicketBack: FC<TicketBackProps> = ({
  cardBackData: { gifts, title, subtitle },
  stage = 1
}) => (
  <section className="bc-card --back">
    {/* <div className="bc-card__title">
      <span>{title}</span>
      <span>{subtitle}</span>
    </div>
    <div className="bc-card__square-container">
      {gifts.map((obj, index) => (
        <div
          key={index}
          className={
            cn(
              'bc-card__square',
              (obj > 0 && obj < 100) && '--with-gift',
              stage === index + 1 && '--with-end',
              (index + 1) <= stage && '--stage-passed'
            )
          }>
          <span className='bc-card__square-number'>{index + 1}</span>

          {index < stage
            ? <img className='bc-card__square-cake' src={CakeImage} alt='imagen de torta' />
            : (
              <div className='bc-card__square-value'>
                <span>{obj === 0 ? '' : `${obj}%`}</span>
              </div>
            )}
        </div>
      ))}
    </div> */}

    <div className="bc-card__background">
      <img className='bc-card__background-cupcake' src={Pow2Image} alt='imagen de circulos' />
      <img className='bc-card__background-cupcake' src={Pow2Image} alt='imagen de circulos' />
      <img className='bc-card__background-cupcake' src={Pow1Image} alt='imagen de circulos' />
      <img className='bc-card__background-cupcake' src={Pow1Image} alt='imagen de circulos' />
    </div>

    <div className="bc-card__texts">
      <div className='bc-card__texts-title'>
        <img src={HeartImage} alt="imagen de corazón" />
        <span>{title}</span>
        <img src={HeartImage} alt="imagen de corazón" />
      </div>
      <p className='bc-card__texts-subtitle'>{subtitle}</p>
    </div>

    <div className="bc-card__space-container">
      {gifts.map((obj, index) => (
        <div
          key={index}
          className={cn(
            'bc-card__space',
            obj > 0 && '--discount'
          )}>
          {index < stage
            ? (
              <img
                className='bc-card__space-cupcake'
                src={CupcakeImage}
                alt='imagen de cupcake' />
            )
            : obj === 100
              ? <span>FREE</span>
              : obj > 0 && <span>{obj}%</span>
          }
        </div>
      ))}
    </div>

  </section>
)
