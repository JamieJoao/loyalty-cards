import { FC, useEffect } from 'react'
import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import { useClient } from 'src/hooks/useClient'
import { DATE_FORMAT_SPECIAL } from 'src/domain/constants'
import moment from 'moment'
import { usePurchase } from 'src/hooks/usePurchase'
import { PurchaseInterface } from 'src/types/PurchaseInterface'
import { getTotalByPurchase } from 'src/utils/functions'

interface ModalPurchasesListProps {
  customerId: string
  purchases: PurchaseInterface[]
  isOpen: boolean
  onClose: () => void
}

export const ModalPurchasesList: FC<ModalPurchasesListProps> = ({
  customerId,
  purchases,
  isOpen,
  onClose,
}) => {
  // const { client, getClient } = useClient()

  // useEffect(() => {
  //   const unsub = getClient(customerId, false)
  //   return () => unsub()
  // }, [])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size='xl'
      classNames={{
        body: ''
      }}
      scrollBehavior='inside'>
      <ModalContent>
        <ModalHeader>Historial</ModalHeader>
        <ModalBody>
          {purchases.length
            ? (purchases.map(purchase => (
              <div
                key={purchase.id}
                className="flex flex-col mb-4">
                <div className="flex justify-between mb-2">
                  <p className='text-xs'>{moment(purchase.date).format(DATE_FORMAT_SPECIAL)}</p>
                  <p className='text-xs'>s/ {getTotalByPurchase(purchase.products)}</p>
                </div>

                <Divider />

                {purchase.products.map((product, pIndex) => (
                  <div
                    key={pIndex}
                    className='flex flex-col mt-2'>
                    <p className='text-sm'>
                      {`${product.product.name} - `}
                      <span className='text-xs text-primary-400 font-bold'>{product.quantity}u</span>
                    </p>
                    <p className='text-xs text-default-400'>{`s/ ${(product.price * product.quantity).toFixed(2)}`}</p>
                  </div>
                ))}
              </div>
            )))
            : <p className='text-default-400'>No hay compras que mostrar</p>}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}