import { FC, useEffect, useState } from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useForm } from 'src/hooks/useForm'
import { FaUser } from 'react-icons/fa'
import { useClient } from 'src/hooks/useClient'
import { CustomerInterface } from 'src/types/CustomerInterface'

interface ModalUpdateCustomerProps {
  customer: CustomerInterface
  isOpen: boolean
  onClose: () => void
}

interface CustomerForm {
  names?: string
  phone?: string
}

export const ModalUpdateCustomer: FC<ModalUpdateCustomerProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  const { updateClient } = useClient()
  const { form, setForm, resetForm, handleChange } = useForm<CustomerForm>({
    names: '',
    phone: ''
  })
  const [showSpinners, setShowSpinners] = useState(false)

  useEffect(() => {
    if (isOpen && customer) {
      const { names = '', phone } = customer

      setForm({
        names,
        phone: phone ? String(phone) : '',
      })
    }
    else {
      resetForm()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, customer])

  const isDisabled = (
    !form.names && !form.phone
  )

  const handleClick = async () => {
    if (customer) {
      const { id } = customer

      setShowSpinners(true)
      await updateClient(id, { ...form })

      setShowSpinners(false)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={showSpinners ? undefined : onClose}>
      <ModalContent>
        <ModalHeader>Actualizar cliente</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-y-4">
            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              label='Nombre'
              placeholder='Ejemplo: Pepito Lopez'
              isDisabled={showSpinners}
              value={form.names}
              onChange={e => handleChange(e, 'names')} />

            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              label='Celular'
              placeholder='Ejemplo: 987654321'
              isDisabled={showSpinners}
              value={form.phone}
              onChange={e => handleChange(e, 'phone')} />

            <Button
              fullWidth
              startContent={<FaUser />}
              color='primary'
              variant='shadow'
              isDisabled={isDisabled}
              isLoading={showSpinners}
              onClick={handleClick}>
              Guardar
            </Button>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}