import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useClient } from '../hooks/useClient'
import { useAuth } from '../hooks/useAuth'
import { useUser } from '../context/UserContext'
import { WhatsappShareButton } from 'react-share'
import { projectURL } from '../domain/constants'
import { Modal } from '../components/modal/Modal'

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
    navigate(`/preview/${id}`)
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
    <>
      <h1>Bienvenido {user?.email}</h1>
      <hr />

      <button>Diseñar formulario de cliente</button>
      <button>Diseñar ticket</button>
      <button onClick={handleGenerateUserLink}>Generar link de usuario</button>
      <button onClick={handleLogout}>Salir</button>
      <hr />
      <table border={1}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Cumpleaños</th>
            <th>Ocupación</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Sexo</th>
            <th>Compras</th>
          </tr>
        </thead>
        <tbody>
          {clients
            .filter(obj => obj.completeData)
            .map(({ names, dni, birthdayDate, occupation, address, phone, sex, stage, id }, index) => (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{names}</td>
                <td>{dni}</td>
                <td>{birthdayDate + ''}</td>
                <td>{occupation}</td>
                <td>{address}</td>
                <td>{phone}</td>
                <td>{sex}</td>
                <td>
                  {user && <button onClick={() => handleIncreasePurchase(stage, id)}>{stage}</button>}
                  {!user && <span>{stage}</span>}
                </td>
                <td>
                  <button onClick={() => handleGoToPreview(id)}>ticket</button>
                </td>
                {user && (
                  <td>
                    <WhatsappShareButton url={`${projectURL}preview/${id}`}>
                      <span>Whattsap</span>
                    </WhatsappShareButton>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      {customerId && (
        <Modal
          onClose={() => setCustomerId(null)}
          onAccept={() => { }}>
          <WhatsappShareButton url={`${projectURL}preview/${customerId}`}>
            <span>Whattsapp</span>
          </WhatsappShareButton>
          <CopyToClipboard text={`${projectURL}preview/${customerId}`}>
            <button>
              Copiar link
            </button>
          </CopyToClipboard>
        </Modal>
      )}
    </>
  )
}
