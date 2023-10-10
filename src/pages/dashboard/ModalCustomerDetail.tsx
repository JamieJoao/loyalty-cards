import { FC } from 'react'
import moment from 'moment'
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
import { FaBriefcase, FaCalendar, FaIdCard, FaPhone, FaShoppingCart, FaTransgender } from "react-icons/fa"
import { FaLocationDot } from "react-icons/fa6"
import { CustomerInterface } from "src/types/CustomerInterface"

import { getQuantityPurchases } from 'src/utils/functions'

interface ModalCustomerDetailProps {
  isOpen: boolean
  currentCustomer: CustomerInterface
  onClose: () => void
}

export const ModalCustomerDetail: FC<ModalCustomerDetailProps> = ({
  isOpen,
  currentCustomer,
  onClose,
}) => {
  const { names, dni, birthdayDate, phone, purchases, id, occupation, address, sex } = currentCustomer
  const quantityPurchases = getQuantityPurchases(purchases)
  const quantity = quantityPurchases < 10 ? '0' + quantityPurchases : quantityPurchases
  const purchasesText = 'compra' + (quantityPurchases <= 1 ? '' : 's')
  const dateParsed = moment(birthdayDate).format('DD MMMM, YYYY')

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <p className="text-tiny uppercase font-bold">{names}</p>
        </ModalHeader>
        <ModalBody className='pb-4'>
          <div className="flex items-center gap-4">
            <FaIdCard className='text-default-400' />
            <p className='text-sm'>{dni}</p>
          </div>
          <div className="flex items-center gap-4">
            <FaShoppingCart className='text-default-400' />
            <p className='text-sm'>{quantity} {purchasesText}</p>
          </div>
          <div className="flex items-center gap-4">
            <FaCalendar className='text-default-400' />
            <p className='text-sm'>{dateParsed}</p>
          </div>
          <div className="flex items-center gap-4">
            <FaBriefcase className='text-default-400' />
            <p className='text-sm'>{occupation}</p>
          </div>
          <div className="flex items-center gap-4">
            <FaLocationDot className='text-default-400' />
            <p className='text-sm'>{address}</p>
          </div>
          <div className="flex items-center gap-4">
            <FaPhone className='text-default-400' />
            <p className='text-sm'>{phone}</p>
          </div>
          <div className="flex items-center gap-4">
            <FaTransgender className='text-default-400' />
            <p className='text-sm'>{sex}</p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}