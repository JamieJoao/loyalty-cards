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
  Input
} from "@nextui-org/react";

import { useClient } from 'hooks/useClient'
import { useAuth } from 'hooks/useAuth'
import { useUser } from 'context/UserContext'
import { WhatsappShareButton } from 'react-share'
import { projectURL } from 'domain/constants'
import { Modal } from 'components/modal/Modal'

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
    navigate(`/ticket/${id}`)
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

  if (loading) {
    return <h1>Cargando usuarios...</h1>
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
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Buscar por nombre..."
      // startContent={<SearchIcon />}
      // value={filterValue}
      // onClear={() => onClear()}
      // onValueChange={onSearchChange}
      />
      <br />
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
                  {user && <button onClick={() => handleIncreasePurchase(stage, id)}>{stage}</button>}
                  {!user && <span>{stage}</span>}
                </TableCell>
                <TableCell>
                  <button onClick={() => handleGoToPreview(id)}>ticket</button>
                </TableCell>
                <TableCell>
                  {user && (
                    <>
                      <WhatsappShareButton url={`${projectURL}ticket/${id}`}>
                        <span>Whattsap</span>
                      </WhatsappShareButton>
                      <CopyToClipboard text={`${projectURL}ticket/${id}`}>
                        <button>
                          Copiar link
                        </button>
                      </CopyToClipboard>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* {customerId && (
        <Modal
          onClose={() => setCustomerId(null)}
          onAccept={() => { }}>
          <WhatsappShareButton url={`${projectURL}ticket/${customerId}`}>
            <span>Whattsapp</span>
          </WhatsappShareButton>
          <CopyToClipboard text={`${projectURL}ticket/${customerId}`}>
            <button>
              Copiar link
            </button>
          </CopyToClipboard>
        </Modal>
      )} */}
    </div>
  )
}
