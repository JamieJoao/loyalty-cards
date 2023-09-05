import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import moment from 'moment'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Button,
  ButtonGroup,
  Divider,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Code,
  Snippet,
  Spacer
} from "@nextui-org/react";
import { FaTrash, FaLink, FaEye, FaClipboard } from 'react-icons/fa'
import { IoLogOut } from 'react-icons/io5'

import { useClient } from 'hooks/useClient'
import { useAuth } from 'hooks/useAuth'
import { useUser } from 'context/UserContext'
import { projectURL } from 'domain/constants'

import { useShare } from 'src/hooks/useShare';
import { CustomerInterface, CustomerPurchase } from 'src/types/CustomerInterface';
import { useForm } from 'src/hooks/useForm';
import { ModalGenerateLink } from './ModalGenerateLink';
import { ModalShareLink } from './ModalShareLink';
import { ButtonCopy } from 'src/components';
import { ModalAddPurchase } from './ModalAddPurchase';

interface ShowModals {
  generateLink?: boolean
  shareLink?: boolean
  addPurchase?: boolean
}

interface ShowSpinners {
  generateLink?: boolean
  addPurchase?: boolean
}

// interface CustomerDataForLink extends CustomerPurchase {
//   dni: string
// }

export const Dashboard = () => {
  const navigate = useNavigate()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isOpenPurchase, onOpen: onOpenPurchase, onOpenChange: onOpenChangePurchase } = useDisclosure()
  const { clients, getClients, updateClient, addPossibleCustomer } = useClient()
  const { logout } = useAuth()
  const { user, loading } = useUser()
  const { handleShare, isSharing } = useShare()

  const [customerId, setCustomerId] = useState<string | null>(null)
  const [spin, setSpin] = useState(false)
  const [spinAddPurchase, setSpinAddPurchase] = useState(false)
  const [spinRemovePurchase, setSpinRemovePurchase] = useState<{ status: boolean, data: number | null }>({ status: false, data: null })
  // const { form, handleChange, handleSetValue, resetForm } = useForm({ product: '', price: '' })
  const [showPurchasesList, setShowPurchasesList] = useState<boolean>(false)
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInterface | null>(null)

  const [showModals, setShowModals] = useState<ShowModals>({
    generateLink: false,
    shareLink: false,
    addPurchase: false,
  })
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    generateLink: false,
    addPurchase: false,
  })

  useEffect(() => {
    const unsubscribe = getClients()
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGoToPreview = (id: string) => {
    navigate(`/mi-ticket/${id}`)
  }

  const handleModalPurchase = (customer: CustomerInterface) => {
    // updateClient(id, { stage: stage + 1 })
    setShowPurchasesList(false)
    setCurrentCustomer(customer)
    setShowModals({ addPurchase: true })
  }

  const handleAddPurchase = async (form: { product: string, price: string }) => {
    if (currentCustomer) {
      setShowSpinners({ addPurchase: true })
      await updateClient(
        currentCustomer.id,
        {
          purchases: [
            ...currentCustomer.purchases,
            {
              product: form.product,
              price: form.price,
              date: moment().format('DD/MM/yyyy')
            }
          ]
        })

      setShowSpinners({ addPurchase: false })
      setCurrentCustomer(null)
      // resetForm()
      // onOpenPurchase()
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleGenerateUserLink = async (data: CustomerPurchase) => {
    setShowSpinners({ generateLink: true })

    const possibleCustommerId = await addPossibleCustomer({
      // dni: data.dni,
      purchases: [{
        product: data.product,
        price: data.price,
        date: moment().format('DD/MM/yyyy')
      }]
    })
    if (possibleCustommerId) setCustomerId(possibleCustommerId)

    setShowModals({ generateLink: false, shareLink: true })
    setShowSpinners({ generateLink: false })
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

  return (
    <div className='bc-dashboard'>
      <ButtonGroup>
        <Button
          isLoading={spin}
          spinner={<Spinner size='sm' />}
          color='primary'
          variant='bordered'
          onClick={() => {
            setCustomerId(null)
            setShowModals({ generateLink: true })
          }}
          startContent={<FaLink />}>Generar link de usuario</Button>
        <Button
          color='primary'
          variant='bordered'
          startContent={<IoLogOut className='bc-normal-icon' />}
          onClick={handleLogout}>Salir</Button>
      </ButtonGroup>

      <Divider className="my-4" />

      <Table
        aria-label="Tabla de usuarios">
        <TableHeader>
          <TableColumn>#</TableColumn>
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
          {clients
            .filter(obj => obj.completeData)
            .map((customer, index) => {
              const { names, dni, birthdayDate, occupation, address, phone, sex, stage, id } = customer
              return (
                <TableRow key={id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{names}</TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      color='primary'
                      variant='bordered'
                      onClick={() => handleModalPurchase(customer)}>{stage}</Button>
                  </TableCell>
                  <TableCell>{dni}</TableCell>
                  <TableCell>{birthdayDate + ''}</TableCell>
                  <TableCell>{occupation}</TableCell>
                  <TableCell>{address}</TableCell>
                  <TableCell>{phone}</TableCell>
                  <TableCell>{sex}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <ButtonCopy
                        url={`${projectURL}mi-ticket/${id}`} />
                      <Button
                        color='primary'
                        variant='bordered'
                        isIconOnly
                        onClick={() => handleGoToPreview(id)}>
                        <FaEye />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

      <ModalAddPurchase
        currentCustomer={currentCustomer}
        isOpen={!!showModals.addPurchase}
        spinners={showSpinners}
        onClose={() => setShowModals({ addPurchase: false })}
        handleRemovePurchase={handleRemovePurchase}
        onSubmit={handleAddPurchase} />

      <ModalGenerateLink
        isOpen={!!showModals.generateLink}
        spinners={showSpinners}
        customerId={customerId}
        onClose={() => setShowModals({ generateLink: false })}
        onSubmit={handleGenerateUserLink} />

      <ModalShareLink
        isOpen={!!showModals.shareLink}
        onClose={() => setShowModals({ shareLink: false })}
        customerId={customerId} />
    </div>
  )
}
