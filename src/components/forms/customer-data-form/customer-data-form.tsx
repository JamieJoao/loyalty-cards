import { FC, useState, useEffect, useMemo } from 'react'
import {
  Input,
  Button,
  Textarea,
} from "@nextui-org/react";

import { CustomerForm } from 'types/CustomerInterface'
import { useForm } from 'hooks/useForm'
import { useEnviroment } from 'src/hooks/useEnviroment';
import { FieldCollection, FormCollection } from 'src/domain/forms-types';

import CupcakeImage from 'assets/images/cupcake.png'

const classNames = {
  innerWrapper: 'bg-transparent',
  input: [
    'bc-form-group__input',
  ],
  inputWrapper: [
    'bg-transparent',
    'group-data-[focus=true]:bg-transparent',
    'data-[hover=true]:bg-transparent',
    'p-0'
  ]
}

interface CustomerDataFormProps {
  onSubmit: (customer: CustomerForm) => Promise<void>
  initialData: CustomerForm
}

export const CustomerDataForm: FC<CustomerDataFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const { enviroments, getEnviroment, loadingEnviroment } = useEnviroment()
  const { form, handleChange, setForm } = useForm<CustomerForm>({} as CustomerForm)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    const unsub = getEnviroment(true)
    return () => {
      if (unsub) unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const customerDataForm = useMemo<FormCollection>(() => {
    const forms = enviroments?.forms ?? []
    return forms
      .find(obj => obj.id === import.meta.env.VITE_CUSTOMER_USER_FORM_ID) ?? {} as FormCollection
  }, [enviroments])

  useEffect(() => {
    const initialForm = customerDataForm?.labels?.reduce((acc, item) => {
      acc[item.key] = initialData[item.key] ?? ''
      return acc
    }, {} as CustomerForm) ?? {} as CustomerForm

    setForm(initialForm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerDataForm, initialData])

  const verifiedValuesType = (input: FieldCollection) => {
    const { type: { key: inputType }, label, options, key: inputKey, ...rest } = input

    switch (inputType) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <Input
            classNames={{
              ...classNames,
              input: [
                ...classNames.input,
                form[inputKey] && '--success'
              ]
            }}
            type={inputType}
            spellCheck={false}
            value={form[inputKey] ?? ''}
            onChange={(e) => handleChange(e, inputKey)}
            {...rest} />
        )

      // case 'date':
      //   return (
      //     <DatePicker />
      //   )

      case 'textarea':
        return (
          <Textarea
            classNames={classNames}
            type={inputType}
            spellCheck={false}
            value={form[inputKey] ?? ''}
            onChange={(e) => handleChange(e, inputKey)}
            {...rest}
          />
        )

      case 'select':
        return options && (
          <select
            id=""
            name=""
            className='bc-form-group__input bg-transparent text-center'
            defaultValue={form[inputKey]}
            onChange={(e) => handleChange(e, inputKey)}>
            <option value=''>Escoge una opción</option>
            {options.map(obj => (
              <option
                key={obj.key}
                className='text-center'>
                {obj.label ?? obj.key}
              </option>
            ))}
          </select>
        )
    }
  }

  const isDisabled = (
    !customerDataForm?.labels?.every(obj => !obj.required ? true : Boolean(form[obj.key]))
  )

  const handleSubmit = async () => {
    if (onSubmit && form) {
      setShowSpinner(true)
      await onSubmit(form)
      setShowSpinner(false)
    }
  }

  return (
    <div className='bc-customer'>
      <div className="bc-form">
        <div className="bc-form__header">
          <p className='bc-form__header-title'>¡Hola!</p>
          <p className='bc-form__header-title'>Bienvenid@ a la zona de clientes VIP de Bocato</p>

          <img className='bc-form__header-cupcake --left' src={CupcakeImage} alt="imagen de cupcake" />
          <img className='bc-form__header-cupcake --right' src={CupcakeImage} alt="imagen de cupcake" />
        </div>

        <div className="bc-form__body">

          {loadingEnviroment
            ? <p className='text-sm py-4'>Precargando tu información...</p>
            : (
              <>
                {customerDataForm?.labels?.map(obj => (
                  <div
                    key={obj.key}
                    className="bc-form-group">
                    <label
                      htmlFor=""
                      className="bc-form-group__label">
                      {obj.label}
                    </label>
                    {verifiedValuesType(obj)}
                  </div>
                ))}

                <Button
                  className='bc-form__button-submit w-full'
                  isDisabled={isDisabled}
                  onClick={handleSubmit}
                  isLoading={showSpinner}>
                  {customerDataForm?.submitText}
                </Button>
              </>
            )}
        </div>
      </div>
    </div>
  )
}