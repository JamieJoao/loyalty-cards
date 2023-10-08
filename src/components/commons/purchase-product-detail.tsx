import { FC } from 'react'
import { PurchaseProductsInterface } from 'src/types/PurchaseInterface'

interface PurchaseProductDetailProps {
  purchaseProduct: PurchaseProductsInterface
}

export const PurchaseProductDetail: FC<PurchaseProductDetailProps> = ({ purchaseProduct }) => (
  <div className='flex flex-col mt-2'>
    <p className='text-sm'>
      {`${purchaseProduct.product.name} - `}
      <span className='text-xs text-primary-400 font-bold'>{purchaseProduct.quantity}u</span>
    </p>
    <p className='text-xs text-default-400'>{`s/ ${(purchaseProduct.price * purchaseProduct.quantity).toFixed(2)}`}</p>
  </div>
)
