import { Button, Card, CardBody, Checkbox, Divider, Input, Listbox, ListboxItem, Skeleton } from '@nextui-org/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BsCalendarDate, BsTextareaT } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { GoNumber } from 'react-icons/go'
import { RxOpenInNewWindow } from 'react-icons/rx'
import { MdKey, MdLabel } from 'react-icons/md'
import { TbSelect } from 'react-icons/tb'
import { TiSortAlphabetically } from 'react-icons/ti'
import { inputTypes } from 'src/app-globals'

import {
  PageTitle,
  Select
} from 'src/components'
import { SelectOption } from 'src/domain/select-types'
import { useCustomForm } from 'src/hooks/use-custom-form'
import { useEnviroment } from 'src/hooks/useEnviroment'
import { useForm } from 'src/hooks/useForm'
import { LuClipboardEdit, LuTrash } from 'react-icons/lu'
import { useFieldForm } from 'src/hooks/use-field-form'
import { ModalEditCustomForm } from './modal-edit-custom-form'
import { Unsubscribe } from 'firebase/auth'
import { FieldCollection } from 'src/domain/forms-types'

interface FormForms {
  formFields: SelectOption | null
  formField: FieldCollection | null
  formFieldsName: string
  formFieldName: string
}

interface OptionForm {
  key: string
  label: string
  index?: number
}

interface FieldForms {
  id?: string
  key: string
  label: string
  placeholder: string
  required: boolean | null
  type: SelectOption | null
  options: OptionForm[]
}

interface ShowModals {
  editCustomForm?: boolean
}

interface ShowSpinners {
  formFields?: boolean
  removeFormFields?: boolean
  formField?: boolean
  removeFormField?: boolean
}

