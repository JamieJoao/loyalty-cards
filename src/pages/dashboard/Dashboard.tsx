import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
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
  Divider
} from "@nextui-org/react";

import { useClient } from 'hooks/useClient'
import { useAuth } from 'hooks/useAuth'
import { useUser } from 'context/UserContext'
import { WhatsappShareButton } from 'react-share'
import { projectURL } from 'domain/constants'

import WhatsappIcon from 'assets/icons/icons8-whatsapp.svg'
import { Modal } from 'src/components/modal/Modal';

export const Dashboard = () => {
  const navigate = useNavigate()

  const { clients, getClients, updateClient, addPossibleCustomer } = useClient()
  const { logout } = useAuth()
  const { user, loading } = useUser()
  const [customerId, setCustomerId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = getClients()

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGoToPreview = (id: string) => {
    navigate(`/mi-ticket/${id}`)
  }

  const handleIncreasePurchase = (stage: number, id: string) => {
    updateClient(id, { stage: stage + 1 })
  }

  const handleLogout = () => {
    logout()
  }

  const handleGenerateUserLink = async () => {
    const possibleCustommerId = await addPossibleCustomer()

    if (possibleCustommerId) setCustomerId(possibleCustommerId)
  }

  return (
    <div className='bc-dashboard'>
      {/* <h1>Bienvenido {user?.email}</h1>
      <hr />

      <button>Diseñar formulario de cliente</button>
      <button>Diseñar ticket</button>
      <button onClick={handleGenerateUserLink}>Generar link de usuario</button>
      <button onClick={handleLogout}>Salir</button>
      <hr /> */}

      <ButtonGroup>
        <Button color='primary' variant='bordered' onClick={handleGenerateUserLink}>Generar link de usuario</Button>
        <Button color='primary' variant='bordered' onClick={handleLogout}>Salir</Button>
      </ButtonGroup>

      <Divider className="my-4" />

      <Table
        aria-label="Tabla de usuarios">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>DNI</TableColumn>
          <TableColumn>Cumpleaños</TableColumn>
          <TableColumn>Ocupación</TableColumn>
          <TableColumn>Dirección</TableColumn>
          <TableColumn>Teléfono</TableColumn>
          <TableColumn>Sexo</TableColumn>
          <TableColumn>Compras</TableColumn>
          <TableColumn>Ver</TableColumn>
          <TableColumn>Compartir</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No hay usuarios que mostrar"}>
          {clients
            .filter(obj => obj.completeData)
            .map(({ names, dni, birthdayDate, occupation, address, phone, sex, stage, id }, index) => (
              <TableRow key={id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{names}</TableCell>
                <TableCell>{dni}</TableCell>
                <TableCell>{birthdayDate + ''}</TableCell>
                <TableCell>{occupation}</TableCell>
                <TableCell>{address}</TableCell>
                <TableCell>{phone}</TableCell>
                <TableCell>{sex}</TableCell>
                <TableCell>
                  {user && <Button
                    isIconOnly
                    color='primary'
                    variant='bordered'
                    onClick={() => handleIncreasePurchase(stage, id)}>{stage}</Button>}
                  {!user && <span>{stage}</span>}
                </TableCell>
                <TableCell>
                  <Button
                    color='primary'
                    variant='bordered'
                    onClick={() => handleGoToPreview(id)}>ticket</Button>
                </TableCell>
                <TableCell>
                  {user && (
                    <ButtonGroup>
                      {/* <Button isIconOnly aria-label='botón de whatsapp'>
                        <WhatsappShareButton url={`${projectURL}mi-ticket/${id}`}>
                          <img src={WhatsappIcon} alt='ícono de whatsapp' />
                        </WhatsappShareButton>
                      </Button> */}
                      <CopyToClipboard text={`${projectURL}mi-ticket/${id}`}>
                        <Button color='primary' variant='bordered'>Copiar</Button>
                      </CopyToClipboard>
                    </ButtonGroup>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {customerId && (
        <Modal
          onClose={() => setCustomerId(null)}
          onAccept={() => { }}>
          {/* <WhatsappShareButton url={`${projectURL}mi-ticket/${customerId}`}>
            <Button color='primary' variant='bordered'>Whatsapp</Button>
          </WhatsappShareButton> */}
          <CopyToClipboard text={`${projectURL}mi-ticket/${customerId}`}>
            <Button color='primary' variant='bordered'>Copiar</Button>
          </CopyToClipboard>
        </Modal>
      )}
    </div>
  )
}
