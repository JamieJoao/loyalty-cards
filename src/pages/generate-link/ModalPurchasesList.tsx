import { FC, useState, useEffect } from 'react'
import {
  Accordion,
  AccordionItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import moment from 'moment'

import { DATE_FORMAT_SPECIAL } from 'src/utils/constants'
import { PurchaseInterface } from 'src/types/PurchaseInterface'
import { getTotalByPurchase } from 'src/utils/functions'
import { PurchaseProductDetail } from 'src/components'

import {
  LuClipboardEdit,
} from 'react-icons/lu'

interface ModalPurchasesListProps {
  currentPurchase: PurchaseInterface | null
  purchases: PurchaseInterface[]
  isOpen: boolean
  onClose: () => void
  onSelect: (purchase: PurchaseInterface) => void
}

export const ModalPurchasesList: FC<ModalPurchasesListProps> = ({
  currentPurchase,
  purchases,
  isOpen,
  onClose,
  onSelect,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) {
      setSelectedKeys([currentPurchase?.id ?? ''])
    }
  }, [isOpen, currentPurchase])

  const handleSelectedKeys = (keys: any) => {
    const [nextID] = keys
    if (nextID !== undefined) {
      setSelectedKeys(Array.from(keys))
    }
  }

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
        <ModalBody
          className='px-2 py-4'
        >
          <Accordion
            variant='light'
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectedKeys}
          >
            {purchases.map(purchase => (
              <AccordionItem
                key={purchase.id}
                aria-label='Compra del cliente'
                title={<p className='text-xs'>{moment(purchase.date).format(DATE_FORMAT_SPECIAL)}</p>}
                subtitle={<p className='text-xs'>s/ {getTotalByPurchase(purchase.products)}</p>}
                startContent={
                  <div
                    role='button'
                    className='bg-warning-100 w-unit-8 h-unit-8 rounded-md flex justify-center items-center'
                    onClick={() => onSelect(purchase)}
                  >
                    <LuClipboardEdit className='text-sm text-warning-500' />
                  </div>
                }
              >
                {purchase.products.map((product, pIndex) => (
                  <PurchaseProductDetail
                    key={pIndex}
                    purchaseProduct={product}
                  />
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}