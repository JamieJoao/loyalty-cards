import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useClient } from '../hooks/useClient'
import { useEnviroment } from '../hooks/useEnviroment'
import { useUser } from '../context/UserContext'
import { CustomerDataForm } from '../components'

export const Preview = () => {
  const { id } = useParams()
  const { client, getClient } = useClient()
  const { enviroments, getEnviroments } = useEnviroment()
  const { loading } = useUser()

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

  else if (client && enviroments) {
    const { completeData, name: clientName } = client
    const { clientsInformation } = enviroments

    if (!completeData && enviroments) {
      return (
        <CustomerDataForm labelsMap={clientsInformation ?? []} />
      )
    }

    return (
      <section>
        <h1>{clientName}</h1>
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
  }
}
