import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { Enviroments } from '../types/EnviromentsInterface'
import { useUser } from '../context/UserContext'

export const useEnviroment = () => {
  const { getSnapshot } = useFirebase()
  const { setLoading } = useUser()
  const [enviroments, setEnviroments] = useState<Enviroments>()

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
    getEnviroments
  }
}