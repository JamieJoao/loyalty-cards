import { FC, useState, useEffect } from 'react'
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import {
  FaTrash,
  FaPlus,
  FaList,
  FaDollarSign,
  FaCookieBite,
} from 'react-icons/fa'

import { CustomerInterface, CustomerPurchase } from "src/types/CustomerInterface"
import { useForm } from 'src/hooks/useForm'

interface ModalAddPurchaseProps {
  onSubmit: (form: { product: string, price: string }) => void
  onClose: () => void
  handleRemovePurchase: (purchases: CustomerPurchase[]) => Promise<void>
  currentCustomer: CustomerInterface | null
  isOpen: boolean
  spinners: { addPurchase?: boolean }
}

interface SpinRemovePurchase {
  status: boolean
  data: number
}

export const ModalAddPurchase: FC<ModalAddPurchaseProps> = ({
  onSubmit,
  onClose,
  handleRemovePurchase,
  currentCustomer,
  isOpen,
  spinners,
}) => {
  const { form, handleChange, handleSetValue, resetForm } = useForm({
    product: '',
    price: '',
  })
  const [showPurchasesList, setShowPurchasesList] = useState<boolean>(false)
  const [spinRemovePurchase, setSpinRemovePurchase] = useState<SpinRemovePurchase | null>(null)

  useEffect(() => {
    if (isOpen) {
      resetForm()
      setShowPurchasesList(false)
    }
  }, [isOpen])

  const handlePrepareRemovePurchase = async (index: number) => {
    if (currentCustomer) {
      setSpinRemovePurchase({ status: true, data: index })

      const purchases = currentCustomer?.purchases.filter((_, i) => i !== index)
      await handleRemovePurchase(purchases)
      setSpinRemovePurchase(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen && Boolean(currentCustomer)}
      onOpenChange={onClose}
      backdrop='blur'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Agregar compra</ModalHeader>
            <ModalBody>
              <Input
                label='Nombre'
                placeholder='Ejemplo: Minitorta de Superman'
                type='text'
                variant='flat'
                startContent={<FaCookieBite className='text-default-400' />}
                value={form.product}
                onChange={(e) => handleChange(e, 'product')}
                spellCheck={false} />

              <Input
                label='Precio'
                placeholder='Ejemplo: 15.9'
                type='number'
                variant='flat'
                startContent={<span className='bc-currency-pen text-default-400'>S/</span>}
                value={form.price}
                onChange={(e) => handleChange(e, 'price')}
                spellCheck={false} />

              {showPurchasesList && (
                <>
                  <Divider />
                  <Table
                    removeWrapper
                    aria-label='tabla para mostrar las compras del cliente'>
                    <TableHeader>
                      <TableColumn>Producto</TableColumn>
                      <TableColumn className='text-right'>Acción</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent='El cliente no tiene compras'>
                      {(currentCustomer?.purchases ?? []).map((obj, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex flex-col">
                              <p className="text-bold text-sm capitalize">{obj.product}</p>
                              <p className="text-bold text-sm capitalize text-default-400">S/ {obj.price}</p>
                            </div>
                          </TableCell>
                          <TableCell className='text-right'>
                            <Button
                              size='sm'
                              color='warning'
                              variant='bordered'
                              aria-label='Borrar compra'
                              spinner={<Spinner color='warning' size='sm' />}
                              isLoading={spinRemovePurchase?.status && spinRemovePurchase.data === index}
                              onClick={() => handlePrepareRemovePurchase(index)}>
                              <FaTrash />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant='bordered'
                color='secondary'
                startContent={<FaList />}
                onClick={() => setShowPurchasesList(!showPurchasesList)}>
                {showPurchasesList ? 'Ocultar' : 'Mostrar'} lista de compras
              </Button>

              <Button
                variant='bordered'
                color='primary'
                isDisabled={!form.product || !form.price}
                spinner={<Spinner size='sm' />}
                isLoading={spinners.addPurchase}
                onClick={() => onSubmit(form)}
                startContent={<FaPlus />}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}