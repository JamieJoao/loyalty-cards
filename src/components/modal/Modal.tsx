import { FC, ReactNode } from 'react'

import './styles.scss'

interface ModalProps {
  onAccept: () => void
  onClose: () => void
  children: ReactNode
}

export const Modal: FC<ModalProps> = ({
  onAccept,
  onClose,
  children
}) => {
  return (
    <div className="bc-modal">
      <div
        className="bc-modal__backdrop"
        onClick={onClose} />
      <div className="bc-modal__body">
        {children}
        <hr />
        <button
          onClick={onAccept}>Aceptar</button>
        <button
          onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}