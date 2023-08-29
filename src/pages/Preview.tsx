import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useClient } from '../hooks/useClient'
import { useEnviroment } from '../hooks/useEnviroment'
import { useUser } from '../context/UserContext'
import { CustomerDataForm } from '../components'
import { CustomerForm } from '../types/CustomerInterface'

export const Preview = () => {
  const { id } = useParams()
  const { client, getClient, updateClient } = useClient()
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

  const handleSubmit = (customer: CustomerForm) => {
    if (id) {
      updateClient(id, { ...customer, completeData: true, stage: 0 })
    }
  }

  if (loading) {
    return <h1>Cargando tu ticket...</h1>
  }

  else if (client && enviroments) {
    const { completeData, names: clientName } = client
    const { clientsInformation } = enviroments

    if (!completeData && enviroments) {
      return (
        <CustomerDataForm labelsMap={clientsInformation ?? []} onSubmit={handleSubmit} />
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
  else {
    return <h1>No se encontró información</h1>
  }
}
