import { useMemo, FC, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
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
  FaBriefcase,
  FaCalendar,
  FaCartPlus,
  FaEllipsisV,
  FaIdCard,
  FaLink,
  FaList,
  FaPhone,
  FaTable,
  FaTicketAlt,
  FaTrash,
  FaUser
} from "react-icons/fa"
import {
  ModalDelete, ModalUpdateCustomer
} from "src/components"
import { CustomerInterface, CustomerPurchase } from 'src/types/CustomerInterface'
import { useForm } from 'src/hooks/useForm'
import { useNavigate } from 'react-router-dom'
import { cutNames, getQuantityPurchases } from 'src/utils/functions'
import { ModalAddPurchase } from './ModalAddPurchase'
import moment from 'moment'
import { Enviroments } from 'src/types/EnviromentsInterface'
import { ModalShareLink } from './ModalShareLink'
import { ModalCustomerDetail } from './ModalCustomerDetail'
import { PurchaseInterface } from 'src/types/PurchaseInterface'
import { BiDetail } from 'react-icons/bi'

interface TabCurrentsCustomersProps {
  clients: CustomerInterface[]
  updateClient: any
  enviroments: Enviroments
  loadingClients: boolean
  deleteClient: (id: string) => Promise<void>
}

interface ShowModals {
  deleteClient?: boolean
  shareLink?: boolean
  customerDetail?: boolean
  updateCustomer?: boolean
}

interface ShowSpinners {
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
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInterface | null>(null)
  const [showModals, setShowModals] = useState<ShowModals>({
    deleteClient: false,
    shareLink: false,
    customerDetail: false,
    updateCustomer: false,
  })
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    deleteClient: false,
  })

  const clientsFiltered = useMemo(() => {
    const registersClients = clients.filter(obj => obj.completeData)
    const query = ({ names, dni, phone }: CustomerInterface) => JSON.stringify({
      names: names?.toLowerCase(),
      dni,
      phone,
    })

    return form.search
      ? registersClients.filter(obj => `${query(obj)}`.includes(form.search.toLowerCase()))
      : registersClients
  }, [form.search, clients])

  const handleGoToPreview = (id: string) => {
    navigate(`/mi-ticket/${id}`)
  }

  const handleRemovePurchase = async (purchases: PurchaseInterface[]) => {
    if (currentCustomer) {
      await updateClient(
        currentCustomer.id,
        { purchases }
      )
      setCurrentCustomer({ ...currentCustomer, purchases })
    }
  }

  const skeletonMemo = useMemo(() => (
    <>
      <Skeleton className='rounded-large bg-default-100'>
        <div className="h-[164.19px]"></div>
      </Skeleton>
      <Skeleton className='rounded-large bg-default-100'>
        <div className="h-[164.19px]"></div>
      </Skeleton>
    </>
  ), [])

  const handleAction = (customer: CustomerInterface, key: React.Key) => {
    setCurrentCustomer(customer)

    switch (key) {
      case 'ticket':
        handleGoToPreview(customer.id)
        break
      case 'purchase':
        if (currentCustomer) {
          const { names, phone, id } = currentCustomer
          navigate('generate-link', { state: { names, phone, id } })
        }
        break
      case 'link':
        setShowModals({ shareLink: true })
        break
      case 'delete':
        setShowModals({ deleteClient: true })
        break
      case 'user-details':
        setShowModals({ customerDetail: true })
        break
      case 'update-data':
        setShowModals({ updateCustomer: true })
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

  const getCardComponent = (customer: CustomerInterface, index: number) => {
    const { names, dni, birthdayDate, phone, purchases, id } = customer
    const quantityPurchases = getQuantityPurchases(purchases)
    const quantity = quantityPurchases < 10 ? '0' + quantityPurchases : quantityPurchases
    const purchasesText = 'compra' + (quantityPurchases <= 1 ? '' : 's')
    const dateParsed = moment(birthdayDate).format('DD/MM/YYYY')

    return (
      <Card
        key={id + index}
        className='pt-2'
        isPressable
        shadow='sm'>
        <CardHeader className="pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{cutNames(names)}</p>
          <small className="text-default-500">{quantity} {purchasesText}</small>
          <h4 className="font-bold text-large">{phone}</h4>
        </CardHeader>
        <CardFooter className='border-t-1 flex-col gap-2 items-start'>
          <div className="flex items-center gap-4">
            <FaIdCard className='text-default-400' />
            <p className='text-sm'>{dni}</p>
          </div>
          <div className="flex items-center gap-4">
            <FaCalendar className='text-default-400' />
            <p className='text-sm'>{dateParsed}</p>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      <div className="grid sm:grid-cols-2">
        <Input
          spellCheck={false}
          classNames={{ inputWrapper: 'shadow-none' }}
          label='Buscar'
          placeholder='Ejemplo: Pepito o 76543210'
          type='text'
          value={form.search}
          onChange={e => handleChange(e, 'search')}
          isClearable
          onClear={() => handleSetValue('search', '')} />
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-default-400 text-small">Total {clientsFiltered.length} users</span>
      </div>

      <div className="grid mt-4 grid-cols-2 sm:grid-cols-4 gap-4">
        {loadingClients
          ? skeletonMemo
          : (
            clientsFiltered.map((obj, index) => (
              <Dropdown
                key={obj.id + index}
                className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  {getCardComponent(obj, index)}
                </DropdownTrigger>
                <DropdownMenu
                  variant='faded'
                  aria-labelledby='Menu de opciones'
                  onAction={key => handleAction(obj, key)}>
                  <DropdownItem
                    key='user-details'
                    startContent={<BiDetail className='text-secondary-400' />}>Detalles</DropdownItem>
                  <DropdownItem
                    key='update-data'
                    startContent={<FaUser className='text-warning-400' />}>Actualizar Datos</DropdownItem>
                  <DropdownItem
                    key='link'
                    startContent={<FaLink className='text-success-400' />}>Ver Link</DropdownItem>
                  <DropdownItem
                    key='purchase'
                    startContent={<FaCartPlus className='text-primary-400' />}>Gestionar Compras</DropdownItem>
                  <DropdownItem
                    key='delete'
                    startContent={<FaTrash className='text-danger-400' />}>Eliminar</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ))
          )}
      </div>

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

          <ModalCustomerDetail
            currentCustomer={currentCustomer}
            isOpen={!!showModals.customerDetail}
            onClose={() => setShowModals({ customerDetail: false })} />

          <ModalUpdateCustomer
            customer={currentCustomer}
            isOpen={!!showModals.updateCustomer}
            onClose={() => setShowModals({ updateCustomer: false })} />
        </>)

      }
    </>
  )
}