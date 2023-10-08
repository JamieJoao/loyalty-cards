import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { FieldCollection } from 'src/domain/forms-types'

const TABLE_NAME = 'fieldForms'

export const useFieldForm = () => {
  const { getSnapshot, addDocument, deleteDocument, updateDocument, getSnapshotByLabel, getData } = useFirebase()
  const [fieldForms, setFieldForms] = useState<FieldCollection[]>([])
  const [fieldForm, setFieldForm] = useState<FieldCollection | null>()
  const [loadingfieldForms, setLoading] = useState(false)

  const getFieldsForm = () => {
    try {
      setLoading(true)
      const unsub = getSnapshot<FieldCollection>(TABLE_NAME, data => {
        setFieldForms(data)
        setLoading(false)
      })

      return unsub
    } catch (error) {
      console.log('error en getFieldsForm ')
    }
  }

  const getFieldFormStatic = async (enviromentId: string, formId: string) => {
    try {
      return getData(`enviroments/${enviromentId}/forms/${formId}/labels`)
    } catch (error) {
      console.log('error en getFieldFormStatic', error)
    }
  }

  const getFieldForm = (id: string) => {
    const unsubscribe = getSnapshotByLabel<FieldCollection>(
      TABLE_NAME,
      { name: '__name__', value: id },
      data => {
        const [entryData] = data
        setFieldForm(entryData)
      })

    return unsubscribe
  }

  const addFieldForm = async (enviromentId: string, formId: string, data?: { [key: string]: any }) => {
    try {
      await addDocument(`enviroments/${enviromentId}/forms/${formId}/labels`, data)
    } catch (error) {
      console.log('error en addFieldForm ')
    }
  }

  const updateFieldForm = async (enviromentId: string, formId: string, id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument(`enviroments/${enviromentId}/forms/${formId}/labels`, id, data)
    } catch (error) {
      console.log('error en updateFieldForm ')
    }
  }

  const deleteFieldForm = async (enviromentId: string, formId: string, id: string) => {
    try {
      await deleteDocument(`enviroments/${enviromentId}/forms/${formId}/labels`, id)
    } catch (error) {
      console.log('error en deleteFieldForm ')
    }
  }

  return {
    fieldForms,
    fieldForm,
    loadingfieldForms,

    getFieldsForm,
    getFieldForm,
    getFieldFormStatic,

    addFieldForm,
    updateFieldForm,
    deleteFieldForm,
  }
}