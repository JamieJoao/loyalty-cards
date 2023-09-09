import { useState, ChangeEvent, ReactNode } from 'react'

export const useForm = <T>(initialForm: T) => {
  const [form, setForm] = useState<T>(initialForm)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
    setForm({ ...form, [key]: event.target.value })
  }

  const handleSetValue = (key: string, value: ReactNode) => {
    setForm({ ...form, [key]: value })
  }

  const resetForm = () => {
    setForm({ ...initialForm })
  }

  return {
    form,
    handleChange,
    handleSetValue,
    resetForm,
  }
}