import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { useClient } from 'hooks/useClient'
import { useEnviroment } from 'hooks/useEnviroment'
import { useUser } from 'context/UserContext'
import { CustomerDataForm, Loading, TicketFront } from 'components/index'
import { TicketBack } from 'components/customs/ticket-back/TicketBack'
import { CustomerForm } from 'types/CustomerInterface'
import { TicketNotFound } from './TicketNotFound'

export const Ticket = () => {
  const { id } = useParams()
  const { loading: loadingClient, client, getClient } = useClient()
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

  if (loading || loadingClient) {
    return <Loading />
  }

  if (client && enviroments) {
    const { completeData, names, purchases } = client

    if (completeData) {
      const { cardBack } = enviroments
      const [firstName = 'Tú', secondName, thirdName] = names.split(' ')

      return (
        <div className='bc-ticket'>
          <TicketFront
            customerName={`${firstName} ${thirdName ?? secondName}`} />
          <TicketBack
            cardBackData={cardBack}
            purchases={purchases} />
        </div>
      )
    }
    else {
      return <Navigate to={`/cliente/${id}`} />
    }
  }
  else {
    return <TicketNotFound message='Oops! Cliente no encontrado' />
  }
}
