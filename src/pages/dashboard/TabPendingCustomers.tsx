import { FC, useMemo, useState } from 'react'
import {
  Button,
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
  FaCartPlus,
  FaCopy,
  FaEllipsisV,
  FaLink,
  FaShareAlt,
  FaTrash,
} from "react-icons/fa"
import { CustomerInterface } from "src/types/CustomerInterface"
import { useForm } from 'src/hooks/useForm'
import { ModalDelete } from 'src/components'
import { ModalShareLink } from './ModalShareLink'
import moment from 'moment'
import { DATE_FORMAT_SPECIAL } from 'src/domain/constants'
import { useNavigate } from 'react-router-dom'

interface TabPendingCustomersProps {
  clients: CustomerInterface[]
  loadingLinks: boolean
  deleteClient: (id: string) => Promise<void>
}

interface ShowModals {
  deleteClient?: boolean
  shareLink?: boolean
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
  })
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    deleteClient: false,
  })

  const clientsFiltered = useMemo(() => {
    const pendingClients = clients.filter(obj => !obj.completeData)
    const query = ({ names, phone }: CustomerInterface) => JSON.stringify({
      names,
      phone,
    })

    return form.search
      ? pendingClients.filter(obj => `${query(obj)}`.includes(form.search.toLowerCase()))
      : pendingClients
  }, [form.search, clients])

  const handleAction = (customer: CustomerInterface, key: React.Key) => {
    setCurrentCustomer(customer)

    switch (key) {
      case 'link':
        setShowModals({ shareLink: true })
        break
      case 'purchase':
        if (currentCustomer) {
          const { names, phone, id } = currentCustomer
          navigate('generate-link', { state: { names, phone, id } })
        }
        break
      case 'delete':
        setShowModals({ deleteClient: true })
        break
    }
  }

  const getTableRow = (value: CustomerInterface, index: number) => {
    const { purchases } = value
    const [firtPurchase] = purchases ?? []

    return (
      <TableRow key={index}>
        <TableCell>{value.names ?? 'NO GUARDADO'}</TableCell>
        <TableCell>{value.phone ?? 'NO GUARDADO'}</TableCell>
        <TableCell>
          {firtPurchase
            ? moment(firtPurchase.date).format(DATE_FORMAT_SPECIAL)
            : 'NO GUARDADO'}
        </TableCell>
        <TableCell className='text-right'>
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
                onAction={key => handleAction(value, key)}>
                <DropdownItem
                  key='link'
                  startContent={<FaLink className='text-success-400' />}>Ver link</DropdownItem>
                <DropdownItem
                  key='purchase'
                  startContent={<FaCartPlus className='text-primary-400' />}>Agregar compra</DropdownItem>
                <DropdownItem
                  key='delete'
                  startContent={<FaTrash className='text-danger-400' />}>Eliminar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </TableCell>
      </TableRow>
    )
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
    <Skeleton className='rounded-lg mt-4 bg-default-100'>
      <div className="h-[40px]"></div>
    </Skeleton>
  ), [])

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
          onChange={e => handleChange(e, 'search')}
          description='Busca por el nombre de la primera compra, precio o fecha' />
      </div>

      {loadingLinks
        ? skeletonMemo
        : (
          <Table
            removeWrapper
            aria-label='Tabla de links pendientes'
            className='mt-4 overflow-x-auto pb-4'>
            <TableHeader>
              <TableColumn>NOMBRES</TableColumn>
              <TableColumn>CELULAR</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn className='text-right'>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No hay links que mostrar"}>
              {clientsFiltered.map(getTableRow)}
            </TableBody>
          </Table>
        )}

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
        </>)
      }
    </>
  )
}