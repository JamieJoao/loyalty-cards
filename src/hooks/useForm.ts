import { useState, ChangeEvent, ReactNode } from 'react'

export const useForm = <T>(initialForm: T) => {
  const [form, setForm] = useState<T>(initialForm)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: keyof T) => {
    setForm({ ...form, [key]: event.target.value })
  }

  const handleSetValue = (key: keyof T, value: ReactNode) => {
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