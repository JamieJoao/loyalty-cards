import { FC, useState, useEffect, useMemo } from 'react'
import {
  Button,
  Divider,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
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
import { cutNames, filterValidPurchases, getProductDetail } from 'src/utils/functions'
import { MAX_HEIGHT_PER_ITEM, MAX_ITEMS } from 'src/domain/constants'
import classNames from 'classnames'
import { PurchaseInterface } from 'src/types/PurchaseInterface'

interface ModalAddPurchaseProps {
  onSubmit: (form: { product: string, price: string }) => Promise<void>
  onClose: () => void
  handleRemovePurchase: (purchases: PurchaseInterface[]) => Promise<void>
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
  const { form, handleChange, resetForm } = useForm({
    product: '',
    price: '',
  })
  const [spinRemovePurchase, setSpinRemovePurchase] = useState<SpinRemovePurchase | null>(null)

  useEffect(() => {
    if (isOpen) {
      resetForm()
    }
  }, [isOpen])

  const validPurchasesMemo = useMemo(() => (
    filterValidPurchases(currentCustomer?.purchases)
  ), [currentCustomer])

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
      placement='top'
      backdrop='blur'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Compras de {cutNames(currentCustomer?.names)}</ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full">
                <Tabs
                  fullWidth
                  aria-label='Tabs de compras'>
                  <Tab key='new-purchase' title='Nueva'>
                    <div className="flex flex-col gap-y-4">
                      <Input
                        label='Nombre'
                        placeholder='Ejemplo: Minitorta de Superman'
                        type='text'
                        variant='flat'
                        isReadOnly={spinners.addPurchase}
                        startContent={<FaCookieBite className='text-default-400' />}
                        value={form.product}
                        onChange={(e) => handleChange(e, 'product')}
                        spellCheck={false} />

                      <Input
                        label='Precio'
                        placeholder='Ejemplo: 15.9'
                        type='number'
                        variant='flat'
                        isReadOnly={spinners.addPurchase}
                        startContent={<span className='bc-currency-pen text-default-400'>S/</span>}
                        value={form.price}
                        onChange={(e) => handleChange(e, 'price')}
                        spellCheck={false} />

                      <Button
                        className='mb-2'
                        variant='bordered'
                        color='primary'
                        isDisabled={!form.product || !form.price}
                        spinner={<Spinner size='sm' />}
                        isLoading={spinners.addPurchase}
                        onClick={async () => {
                          await onSubmit(form)
                          resetForm()
                        }}
                        startContent={<FaPlus />}>
                        Guardar
                      </Button>
                    </div>
                  </Tab>
                  <Tab key='history' title='Historial'>
                    <div
                      className={classNames(
                        'overflow-auto',
                        `max-h-[${MAX_HEIGHT_PER_ITEM * MAX_ITEMS}px]`
                      )}>
                      <Table
                        removeWrapper
                        aria-label='tabla para mostrar las compras del cliente'>
                        <TableHeader>
                          <TableColumn>PRODUCTO</TableColumn>
                          <TableColumn className='text-right'>ACCIÓN</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent='El cliente no tiene compras'>
                          {validPurchasesMemo.map((obj, index) => (
                            <TableRow key={obj.id}>
                              <TableCell className='px-0'>
                                <div className="flex flex-col">
                                  {obj.products.map((product, pIndex) => (
                                    <p
                                      key={pIndex}
                                      className="text-bold text-sm">
                                      {getProductDetail(product)}
                                    </p>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className='text-right'>
                                <Button
                                  isIconOnly
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
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
            {/* <ModalFooter></ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}