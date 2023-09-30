import { FC, useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import {
  FaCalendar,
  FaCartPlus,
  FaCopy,
  FaEllipsisV,
  FaLink,
  FaShareAlt,
  FaShoppingCart,
  FaTrash,
  FaUser,
} from "react-icons/fa"
import { CustomerInterface } from "src/types/CustomerInterface"
import { useForm } from 'src/hooks/useForm'
import { ModalDelete, ModalUpdateCustomer, PurchaseProductDetail } from 'src/components'
import { ModalShareLink } from './ModalShareLink'
import moment from 'moment'
import { DATE_FORMAT_SPECIAL } from 'src/utils/constants'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { FaTag } from 'react-icons/fa6'
import { getProductDetail, getTotalByPurchase } from 'src/utils/functions'

interface TabPendingCustomersProps {
  clients: CustomerInterface[]
  loadingLinks: boolean
  deleteClient: (id: string) => Promise<void>
}

interface ShowModals {
  deleteClient?: boolean
  shareLink?: boolean
  updateCustomer?: boolean
}

interface ShowSpinners {
  deleteClient?: boolean
}

export const TabPendingCustomers: FC<TabPendingCustomersProps> = ({
  clients,
  loadingLinks,
  deleteClient,
}) => {
  const navigate = useNavigate()
  const { form, handleChange } = useForm({ search: '' })
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInterface | null>(null)
  const [showModals, setShowModals] = useState<ShowModals>({
    deleteClient: false,
    shareLink: false,
    updateCustomer: false,
  })
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    deleteClient: false,
  })

  const clientsFiltered = useMemo(() => {
    const pendingClients = clients.filter(obj => !obj.completeData)
    const query = ({ names, phone }: CustomerInterface) => JSON.stringify({
      names: names?.toLowerCase(),
      phone,
    })

    return form.search
      ? pendingClients.filter(obj => `${query(obj)}`.includes(form.search.toLowerCase()))
      : pendingClients
  }, [form.search, clients])

  const handleAction = (customer: CustomerInterface, key: React.Key) => {
    setCurrentCustomer(customer)

    switch (key) {
      case 'update-data':
        setShowModals({ updateCustomer: true })
        break
      case 'link':
        setShowModals({ shareLink: true })
        break
      case 'purchase':
        if (customer) {
          const { names, phone, id, purchasesBackup } = customer
          navigate('generate-link', { state: { names, phone, id, purchasesBackup } })
        }
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

  const handleClose = () => !showSpinners.deleteClient && setShowModals({ deleteClient: false })

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


  const getCardComponent = (customer: CustomerInterface) => {
    const { names, phone, purchases, purchasesBackup, id } = customer
    const [firstPurchase] = purchases
    const [firstPurchaseBackup] = purchasesBackup

    return (
      <Card
        className='pt-2'
        isPressable
        shadow='sm'>
        <CardHeader className="pt-2 px-4 flex-col items-start">
          <p
            className={
              classNames('text-tiny uppercase font-bold', !names && 'text-danger')
            }>{names ?? 'sin nombre'}</p>
          <small className="text-default-500">{firstPurchase ? '1° compra' : '00 compras'}</small>
          <h4
            className={
              classNames('font-bold text-large', !phone && 'text-danger')
            }>{phone ?? 'SIN CELULAR'}</h4>
        </CardHeader>
        <CardBody className='border-t-1 gap-2'>
          <div className="flex flex-col">
            {firstPurchase
              ? firstPurchase.products.map((product, index) => (
                <p key={index} className='text-sm flex-1'>{getProductDetail(product)}</p>
                // <PurchaseProductDetail purchaseProduct={product} key={index} />
              ))
              : firstPurchaseBackup && (
                <p className='text-sm flex-1'>{`${firstPurchaseBackup.product} - s/ ${firstPurchaseBackup.price}`}</p>
              )}
          </div>

          <Divider />
          <div className="flex justify-between">
            {firstPurchase
              ? <p className='text-xs'>{moment(firstPurchase.date).format(DATE_FORMAT_SPECIAL)}</p>
              : firstPurchaseBackup && <p className='text-xs flex-1'>{moment(firstPurchaseBackup.date).format(DATE_FORMAT_SPECIAL)}</p>}

            <p className='text-xs'>s/ {
              firstPurchase
                ? getTotalByPurchase(firstPurchase.products)
                : Number(firstPurchaseBackup?.price ?? 0).toFixed(2)
            }</p>
          </div>
        </CardBody>
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
          placeholder='Ejemplo: Minitorta de Batman, 25.5 o 2/04/23'
          type='text'
          value={form.search}
          onChange={e => handleChange(e, 'search')} />
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-default-400 text-small">Total {clientsFiltered.length} users</span>
      </div>

      <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
        {loadingLinks
          ? skeletonMemo
          : (
            clientsFiltered.map((obj, index) => {
              return (
                <Dropdown
                  key={obj.id + index}
                  className="bg-background border-1 border-default-200">
                  <DropdownTrigger>
                    {getCardComponent(obj)}
                  </DropdownTrigger>
                  <DropdownMenu
                    variant='faded'
                    aria-labelledby='Menu de opciones'
                    onAction={key => handleAction(obj, key)}>
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
              )
            })
          )}
      </div>

      {currentCustomer &&
        (<>
          <ModalDelete
            title='Borrar Link'
            description={
              <>
                <p>El cliente ya no podrá acceder a este link y deberá crearle uno nuevo.</p>
                <p>¿Desea continuar?</p>
              </>
            }
            isOpen={Boolean(showModals.deleteClient)}
            onClose={handleClose}
            isLoading={Boolean(showSpinners.deleteClient)}
            onSubmit={handleDeleteLink} />

          <ModalShareLink
            customerId={currentCustomer.id}
            isOpen={!!showModals.shareLink}
            onClose={() => setShowModals({ shareLink: false })} />

          <ModalUpdateCustomer
            customer={currentCustomer}
            isOpen={!!showModals.updateCustomer}
            onClose={() => setShowModals({ updateCustomer: false })} />
        </>)
      }
    </>
  )
}