import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { useClient } from 'hooks/useClient'
import { useEnviroment } from 'hooks/useEnviroment'
import { useUser } from 'context/UserContext'
import { Loading, TicketFront } from 'components/index'
import { TicketBack } from 'components/customs/ticket-back/TicketBack'
import { TicketNotFound } from './TicketNotFound'
import { cutNames } from 'src/utils/functions'

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

  // console.log(client)

  if (loading || loadingClient) {
    return <Loading />
  }

  if (client && enviroments) {
    const { completeData, names, purchases } = client

    if (completeData) {
      const { cardBack } = enviroments

      return (
        <div className='bc-ticket'>
          <TicketFront
            customerName={cutNames(names)} />
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
