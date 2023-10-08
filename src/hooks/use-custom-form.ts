import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { ProductInterface, PurchaseInterface } from 'src/types/PurchaseInterface'
import { useFieldForm } from './use-field-form'

const TABLE_NAME = 'customForms'

export const useCustomForm = () => {
  const { getData, addDocument, deleteDocument, updateDocument, getSnapshotByLabel, getSnapshot } = useFirebase()
  const [customForms, setCustomForms] = useState<PurchaseInterface[]>([])
  const [customForm, setCustomForm] = useState<PurchaseInterface | null>()
  const { getFieldFormStatic } = useFieldForm()
  const [loadingCustomForms, setLoading] = useState(false)

  const getCustomForms = async (enviromentId?: string) => {
    try {
      if (enviromentId) {
        const data = await getData<any>(`enviroments/${enviromentId}/forms`)
        const formsList = await Promise.all(
          data.map(async form => {
            const labelsList = await getFieldFormStatic(enviromentId, form.id)

            return ({
              ...form,
              labels: labelsList,
            })
          })
        )

        return formsList
      }
      else {
        setLoading(true)
        const unsub = getSnapshot<PurchaseInterface>(TABLE_NAME, data => {
          setCustomForms(data)
          setLoading(false)
        })

        return unsub
      }

    } catch (error) {
      console.log('error en getCustomForms ')
    }
  }

  const getCustomForm = (id: string) => {
    const unsubscribe = getSnapshotByLabel<PurchaseInterface>(
      TABLE_NAME,
      { name: '__name__', value: id },
      data => {
        const [entryData] = data
        setCustomForm(entryData)
      })

    return unsubscribe
  }

  const addCustomForm = async (enviromentId: string, data?: { [key: string]: any }) => {
    try {
      await addDocument(`enviroments/${enviromentId}/forms`, data)
    } catch (error) {
      console.log('error en addCustomForm ')
    }
  }

  const updateCustomForm = async (enviromentId: string, id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument(`enviroments/${enviromentId}/forms`, id, data)
    } catch (error) {
      console.log('error en updateCustomForm ')
    }
  }

  const deleteCustomForm = async (enviromentId: string, id: string) => {
    try {
      await deleteDocument(`enviroments/${enviromentId}/forms`, id)
    } catch (error) {
      console.log('error en deleteCustomForm')
    }
  }

  return {
    customForms,
    customForm,
    loadingCustomForms,

    getCustomForms,
    getCustomForm,

    addCustomForm,
    updateCustomForm,
    deleteCustomForm,
  }
}