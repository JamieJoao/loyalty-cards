import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from '../hooks/useClient'
import { useAuth } from '../hooks/useAuth'
import { useUser } from '../context/UserContext'

export const Dashboard = () => {
  const navigate = useNavigate()

  const { clients, loading, getClients, updateClient } = useClient()
  const { login, logout } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    const unsubscribe = getClients()

    return () => unsubscribe()
  }, [])

  const handleGoToPreview = (id: string) => {
    navigate(`/preview/${id}`)
  }

  const handleIncreasePurchase = (purchases: number, id: string) => {
    updateClient(id, { purchases: purchases + 1 })
  }

  const handleLogin = () => {
    login('jojham1994@gmail.com', 'LK27r^i7^y<l6d~&_}')
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return <h1>Cargando usuarios...</h1>
  }

  return (
    <>
      <code>{JSON.stringify(user, null, 2)}</code>
      <hr />
      {
        user
          ? <button onClick={handleLogout}>Salir</button>
          : <button onClick={handleLogin}>Ingresar</button>
      }

      <button>Agregar cliente</button>
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
          {clients.map(({ name, dni, purchases, id }, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{name}</td>
              <td>{dni}</td>
              <td>
                {user && <button onClick={() => handleIncreasePurchase(purchases, id)}>{purchases}</button>}
                {!user && <span>{purchases}</span>}
              </td>
              <td>
                <button onClick={() => handleGoToPreview(id)}>ticket</button>
              </td>
              {user && (
                <td>
                  <button>Editar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
