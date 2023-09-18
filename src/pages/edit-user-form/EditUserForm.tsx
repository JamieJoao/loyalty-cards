import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Divider, Input, Select, SelectItem, Switch } from '@nextui-org/react'
import {
  MdLabel,
  MdKey
} from 'react-icons/md'
import { GoNumber } from 'react-icons/go'
import { TiSortAlphabetically } from 'react-icons/ti'
import { BsTextareaT, BsCalendarDate } from 'react-icons/bs'
import { TbSelect } from 'react-icons/tb'

import { PageTitle } from 'src/components'
import { useEnviroment } from "src/hooks/useEnviroment"
import { inputTypes } from 'src/app-globals'
import { CustomerInput, InputTypes } from 'src/types/CustomerInterface'
import { useForm } from 'src/hooks/useForm'
import { FormTemplate, Forms } from 'src/types/EnviromentsInterface'

export const EditUserForm = () => {
  const { enviroments, loading: loadingEnviroments, getEnviroments } = useEnviroment()
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null)
  const [selectedField, setSelectedField] = useState<CustomerInput | null>(null)
  const { form, handleChange, resetForm } = useForm({
    formType: '',
    fieldType: ''
  })
  // const { form: formField, handleChange: handleChangeField, setForm: setFormField } = useForm({
  //   key: '',
  //   label: '',
  //   placeholder: '',
  //   required: '',
  //   type: '',
  // })

  useEffect(() => {
    const sub = getEnviroments()
    return () => sub()
  }, [])

  useEffect(() => {
    if (enviroments?.forms?.[form.formType]) {
      const inputsList = enviroments.forms[form.formType]
      setSelectedForm(inputsList)
    }
    else {
      setSelectedForm(null)
      setSelectedField(null)
    }
  }, [form.formType, enviroments])

  useEffect(() => {
    if (form.fieldType) {
      const field = selectedForm?.customerData?.find(obj => obj.key === form.fieldType)
      setSelectedField(field ?? null)
    }
    else {
      setSelectedField(null)
    }
  }, [form.fieldType])

  const handleChangeField = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, key: string) => {
    if (selectedField) {
      setSelectedField({ ...selectedField, [key]: e.target.value })
    }
  }

  const formsMemo = useMemo(() => {
    const result = []
    for (const key in enviroments?.forms) {
      const currForm = enviroments.forms[key]
      result.push({
        key,
        label: currForm.name,
        value: currForm,
      })
    }
    return result
  }, [enviroments])

  const getIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <TiSortAlphabetically className='text-2xl text-primary-500' />
      case 'number':
        return <GoNumber className='text-2xl text-primary-500' />
      case 'date':
        return <BsCalendarDate className='text-xl text-primary-500' />
      case 'textarea':
        return <BsTextareaT className='text-2xl text-primary-500' />
      case 'select':
        return <TbSelect className='text-2xl text-primary-500' />
    }
  }

  const getLabelForm = (
    <div className="flex flex-col gap-4">
      <Input
        classNames={{ inputWrapper: 'shadow-none' }}
        startContent={<MdKey className='text-default-400' />}
        label='Clave'
        placeholder='Ejemplo: my-key'
        value={selectedField?.key}
        onChange={e => handleChangeField(e, 'key')} />

      <Input
        classNames={{ inputWrapper: 'shadow-none' }}
        startContent={<MdLabel className='text-default-400' />}
        label='Texto'
        placeholder='Ejemplo: Cómo te llamas?'
        value={selectedField?.label}
        onChange={e => handleChangeField(e, 'label')} />

      <Input
        classNames={{ inputWrapper: 'shadow-none' }}
        startContent={<MdLabel className='text-default-400' />}
        label='Texto Provisional'
        placeholder='Ejemplo: Jhon Doe'
        value={selectedField?.placeholder}
        onChange={e => handleChangeField(e, 'placeholder')} />

      <div className="flex flex-row gap-4">
        <Select
          startContent={<MdLabel className='text-default-400' />}
          endContent={getIcon(String(selectedField?.type))}
          label="Tipo de entrada"
          placeholder="Selecciona un tipo"
          // value={selectedField?.type}
          selectedKeys={[selectedField?.type ?? '']}
          onChange={e => handleChangeField(e, 'type')}
        >
          {inputTypes.map(input => (
            <SelectItem
              key={input.key}
              value={input.key}>
              {input.label}
            </SelectItem>
          ))}
        </Select>

        <Switch
          size='sm'
          defaultSelected>
          Requerido
        </Switch>
      </div>
    </div>
  )

  const getLabelSelect = (
    <Select
      items={selectedForm?.customerData ?? []}
      label="Cuadro de texto"
      placeholder="Selecciona uno de la lista"
      value={form.fieldType}
      onChange={e => handleChange(e, 'fieldType')}
    >
      {({ key, label, placeholder }) => (
        <SelectItem
          key={key}
          value={key}
          description={placeholder ?? 'Escoge una opción'}>
          {label}
        </SelectItem>
      )}
    </Select>
  )

  return (
    <div className="bc-edit-user-form">
      <PageTitle>Formulario de cliente</PageTitle>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <Select
            items={formsMemo}
            label="Formulario"
            placeholder="Selecciona uno de la lista"
            value={form.formType}
            isLoading={loadingEnviroments}
            onChange={e => handleChange(e, 'formType')}
          >
            {({ key, label, value }) => (
              <SelectItem
                key={key}
                description={`Contiene ${value?.customerData.length} entradas`}
                value={key}>
                {label}
              </SelectItem>
            )}
          </Select>

          {Boolean(selectedForm) && getLabelSelect}

          {/* <pre>{JSON.stringify(selectedForm, null, 2)}</pre> */}
          {/* <pre>{JSON.stringify(selectedField, null, 2)}</pre> */}
        </div>

        {/* FORMULARIO DERECHA */}
        {Boolean(selectedField) && getLabelForm}
      </div>
    </div>
  )
}
