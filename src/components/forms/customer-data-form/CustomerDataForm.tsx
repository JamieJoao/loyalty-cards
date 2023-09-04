import { FC } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Input,
  Button,
  Spinner,
  Textarea,
} from "@nextui-org/react";

import { CustomerForm, CustomerInput } from 'types/CustomerInterface'
import { Forms } from 'types/EnviromentsInterface'
import { useForm } from 'hooks/useForm'

import CupcakeImage from 'assets/images/cupcake.png'
import { useUser } from 'src/context/UserContext';

const labelsObject: { [key: string]: CustomerInput } = {}
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
  onSubmit: (customer: CustomerForm) => void
  initialData: CustomerForm
  forms: Forms
}

export const CustomerDataForm: FC<CustomerDataFormProps> = ({
  onSubmit,
  initialData,
  forms,
}) => {
  const { registerUser: { customerData } } = forms
  const initialForm = customerData.reduce((acc, curr) => {
    acc[curr.key] = initialData[curr.key] ?? ''
    labelsObject[curr.key] = curr
    return acc
  }, { ...initialData } as CustomerForm)

  const { form, handleChange, handleSetValue } = useForm(initialForm)
  const { loading } = useUser()

  console.log(form)


  const verifiedValuesType = (input: CustomerInput) => {
    const { type, label, values, defaultValue, key, icon, ...rest } = input

    switch (type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <Input
            classNames={{
              ...classNames,
              input: [
                ...classNames.input,
                form[key] && '--success'
              ]
            }}
            type={type}
            spellCheck={false}
            value={form[key]}
            onChange={(e) => handleChange(e, key)}
            {...rest} />
        )

      case 'textarea':
        return (
          <Textarea
            classNames={classNames}
            type={type}
            spellCheck={false}
            value={form[key]}
            onChange={(e) => handleChange(e, key)}
            {...rest}
          />
        )

      case 'select':
        return values && (
          <select
            name="" id=""
            className='bc-form-group__input bg-transparent text-center'
            defaultValue={form[key]}
            onChange={(e) => handleChange(e, key)}>
            <option value="" disabled>Escoge una opción</option>
            {values.map(obj => (
              <option
                key={obj.value}
                className='text-center'>
                {obj.label}
              </option>
            ))}
          </select>
          // <Dropdown
          //   backdrop='blur'>
          //   <DropdownTrigger>
          //     <Button className='bc-form-group__input bg-transparent'>
          //       {labelsObject[key].values?.filter(obj => obj.value === form[key])[0]?.label || <span>Escoge una opción</span>}
          //     </Button>
          //   </DropdownTrigger>
          //   <DropdownMenu
          //     className='bc-form-group__select-menu'
          //     aria-label={label}
          //     items={values}
          //     variant='bordered'
          //     selectedKeys={form[key]}>
          //     {(item: any) => (
          //       <DropdownItem
          //         key={item.value}
          //         className='bc-form-group__select-menu-item'
          //         onClick={() => handleSetValue(key, item.value)}>
          //         {item.label}
          //       </DropdownItem>
          //     )}
          //   </DropdownMenu>
          // </Dropdown>
        )
    }
  }

  const isDisabled = (
    !customerData.every(obj => !obj.required ? true : Boolean(form[obj.key]))
  )

  const handleSubmit = () => {
    if (onSubmit && form) {
      onSubmit(form)
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
          {customerData.map(obj => (
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
            isLoading={loading}
            spinner={<Spinner />}>
            {forms.registerUser.buttonSubmit}
          </Button>
        </div>
      </div>
    </div>
  )
}