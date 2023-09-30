import { Card, CardBody, Input } from '@nextui-org/react'
import { useEffect, useMemo } from 'react'
import { BsCalendarDate, BsTextareaT } from 'react-icons/bs'
import { GoNumber } from 'react-icons/go'
import { MdKey, MdLabel } from 'react-icons/md'
import { TbSelect } from 'react-icons/tb'
import { TiSortAlphabetically } from 'react-icons/ti'
import { inputTypes } from 'src/app-globals'

import {
  PageTitle,
  Select
} from 'src/components'
import { GeneralObject } from 'src/domain/general-object'
import { SelectOption } from 'src/domain/select-types'
import { useEnviroment } from 'src/hooks/useEnviroment'
import { useForm } from 'src/hooks/useForm'
import { FieldInput } from 'src/types/CustomerInterface'

interface FormForms {
  formFields: SelectOption | null
  formField: FieldInput | null
}

interface FieldForms {
  key: string
  label: string
  placeholder: string
  type: SelectOption | null
}

export const CustomizeForms = () => {
  const { enviroments, getEnviroment, loading: loadingEnviroments } = useEnviroment()
  const { form, handleSetValue } = useForm<FormForms>({
    formFields: null,
    formField: null
  })
  const {
    form: formField,
    handleChange: handleChangeField,
    handleSetValue: handleSetKeyValueField,
    setForm: setFormField,
    resetForm: resetFormField } = useForm<FieldForms>(
      {
        key: '',
        label: '',
        placeholder: '',
        type: null
      })

  useEffect(() => {
    const unsub = getEnviroment()
    return () => {
      if (unsub) unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (form.formField) {
      setFormField({ ...form.formField } as FieldForms)
    }
    else {
      resetFormField()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formField])

  console.log(enviroments)

  const formsDataMemo = useMemo(() => {
    const result: SelectOption[] = []
    for (const key in enviroments?.forms) {
      const currForm = enviroments.forms[key]
      result.push({
        key,
        label: currForm.name,
        value: currForm?.fields
      })
    }
    return result
  }, [enviroments])

  const getIcon = (type: SelectOption) => {
    switch (type.key) {
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

  return (
    <>
      <PageTitle>Personalizar Formularios</PageTitle>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Select
          label='Formulario'
          value={form.formFields}
          options={formsDataMemo}
          placeholder='Selecciona uno de la lista'
          onChange={e => handleSetValue('formFields', e)} />

        {Boolean(form.formFields) && (
          <Select
            label='Cuadro de Texto'
            value={form.formField}
            options={form.formFields?.value}
            placeholder='Selecciona uno de la lista'
            onChange={e => handleSetValue('formField', e)} />
        )}
      </div>

      {!!formField && !!form.formField && (
        <Card>
          <CardBody className='grid sm:grid-cols-2 gap-4'>
            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              startContent={<MdKey className='text-default-400' />}
              label='Clave'
              placeholder='Ejemplo: my-key'
              value={formField.key}
              onChange={e => handleChangeField(e, 'key')} />

            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              startContent={<MdLabel className='text-default-400' />}
              label='Texto'
              placeholder='Ejemplo: Cómo te llamas?'
              value={formField.label}
              onChange={e => handleChangeField(e, 'label')} />

            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              startContent={<MdLabel className='text-default-400' />}
              label='Texto Provisional'
              placeholder='Ejemplo: Jhon Doe'
              value={formField.placeholder}
              onChange={e => handleChangeField(e, 'placeholder')} />

            <div className="flex">
              <Select
                label='Tipo de Cuadro de Texto'
                value={formField.type as SelectOption}
                options={inputTypes as any}
                placeholder='Selecciona uno de la lista'
                startContent={<MdLabel className='text-default-400' />}
                endContent={getIcon(form.formField.type)}
                onChange={e => handleSetKeyValueField('type', e)} />
            </div>
          </CardBody>
        </Card>
      )}

      <pre>{JSON.stringify(form?.formField, null, 2)}</pre>
    </>
  )
}
