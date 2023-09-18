import { useState } from 'react'

import { Enviroments } from 'types/EnviromentsInterface'
import { useUser } from 'context/UserContext'
import { useFirebase } from "./useFirebase"

export const useEnviroment = () => {
  const { getSnapshot } = useFirebase()
  // const { setLoading } = useUser()
  const [loading, setLoading] = useState(false)
  const [enviroments, setEnviroments] = useState<Enviroments>({} as Enviroments)

  const getEnviroments = () => {
    setLoading(true)
    const unsubscribe = getSnapshot<Enviroments>(
      'enviroments',
      data => {
        const [env] = data

        setEnviroments(env)
        setLoading(false)
      })

    return unsubscribe
  }

  return {
    enviroments,
    loading,

    getEnviroments
  }
}