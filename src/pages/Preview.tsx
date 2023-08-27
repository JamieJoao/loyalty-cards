import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useClient } from '../hooks/useClient'
import { useEnviroment } from '../hooks/useEnviroment'
import { useUser } from '../context/UserContext'

export const Preview = () => {
  const { id } = useParams()
  const { client, getClient } = useClient()
  const { loading } = useUser()
  const { getEnviroments } = useEnviroment()

  useEffect(() => {
    const unsubscribe = getClient(id!)
    const unsubscribeEnv = getEnviroments()

    return () => {
      unsubscribe()
      unsubscribeEnv()
    }
  }, [])

  if (loading) {
    return <h1>Cargando tu ticket...</h1>
  }

  return client
    ? (
      <section>
        <h1>{client.name}</h1>
        <hr />
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>15%</button>
        <br />
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>100%</button>
      </section>
    )
    : <h1>No se encontró</h1>
}
