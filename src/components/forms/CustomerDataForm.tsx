import { FC } from 'react'
import { CustomerInput } from '../../types/EnviromentsInterface'

interface CustomerDataFormProps {
  labelsMap: CustomerInput[]
}

export const CustomerDataForm: FC<CustomerDataFormProps> = ({ labelsMap }) => {

  const verifiedValuesType = (input: CustomerInput) => {
    const { type, required, values, defaultValue } = input

    switch (type) {
      case 'text':
      case 'number':
        return <input type={type} required={required} />

      case 'date':
        return (
          <>
            <select>
              <option>1</option>
              <option>31</option>
            </select>
            <select>
              <option>Enero</option>
              <option>Febrero</option>
            </select>
            <select>
              <option>1990</option>
              <option>31</option>
            </select>
          </>
        )

      case 'select':
        return values && (
          <select defaultValue={defaultValue}>
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
      <button>¡Empecemos la aventura!</button>
    </>
  )
}