import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { useCustomForm } from './use-custom-form'
import { EnviromentCollection } from 'src/domain/enviroments-types'

const TABLE_NAME = 'enviroments'

export const useEnviroment = () => {
  const { getSnapshot, addDocument, deleteDocument, updateDocument, getSnapshotByLabel, getReference, getData } = useFirebase()
  const { getCustomForms } = useCustomForm()
  const [enviroments, setEnviroments] = useState<EnviromentCollection>({} as EnviromentCollection)
  const [loadingEnviroment, setLoading] = useState(false)

  const getEnviroment = (withForms?: boolean) => {
    try {
      setLoading(true)
      const unsub = getSnapshot<EnviromentCollection>(TABLE_NAME, async data => {
        const [env] = data
        const newEnviroment = {
          ...env,
          forms: withForms
            ? await getCustomForms(env.id)
            : []
        }

        setEnviroments(newEnviroment as any)
        setLoading(false)
      })

      return unsub
    } catch (error) {
      console.log('error en getEnviroment ')
    }
  }

  const getEnviromentStatic = async (withForms?: boolean) => {
    try {
      const data = await getData<EnviromentCollection>(TABLE_NAME)

      if (data) {
        const [env] = data
        const newEnviroment = {
          ...env,
          forms: withForms
            ? await getCustomForms(env.id)
            : []
        }

        setEnviroments(newEnviroment as any)
      }
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
    loadingEnviroment,

    getEnviroment,
    getEnviromentStatic,
    addEnviroment,
    updateEnviroment,
    deleteEnviroment,
  }
}