export const CustomizeForms = () => {
  const { enviroments, getEnviroment, getEnviromentStatic, loadingEnviroment } = useEnviroment()
  const { addCustomForm, updateCustomForm, deleteCustomForm } = useCustomForm()
  const { addFieldForm, updateFieldForm, deleteFieldForm } = useFieldForm()
  const enviromentRef = useRef<Unsubscribe | undefined>()
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    formFields: false,
    removeFormFields: false,
    formField: false,
    removeFormField: false,
  })
  const [showModals, setShowModals] = useState<ShowModals>({
    editCustomForm: false,
  })
  const { form, handleSetValue } = useForm<FormForms>({
    formFields: null,
    formField: null,
    formFieldsName: '',
    formFieldName: ''
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
        required: null,
        type: null,
        options: []
      })
  const {
    form: formOption,
    handleChange: handleChangeOption,
    resetForm: resetFormOption,
    setForm: setFormOption,
  } = useForm<OptionForm>({
    key: '',
    label: '',
  })

  useEffect(() => {
    enviromentRef.current = getEnviroment(true)
    return () => {
      if (enviromentRef.current) enviromentRef.current()
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

  useEffect(() => {
    resetFormField()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formFields])

  const formsDataMemo = useMemo(() => {
    const result: SelectOption[] = (enviroments?.forms ?? [])
      .map(form => ({
        key: form.id,
        label: form.name,
        value: form.labels,
      }))

    if (form.formFields) {
      const formFieldsUpdated = result.find(obj => obj.key === form.formFields!.key)
      handleSetValue('formFields', formFieldsUpdated)
    }

    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enviroments])

  const isDisabledSaveField = (
    !formField.key ||
    !formField.label ||
    !formField.type ||
    (formField.type?.key === 'select' && formField.options.length === 0)
  )

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

  const handleCreateForm = async (name: string, formId?: string) => {
    if (name && enviroments.id) {
      setShowSpinners({ formFields: true })
      if (formId) {
        await updateCustomForm(enviroments.id, formId, { name })
      }
      else {
        await addCustomForm(enviroments.id, { name })
      }
      await getEnviromentStatic(true)
      setShowSpinners({ formFields: false })
    }
  }

  const handleDeleteForm = async (formId?: string) => {
    if (formId) {
      setShowSpinners({ removeFormFields: true })
      await deleteCustomForm(enviroments.id, formId)
      await getEnviromentStatic(true)
      setShowSpinners({ removeFormFields: false })
    }
  }

  const handleAddOptionList = () => {
    const { key, label } = formOption
    if (formOption.index === undefined) {
      if (key && formField.options.findIndex(obj => obj.key === key) === -1) {
        handleSetKeyValueField('options', [
          ...formField.options,
          { key, label: label || key }
        ])
      }
    }
    else {
      const newList = formField.options.map((obj, index) => index === formOption.index
        ? { key, label: label || key }
        : obj)
      handleSetKeyValueField('options', newList)
    }

    resetFormOption()
  }

  const handleLoadOptionList = (option: OptionForm) => {
    setFormOption({ ...option })
  }

  const handleRemoveOptionList = (key: string) => {
    handleSetKeyValueField('options', formField.options.filter(obj => obj.key !== key))
    resetFormOption()
  }

  const handleSaveField = async () => {
    if (form.formFields?.key) {
      setShowSpinners({ formField: true })

      if (formField.id) {
        await updateFieldForm(enviroments.id, form.formFields.key, formField.id, formField)
      }
      else {
        await addFieldForm(enviroments.id, form.formFields.key, formField)
      }

      await getEnviromentStatic(true)

      setShowSpinners({ formField: false })
      handleSetValue('formField', null)
      resetFormField()
    }
  }

  const handleRemoveField = async () => {
    if (form.formFields?.key && formField.id) {
      setShowSpinners({ removeFormField: true })

      await deleteFieldForm(enviroments.id, form.formFields.key, formField.id)
      await getEnviromentStatic(true)

      setShowSpinners({ removeFormField: false })
      handleSetValue('formField', null)
      resetFormField()
    }
  }

  return (
    <>
      <PageTitle>Personalizar Formularios</PageTitle>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="flex gap-4">
          <Select
            label='Formulario'
            value={form.formFields}
            options={formsDataMemo}
            placeholder='Selecciona uno de la lista'
            onChange={e => handleSetValue('formFields', e)} />

          <Button
            startContent={<RxOpenInNewWindow className='text-xl' />}
            isIconOnly
            color='primary'
            variant='flat'
            onClick={() => setShowModals({ editCustomForm: true })} />
        </div>

        {Boolean(form.formFields) && (
          <Select
            label='Cuadro de Texto'
            value={form.formField}
            options={form.formFields?.value}
            placeholder='Selecciona uno de la lista'
            onChange={e => handleSetValue('formField', e)}
            description={`Resultados: ${form.formFields?.value?.length}`} />
        )}
      </div>

      {(showSpinners.formField || showSpinners.removeFormField)
        ? <Skeleton className='h-[348px] sm:h-[236px] rounded-large' />
        : (
          form.formFields && (
            <Card>
              <CardBody className='p-4 gap-4'>
                <div className='grid sm:grid-cols-2 gap-4'>
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

                  <Checkbox
                    isSelected={formField.required ?? false}
                    onValueChange={e => handleSetKeyValueField('required', e)}>
                    Obligatorio
                  </Checkbox>

                  <Select
                    label='Tipo de Cuadro de Texto'
                    value={formField.type as SelectOption}
                    options={inputTypes as any}
                    placeholder='Selecciona uno de la lista'
                    startContent={<MdLabel className='text-default-400' />}
                    endContent={formField?.type && getIcon(formField.type)}
                    onChange={e => handleSetKeyValueField('type', e)} />
                </div>

                {formField.type?.key === 'select' && (
                  <>
                    <Divider />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-4">
                        <Input
                          classNames={{ inputWrapper: 'shadow-none' }}
                          startContent={<MdKey className='text-default-400' />}
                          label='Clave de la Opción'
                          placeholder='Ejemplo: direccion-de-casa o address-of-home'
                          value={formOption.key}
                          onChange={e => handleChangeOption(e, 'key')} />

                        <Input
                          classNames={{ inputWrapper: 'shadow-none' }}
                          startContent={<MdKey className='text-default-400' />}
                          label='Etiqueta de la Opción'
                          placeholder='Ejemplo: Primera opción'
                          value={formOption.label}
                          onChange={e => handleChangeOption(e, 'label')} />

                        <Button
                          startContent={<FaPlus />}
                          color='primary'
                          variant='flat'
                          isDisabled={!formOption.key}
                          onClick={handleAddOptionList}>
                          {formOption.index === undefined ? 'Agregar a la lista' : 'Actualizar opción'}
                        </Button>
                      </div>

                      <div className="border rounded-lg">
                        <Listbox variant="flat" aria-label="Listbox menu with descriptions">
                          {formField.options.map(({ key, label }, index) => (
                            <ListboxItem
                              key="new"
                              description={key}
                              startContent={
                                <Button
                                  size='sm'
                                  startContent={<LuClipboardEdit className='text-sm' />}
                                  isIconOnly
                                  color='warning'
                                  variant='flat'
                                  onClick={() => handleLoadOptionList({ key, label, index })} />
                              }
                              endContent={
                                <Button
                                  size='sm'
                                  startContent={<LuTrash className='text-sm' />}
                                  isIconOnly
                                  color='danger'
                                  variant='flat'
                                  onClick={() => handleRemoveOptionList(key)} />
                              }
                            >
                              {label}
                            </ListboxItem>
                          ))}
                        </Listbox>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          )
        )}

      {form.formFields && (
        <div className="flex mt-4 flex-col sm:flex-row gap-4">
          {!!formField?.id && (
            <Button
              className='w-full sm:w-auto sm:flex-1'
              color='danger'
              variant='solid'
              startContent={!showSpinners.removeFormField && <LuTrash className='text-sm' />}
              isLoading={showSpinners.removeFormField}
              isDisabled={showSpinners.formField}
              onClick={handleRemoveField}>
              Eliminar
            </Button>
          )}
          <Button
            className='w-full sm:w-auto sm:flex-1'
            color='primary'
            variant='solid'
            startContent={!showSpinners.formField && <FaPlus />}
            isLoading={showSpinners.formField}
            isDisabled={isDisabledSaveField || showSpinners.removeFormField}
            onClick={handleSaveField}>
            {formField.id ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      )}

      <ModalEditCustomForm
        isOpen={!!showModals.editCustomForm}
        onClose={() => setShowModals({ editCustomForm: false })}
        formsList={formsDataMemo}
        showSpinners={showSpinners}
        onSave={handleCreateForm}
        onDelete={handleDeleteForm} />
    </>
  )
}
