import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useClient } from '../hooks/useClient'

export const Preview = () => {
  const { id } = useParams()
  const { loading, client, getClient } = useClient()

  useEffect(() => {
    const unsubscribe = getClient(id!)

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <h1>Cargando tu ticket...</h1>
  }

  return client
    ? (
      <section>
        <h1>{client.name}</h1>
      </section>
    )
    : <h1>No se encontró</h1>
}
