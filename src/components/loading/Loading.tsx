import { Spinner } from "@nextui-org/react"

import CupcakeYellow from 'assets/images/cupcake.png'

export const Loading = () => {
  return (
    <div className="bc-loading">
      {/* <Spinner
        classNames={{
          base: 'bc-loading__spinner'
        }} /> */}

      <img
        className='bc-loading__spinner'
        src={CupcakeYellow}
        alt="imagen de cupcake spinner" />

      <span className="bc-loading__label">Cargando...</span>
    </div>
  )
}