import { FC } from 'react'

interface QuantityItemsProps {
  items: unknown[]
  text: string
}

export const QuantityItems: FC<QuantityItemsProps> = ({ items = [], text = 'items' }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-default-400 text-small">Total {items.length} {text}</span>
    </div>
  )
}
