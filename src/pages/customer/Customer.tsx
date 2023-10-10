import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from "react-router-dom"

import { CustomerDataForm, Loading } from "src/components"
import { useUser } from 'src/context/UserContext'
import { useClient } from "src/hooks/useClient"
import { CustomerForm } from 'src/types/CustomerInterface'

export const Customer = () => {
  const { id } = useParams()
  const { client, getClient, updateClient, loading: loadingClient } = useClient()
  // const { loading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = getClient(id!)

    return () => {
      unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (customer: CustomerForm) => {
    if (id) {
      await updateClient(id, { ...customer, completeData: true })
      navigate(`/mi-ticket/${id}`)
    }
  }

  // if (loading || loadingClient) {
  if (loadingClient) {
    return <Loading />
  }

  if (client) {
    const { completeData } = client

    if (completeData) {
      return <Navigate to={`/mi-ticket/${id}`} />
    }

    return (
      <CustomerDataForm
        onSubmit={handleSubmit}
        initialData={client} />
    )
  }
}