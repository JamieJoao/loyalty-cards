import { useMemo, FC, useState } from 'react'
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell, TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react"
import {
  FaCartPlus,
  FaEllipsisV,
  FaLink,
  FaTicketAlt,
  FaTrash
} from "react-icons/fa"
import {
  ModalDelete
} from "src/components"
import { CustomerInterface, CustomerPurchase } from 'src/types/CustomerInterface'
import { useForm } from 'src/hooks/useForm'
import { useNavigate } from 'react-router-dom'
import { getQuantityPurchases } from 'src/utils/functions'
import { ModalAddPurchase } from './ModalAddPurchase'
import moment from 'moment'
import { Enviroments } from 'src/types/EnviromentsInterface'
import { ModalShareLink } from './ModalShareLink'

interface TabCurrentsCustomersProps {
  clients: CustomerInterface[]
  updateClient: any
  enviroments: Enviroments
  loadingClients: boolean
  deleteClient: (id: string) => Promise<void>
}

interface ShowModals {
  addPurchase?: boolean
  deleteClient?: boolean
  shareLink?: boolean
}

interface ShowSpinners {
  addPurchase?: boolean
  deleteClient?: boolean
}

export const TabCurrentsCustomers: FC<TabCurrentsCustomersProps> = ({
  clients,
  updateClient,
  enviroments,
  loadingClients,
  deleteClient,
}) => {
  const navigate = useNavigate()
  const { form, handleChange, handleSetValue } = useForm({ search: '', tableLabels: false })
  // const [showTableLabels, setShowTableLabels] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInterface | null>(null)
  const [showModals, setShowModals] = useState<ShowModals>({
    addPurchase: false,
    deleteClient: false,
    shareLink: false
  })
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    addPurchase: false,
    deleteClient: false,
  })

  const clientsFiltered = useMemo(() => {
    const query = ({ names, dni }: CustomerInterface) => JSON.stringify({
      names: names?.toLowerCase(),
      dni,
    })

    return form.search
      ? clients.filter(obj => `${query(obj)}`.includes(form.search.toLowerCase()))
      : clients
  }, [form.search, clients])

  const handleGoToPreview = (id: string) => {
    navigate(`/mi-ticket/${id}`)
  }

  const handleRemovePurchase = async (purchases: CustomerPurchase[]) => {
    if (currentCustomer) {
      await updateClient(
        currentCustomer.id,
        { purchases }
      )
      setCurrentCustomer({ ...currentCustomer, purchases })
    }
  }

  const handleAddPurchase = async (form: { product: string, price: string }) => {
    if (currentCustomer && enviroments) {
      let historyPurchases = currentCustomer.purchases

      if (getQuantityPurchases(historyPurchases) === enviroments.cardBack.gifts.length) {
        historyPurchases = historyPurchases.map(obj => ({ ...obj, used: true }))
      }

      setShowSpinners({ addPurchase: true })
      await updateClient(
        currentCustomer.id,
        {
          purchases: [
            ...historyPurchases,
            {
              product: form.product,
              price: form.price,
              date: moment().format('DD/MM/yyyy'),
              used: false,
            }
          ]
        })

      setShowSpinners({ addPurchase: false })
      setCurrentCustomer(null)
    }
  }

  const skeletonMemo = useMemo(() => (
    <Skeleton className='rounded-lg mt-4 bg-default-100'>
      <div className="h-[40px]"></div>
    </Skeleton>
  ), [])

  const handleAction = (customer: CustomerInterface, key: React.Key) => {
    setCurrentCustomer(customer)

    switch (key) {
      case 'ticket':
        handleGoToPreview(customer.id)
        break
      case 'link':
        setShowModals({ shareLink: true })
        break
      case 'delete':
        setShowModals({ deleteClient: true })
        break
    }
  }

  const handleDeleteLink = async () => {
    if (currentCustomer) {
      setShowSpinners({ deleteClient: true })
      await deleteClient(currentCustomer.id)
      setShowSpinners({ deleteClient: false })
      setShowModals({ deleteClient: false })
    }
  }

  const handleModalPurchase = (customer: CustomerInterface) => {
    setCurrentCustomer(customer)
    setShowModals({ addPurchase: true })
  }

  return (
    <>
      {/* <div className="flex justify-between items-center mb-4">
        <span className="text-default-400 text-small">Total {clientsFiltered.length} clientes</span>
        <label className="flex items-center text-default-400 text-small">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={() => { }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div> */}

      <div className="grid sm:grid-cols-2">
        <Input
          spellCheck={false}
          classNames={{ inputWrapper: 'shadow-none' }}
          label='Buscar'
          placeholder='Ejemplo: Pepito o 12345678'
          type='text'
          value={form.search}
          onChange={e => handleChange(e, 'search')}
          description='Busca a los clientes registrados por su Nombre o DNI.' />
      </div>

      {/* <Checkbox
        className='mt-4'
        isSelected={form.tableLabels}
        onValueChange={value => handleSetValue('tableLabels', value)}>Mostrar todas los campos de la tabla</Checkbox> */}

      {loadingClients
        ? skeletonMemo
        : (
          <Table
            removeWrapper
            className='mt-4 overflow-x-auto pb-4'
            aria-label="Tabla de usuarios">
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Compras</TableColumn>
              <TableColumn>DNI</TableColumn>
              <TableColumn>Cumpleaños</TableColumn>
              <TableColumn>Ocupación</TableColumn>
              <TableColumn>Dirección</TableColumn>
              <TableColumn>Teléfono</TableColumn>
              <TableColumn>Sexo</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No hay usuarios que mostrar"}>
              {clientsFiltered
                .filter(obj => obj.completeData)
                .map((customer, index) => {
                  const { names, dni, birthdayDate, occupation, address, phone, sex, purchases, id } = customer
                  return (
                    <TableRow key={id}>
                      <TableCell>{names}</TableCell>
                      <TableCell>
                        <Badge color='primary' content={getQuantityPurchases(purchases)}>
                          <Button
                            isIconOnly
                            color='primary'
                            variant='bordered'
                            onClick={() => handleModalPurchase(customer)}>
                            <FaCartPlus />
                          </Button>
                        </Badge>
                      </TableCell>
                      <TableCell>{dni}</TableCell>
                      <TableCell>{birthdayDate + ''}</TableCell>
                      <TableCell>{occupation}</TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell>{sex}</TableCell>
                      <TableCell>
                        {/* <ButtonGroup>
                          <ButtonCopy
                            url={`${projectURL}mi-ticket/${id}`} />
                          <Button
                            color='primary'
                            variant='bordered'
                            isIconOnly
                            onClick={() => handleGoToPreview(id)}>
                            <FaEye />
                          </Button>
                        </ButtonGroup> */}
                        <div className="relative flex justify-end items-center gap-2">
                          <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                              <Button isIconOnly radius="full" size="sm" variant="light">
                                <FaEllipsisV className="text-default-400" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              variant='faded'
                              aria-labelledby='Menu de opciones'
                              onAction={key => handleAction(customer, key)}>
                              <DropdownItem
                                key='ticket'
                                startContent={<FaTicketAlt className='text-primary-400' />}>Ver ticket</DropdownItem>
                              {/* <CopyToClipboard
                                text={`${projectURL}mi-ticket/${id}`}>
                                <DropdownItem
                                  key='copy'
                                  startContent={<FaCopy className='text-primary-400' />}>
                                  Copiar
                                </DropdownItem>
                              </CopyToClipboard> */}
                              {/* <DropdownItem
                                key='share'
                                startContent={<FaShareAlt className='text-success-400' />}>Compartir</DropdownItem> */}
                              <DropdownItem
                                key='link'
                                startContent={<FaLink className='text-success-400' />}>Ver link</DropdownItem>
                              <DropdownItem
                                key='delete'
                                startContent={<FaTrash className='text-danger-400' />}>Eliminar</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        )}

      {currentCustomer &&
        (<>
          <ModalDelete
            title='Borrar cliente'
            description={
              <>
                <p>Este cliente ya no aparecerá en la lista.</p>
                <p>¿Desea continuar?</p>
              </>
            }
            isOpen={Boolean(showModals.deleteClient)}
            onClose={() => !showSpinners.deleteClient && setShowModals({ deleteClient: false })}
            isLoading={Boolean(showSpinners.deleteClient)}
            onSubmit={handleDeleteLink} />

          <ModalShareLink
            customerId={currentCustomer.id}
            isOpen={!!showModals.shareLink}
            onClose={() => setShowModals({ shareLink: false })} />
        </>)

      }

      <ModalAddPurchase
        currentCustomer={currentCustomer}
        isOpen={!!showModals.addPurchase}
        spinners={showSpinners}
        onClose={() => !showSpinners.addPurchase && setShowModals({ addPurchase: false })}
        handleRemovePurchase={handleRemovePurchase}
        onSubmit={handleAddPurchase} />
    </>
  )
}