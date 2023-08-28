import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from '../hooks/useClient'
import { useAuth } from '../hooks/useAuth'
import { useUser } from '../context/UserContext'
import { WhatsappShareButton } from 'react-share'
import { linkToCustomer } from '../domain/constants'

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
      <WhatsappShareButton url={linkToCustomer + customerId}>
        <span>Compartir al whattsap</span>
      </WhatsappShareButton>
      <hr />
      <table border={1}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Compras</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(({ name, dni, stage, id }, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{name}</td>
              <td>{dni}</td>
              <td>
                {user && <button onClick={() => handleIncreasePurchase(stage, id)}>{stage}</button>}
                {!user && <span>{stage}</span>}
              </td>
              <td>
                <button onClick={() => handleGoToPreview(id)}>ticket</button>
              </td>
              {user && (
                <td>
                  <WhatsappShareButton url={linkToCustomer + id}>
                    <span>{linkToCustomer + id}</span>
                  </WhatsappShareButton>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
