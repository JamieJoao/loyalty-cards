import { useEffect, useState } from 'react'
import { useFirebase } from '../hooks/useFirebase'
import { ClientResponse } from '../types/ClientResponse'

export const Dashboard = () => {
  const { loading, getSnapshot} = useFirebase()
  const [clients, setClients] = useState<ClientResponse[]>([])

  useEffect(() => {
    const unsubscribe = getSnapshot<ClientResponse>(clients => setClients(clients))

    return () => unsubscribe()
  }, [])

  return loading
    ? <h1 style={{ textAlign: 'center' }}>Cargando...</h1>
    : (
      <table border={1}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Compras</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clients.map(({ name, dni, purchases, id }, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{name}</td>
              <td>{dni}</td>
              <td>{purchases}</td>
              <td>
                <button>ticket</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
}
