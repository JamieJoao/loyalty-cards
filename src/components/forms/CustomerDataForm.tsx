import { FC } from 'react'
import { CustomerForm, CustomerInput } from '../../types/CustomerInterface'
import { useForm } from '../../hooks/useForm'

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
  console.log(form)

  const verifiedValuesType = (input: CustomerInput) => {
    const { type, values, defaultValue, key, ...rest } = input

    switch (type) {
      case 'text':
      case 'number':
      case 'date':
        return <input type={type} value={form[key]} onChange={(e) => handleChange(e, key)} {...rest} />

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
          <select defaultValue={form[key]} onChange={(e) => handleChange(e, key)}>
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
    <>
      <div>🎉</div>
      <h1>¡Cuéntanos más sobre ti!</h1>
      <p>Los descuentos se verán luego de haber completado estos datos</p>
      <hr />

      {
        labelsMap.map(obj => {
          const { key, label } = obj

          return (
            <div key={key}>
              <label>{label}</label>
              <br />
              {verifiedValuesType(obj)}
            </div>
          )
        })
      }

      <hr />
      <button
        disabled={isDisabled}
        onClick={handleSubmit}>¡Empecemos la aventura!</button>
    </>
  )
}