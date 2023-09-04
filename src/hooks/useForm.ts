import { useState, ChangeEvent } from 'react'

export const useForm = <T>(initialForm: T) => {
  const [form, setForm] = useState<T>(initialForm)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
    setForm({ ...form, [key]: event.target.value })
  }

  const handleSetValue = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  return {
    form,
    handleChange,
    handleSetValue,
  }
}