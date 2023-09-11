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
  FaLink,
  FaList,
  FaPhone,
  FaTable,
  FaTicketAlt,
  FaTrash
} from "react-icons/fa"
import {
  ModalDelete
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
  customerDetail?: boolean
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
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInterface | null>(null)
  const [showModals, setShowModals] = useState<ShowModals>({
    addPurchase: false,
    deleteClient: false,
    shareLink: false,
    customerDetail: false,
  })
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    addPurchase: false,
    deleteClient: false,
  })

  const clientsFiltered = useMemo(() => {
    console.log(clients)
    const registersClients = clients.filter(obj => obj.completeData)
    const query = ({ names, dni }: CustomerInterface) => JSON.stringify({
      names: names?.toLowerCase(),
      dni,
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

  const handleModalCustomerDetails = (customer: CustomerInterface) => {
    setCurrentCustomer(customer)
    setShowModals({ customerDetail: true })
  }

  return (
    <>
      <div className="flex gap-4">
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
            clientsFiltered.map((obj, index) => {
              const { names, dni, birthdayDate, phone, purchases, id } = obj
              const quantityPurchases = getQuantityPurchases(purchases)
              const quantity = quantityPurchases < 10 ? '0' + quantityPurchases : quantityPurchases
              const purchasesText = 'compra' + (quantityPurchases <= 1 ? '' : 's')
              const dateParsed = moment(birthdayDate).format('DD/MM/YYYY')

              return (
                <Card
                  key={id + index}
                  className='pt-2'
                  isPressable
                  onPress={() => handleModalCustomerDetails(obj)}
                  shadow='sm'>
                  <CardHeader className="pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">{cutNames(names)}</p>
                    <small className="text-default-500">{quantity} {purchasesText}</small>
                    <h4 className="font-bold text-large">{dni}</h4>
                  </CardHeader>
                  <CardFooter className='border-t-1 flex-col gap-2 items-start'>
                    <div className="flex items-center gap-4">
                      <FaCalendar className='text-default-400' />
                      <p className='text-sm'>{dateParsed}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaPhone className='text-default-400' />
                      <p className='text-sm'>{phone}</p>
                    </div>
                  </CardFooter>
                </Card>
              )
            })
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
            onClose={() => setShowModals({ customerDetail: false })}
            onAction={handleAction} />
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