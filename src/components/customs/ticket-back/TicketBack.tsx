import { FC } from 'react'
import cn from 'classnames'

import CakeImage from 'assets/images/cake-2.png'
import { CardBack } from 'src/types/EnviromentsInterface'

interface TicketBackProps {
  cardBackData: CardBack
  stage: number
}

export const TicketBack: FC<TicketBackProps> = ({
  cardBackData: { gifts, title, subtitle },
  stage = 1
}) => (
  <section className="bc-card --back">
    <div className="bc-card__title">
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

          {/* <div className='bc-card__square-value'>
            <span>{obj === 0 ? index + 1 : `${obj}`}</span>
          </div> */}
        </div>
      ))}
    </div>
  </section>
)
