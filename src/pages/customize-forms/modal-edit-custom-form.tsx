import { FC, useEffect, } from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { LuPlus, LuTrash } from 'react-icons/lu'

import { SelectOption } from 'src/domain/select-types'
import { useForm } from 'src/hooks/useForm'
import { Select } from 'src/components'

interface ModalEditCustomFormProps {
  isOpen: boolean
  formsList: SelectOption[]
  showSpinners: ShowSpinners
  onClose: () => void
  onSave?: (name: string, id?: string) => Promise<void>
  onDelete?: (id?: string) => Promise<void>
}

interface FormForms {
  formFields: SelectOption | null
  formName: string
}

interface ShowSpinners {
  formFields?: boolean
  removeFormFields?: boolean
}

export const ModalEditCustomForm: FC<ModalEditCustomFormProps> = ({
  isOpen,
  formsList = [],
  showSpinners,
  onClose,
  onSave,
  onDelete
}) => {
  const { form, handleSetValue, handleChange, resetForm } = useForm<FormForms>({
    formFields: null,
    formName: ''
  })

  useEffect(() => {
    handleSetValue('formName', form.formFields?.label ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formFields])

  const handleCreateForm = async () => {
    if (onSave) {
      await onSave(form.formName, form.formFields?.key)
      resetForm()
    }
  }

  const handleDeleteForm = async () => {
    if (onDelete) {
      await onDelete(form.formFields?.key)
      resetForm()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Gestionar Formulario</ModalHeader>
        <ModalBody>
          <Select
            label='Formulario'
            value={form.formFields}
            options={formsList}
            placeholder='Selecciona uno de la lista'
            onChange={e => handleSetValue('formFields', e)} />

          <Input
            classNames={{ inputWrapper: 'shadow-none' }}
            label='Nombre'
            placeholder='Ejemplo: Registro de cliente'
            value={form.formName}
            onChange={e => handleChange(e, 'formName')}
            isDisabled={showSpinners.formFields || showSpinners.removeFormFields} />

          <Button
            startContent={!showSpinners.formFields && <LuPlus className='text-sm' />}
            color='primary'
            variant='flat'
            isLoading={showSpinners.formFields}
            onClick={handleCreateForm}
            isDisabled={!form.formName}>
            {form.formFields?.key ? 'Actualizar' : 'Guardar'}
          </Button>

          {form.formFields?.key && (
            <Button
              startContent={!showSpinners.removeFormFields && <LuTrash className='text-sm' />}
              color='danger'
              variant='flat'
              isLoading={showSpinners.removeFormFields}
              isDisabled={showSpinners.formFields}
              onClick={handleDeleteForm}>
              Eliminar
            </Button>
          )}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
