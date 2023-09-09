import { FC, Key } from 'react'
import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { FaBriefcase, FaCalendar, FaIdCard, FaLink, FaPhone, FaShoppingCart, FaTicketAlt, FaTransgender, FaTrash } from "react-icons/fa"
import { FaCartPlus, FaLocationDot } from "react-icons/fa6"
import { CustomerInterface } from "src/types/CustomerInterface"
import { cutNames, getQuantityPurchases } from 'src/utils/functions'
import moment from 'moment'

interface ModalCustomerDetailProps {
  isOpen: boolean
  currentCustomer: CustomerInterface
  onClose: () => void
  onAction: (customer: CustomerInterface, key: Key) => void
}

export const ModalCustomerDetail: FC<ModalCustomerDetailProps> = ({
  isOpen,
  currentCustomer,
  onClose,
  onAction,
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
        <ModalBody>
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
        <ModalFooter className='flex-col gap-2'>
          {/* <Dropdown className="bg-background border-1 border-default-200">
            <DropdownTrigger>
              <Button
                variant='bordered'
                color='primary'
                fullWidth>Acciones</Button>
            </DropdownTrigger>
            <DropdownMenu
              variant='faded'
              aria-labelledby='Menu de opciones'
              onAction={key => onAction(currentCustomer, key)}>
              <DropdownItem
                key='ticket'
                startContent={<FaTicketAlt className='text-primary-400' />}>Ver ticket</DropdownItem>
              <DropdownItem
                key='link'
                startContent={<FaLink className='text-success-400' />}>Ver link</DropdownItem>
              <DropdownItem
                key='delete'
                startContent={<FaTrash className='text-danger-400' />}>Eliminar</DropdownItem>
            </DropdownMenu>
          </Dropdown> */}

          {/* <ButtonGroup fullWidth>
            <Button
              fullWidth
              variant='bordered'
              startContent={<FaTicketAlt className='text-primary-400' />}
              isIconOnly></Button>
            <Button
              variant='bordered'
              startContent={<FaLink className='text-success-400' />}
              isIconOnly></Button>
            <Button
              variant='bordered'
              startContent={<FaTrash className='text-danger-400' />}
              isIconOnly></Button>
            <Button
              variant='bordered'
              isIconOnly></Button>
          </ButtonGroup> */}
          <Button
            color='primary'
            variant='bordered'
            startContent={<FaCartPlus className='text-primary-400' />}
            onClick={() => onAction(currentCustomer, 'purchase')}>Agregar Compra</Button>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              variant='bordered'
              startContent={<FaTicketAlt className='text-primary-400' />}
              onClick={() => onAction(currentCustomer, 'ticket')}>Ver Ticket</Button>
            <Button
              variant='bordered'
              startContent={<FaLink className='text-primary-400' />}
              onClick={() => onAction(currentCustomer, 'link')}>Ver Link</Button>
          </div>
          <Button
            color='danger'
            variant='bordered'
            startContent={<FaTrash className='text-danger-400' />}
            onClick={() => onAction(currentCustomer, 'delete')}>Eliminar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}