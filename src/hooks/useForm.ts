import { useState, ChangeEvent, ReactNode } from 'react'
import { GeneralObject } from 'src/domain/general-object'

export const useForm = <T>(initialForm: T) => {
  const [form, setForm] = useState<T>(initialForm)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: keyof T) => {
    setForm({ ...form, [key]: event.target.value })
  }

  const handleSetValue = (key: keyof T, value: ReactNode | GeneralObject) => {
    setForm({ ...form, [key]: value })
  }

  const resetForm = () => {
    setForm({ ...initialForm })
  }

  return {
    form,
    setForm,

    handleChange,
    handleSetValue,
    resetForm,
  }
}