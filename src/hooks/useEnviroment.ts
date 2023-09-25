import { useState } from 'react'

import { Enviroments } from 'types/EnviromentsInterface'
import { useUser } from 'context/UserContext'
import { useFirebase } from "./useFirebase"

const TABLE_NAME = 'enviroments'

export const useEnviroment = () => {
  const { getSnapshot, addDocument, deleteDocument, updateDocument, getSnapshotByLabel, getReference } = useFirebase()
  const [enviroments, setEnviroments] = useState<Enviroments>({} as Enviroments)
  const [loading, setLoading] = useState(false)

  const getEnviroment = () => {
    try {
      setLoading(true)
      const unsub = getSnapshot<Enviroments>(TABLE_NAME, data => {
        const [env] = data

        setEnviroments(env)
        setLoading(false)
      })

      return unsub
    } catch (error) {
      console.log('error en getEnviroment ')
    }
  }

  const addEnviroment = async (data?: { [key: string]: any }) => {
    try {
      await addDocument(TABLE_NAME, data)
    } catch (error) {
      console.log('error en addEnviroment ')
    }
  }

  const updateEnviroment = async (id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument(TABLE_NAME, id, data)
    } catch (error) {
      console.log('error en updateEnviroment ')
    }
  }

  const deleteEnviroment = async (id: string) => {
    try {
      await deleteDocument(TABLE_NAME, id)
    } catch (error) {
      console.log('error en deleteEnviroment ')
    }
  }

  return {
    enviroments,
    loading,

    getEnviroment,
    addEnviroment,
    updateEnviroment,
    deleteEnviroment,
  }
}