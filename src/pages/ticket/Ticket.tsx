import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useClient } from 'hooks/useClient'
import { useEnviroment } from 'hooks/useEnviroment'
import { useUser } from 'context/UserContext'
import { CustomerDataForm, TicketFront } from 'components/index'
import { TicketBack } from 'components/customs/ticket-back/TicketBack'
import { CustomerForm } from 'types/CustomerInterface'

export const Ticket = () => {
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
      updateClient(id, { ...customer, completeData: true, stage: 1 })
    }
  }

  if (loading) {
    return <h1>Cargando tu ticket...</h1>
  }

  else if (client && enviroments) {
    const { completeData, names, stage } = client
    const { clientsInformation, cardBack } = enviroments

    if (!completeData && enviroments) {
      return (
        <CustomerDataForm
          labelsMap={clientsInformation ?? []}
          onSubmit={handleSubmit} />
      )
    }
    else {
      const [firstName = 'Tú', , thirdName = ''] = names.split(' ')

      return (
        <div className='bc-ticket'>
          <TicketFront
            customerName={`${firstName} ${thirdName}`} />
          <TicketBack
            cardBackData={cardBack}
            stage={stage} />
        </div>
      )
    }
  }
  else {
    return <h1>No se encontró información</h1>
  }
}
