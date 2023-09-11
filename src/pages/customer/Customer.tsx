import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from "react-router-dom"

import { CustomerDataForm, Loading } from "src/components"
import { useUser } from 'src/context/UserContext'
import { useClient } from "src/hooks/useClient"
import { useEnviroment } from "src/hooks/useEnviroment"
import { CustomerForm } from 'src/types/CustomerInterface'

export const Customer = () => {
  const { id } = useParams()
  const { enviroments, getEnviroments } = useEnviroment()
  const { client, getClient, updateClient, loading: loadingClient } = useClient()
  const { loading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = getClient(id!)
    const unsubscribeEnv = getEnviroments()

    return () => {
      unsubscribe()
      unsubscribeEnv()
    }
  }, [])

  const handleSubmit = async (customer: CustomerForm) => {
    if (id) {
      await updateClient(id, { ...customer, completeData: true })
      navigate(`/mi-ticket/${id}`)
    }
  }

  if (loading || loadingClient) {
    return <Loading />
  }

  if (enviroments && client) {
    const { forms } = enviroments
    const { completeData } = client

    if (completeData) {
      return <Navigate to={`/mi-ticket/${id}`} />
    }
    else {
      return (
        <CustomerDataForm
          forms={forms}
          onSubmit={handleSubmit}
          initialData={client} />
      )
    }
  }
}