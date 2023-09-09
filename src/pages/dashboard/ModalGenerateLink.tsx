import { FC, useEffect } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react"
import {
  FaLink,
  FaCookieBite,
  FaIdCard,
} from 'react-icons/fa'

import { useForm } from "src/hooks/useForm"
import { CustomerPurchase } from 'src/types/CustomerInterface'

// interface Form extends CustomerPurchase {
//   dni: string
// }

interface ModalGenerateLinkProps {
  onSubmit: (form: CustomerPurchase) => void
  onClose: () => void
  customerId: string | null
  isOpen: boolean
  spinners: { generateLink?: boolean }
}

export const ModalGenerateLink: FC<ModalGenerateLinkProps> = ({
  onSubmit,
  onClose,
  isOpen,
  spinners,
  customerId,
}) => {
  const { form, handleChange, resetForm } = useForm<CustomerPurchase>({
    product: '',
    price: '',
    // dni: '',
  })

  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  const isDisabled = (
    !form.product ||
    !form.price
    // !form.dni
  )

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop='blur'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Generar nuevo link</ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-y-4'>
                <p className='text-xs'>Registra la primera compra del usuario</p>

                <Input
                  label='Producto'
                  placeholder='Ejemplo: Minitorta de Superman'
                  type='text'
                  variant='flat'
                  value={form.product}
                  onChange={(e) => handleChange(e, 'product')}
                  spellCheck={false}
                  isReadOnly={!!customerId}
                  startContent={<FaCookieBite className='text-default-400' />} />

                <Input
                  label='Precio'
                  placeholder='Ejemplo: 15.9'
                  type='number'
                  variant='flat'
                  value={form.price}
                  onChange={(e) => handleChange(e, 'price')}
                  spellCheck={false}
                  isReadOnly={!!customerId}
                  startContent={<span className='bc-currency-pen text-default-400'>S/</span>} />

                <Button
                  className='mb-5'
                  variant='bordered'
                  color='primary'
                  isDisabled={isDisabled}
                  spinner={<Spinner size='sm' />}
                  isLoading={spinners.generateLink}
                  onClick={() => {
                    onSubmit(form)
                  }}
                  startContent={<FaLink />}>
                  Generar
                </Button>

                {/* <Input
                label='DNI'
                placeholder='Ejemplo: 12345678'
                type='number'
                variant='flat'
                value={form.dni}
                onChange={(e) => handleChange(e, 'dni')}
                spellCheck={false}
                isReadOnly={!!customerId}
                startContent={<FaIdCard className='text-default-400' />}
                pattern='\d*' /> */}
              </div>
            </ModalBody>
            {/* <ModalFooter></ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}