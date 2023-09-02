import { FC } from 'react'
import { CustomerForm, CustomerInput } from 'types/CustomerInterface'
import { useForm } from 'hooks/useForm'

// const days = new Array(31).fill(0).map((_, i) => i + 1)
// const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']
// const years = new Array(10).fill(0).map((_, i) => i + 1990)

interface CustomerDataFormProps {
  labelsMap: CustomerInput[]
  onSubmit: (customer: CustomerForm) => void
}

export const CustomerDataForm: FC<CustomerDataFormProps> = ({ labelsMap, onSubmit }) => {
  const initialForm = labelsMap.reduce((acc, curr) => {
    acc[curr.key] = ''
    return acc
  }, {} as CustomerForm)

  const { form, handleChange } = useForm(initialForm)

  const verifiedValuesType = (input: CustomerInput) => {
    const { type, values, defaultValue, key, icon, ...rest } = input

    switch (type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <input
            className='bc-form-input__input'
            spellCheck={false}
            type={type}
            value={form[key]}
            onChange={(e) => handleChange(e, key)}
            {...rest} />
        )

      /*
    case 'date':
      return (
        <>
          <select>
            {days.map(obj => <option key={obj}>{obj}</option>)}
          </select>
          <select>
            {months.map(obj => <option key={obj}>{obj}</option>)}
          </select>
          <select>
            {years.map(obj => <option key={obj}>{obj}</option>)}
          </select>
        </>
      )
      */

      case 'select':
        return values && (
          <select
            className='bc-form-input__input'
            defaultValue={form[key]} onChange={(e) => handleChange(e, key)}>
            {values.map(({ label, value, props }, index) => (
              <option
                key={index}
                value={value}
                {...props}>
                {label}
              </option>
            ))}
          </select>
        )
    }
  }

  const isDisabled = (
    !labelsMap.every(obj => !obj.required ? true : Boolean(form[obj.key]))
  )

  const handleSubmit = () => {
    if (onSubmit && form) {
      onSubmit(form)
    }
  }

  return (
    <div className='bc-customer-form'>
      <div className="bc-form">
        <span className='bc-form__title'>Cuéntanos más sobre ti </span>
        <p className='bc-form__subtitle'>Los descuentos se verán luego de haber completado estos datos.</p>

        {
          labelsMap.map(obj => {
            const { key, label } = obj

            return (
              <div
                className='bc-form-input'
                key={key}>
                <label className='bc-form-input__label'>{label}</label>
                {verifiedValuesType(obj)}
              </div>
            )
          })
        }

        <button
          disabled={isDisabled}
          onClick={handleSubmit}>¡Empecemos la aventura!</button>
      </div>
    </div>
  )
}