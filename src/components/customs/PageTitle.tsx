import { FC, ReactNode } from 'react'

interface PageTitleProps {
  children?: ReactNode
}

export const PageTitle: FC<PageTitleProps> = ({ children }) => {
  return (
    <h3 className="text-lg mb-4 font-bold">{children ?? 'Título de página'}</h3>
  )
}