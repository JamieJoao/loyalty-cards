import { } from 'react'

const months = [
  { key: 'Ene', label: 'Ene' },
  { key: 'Feb', label: 'Feb' },
  { key: 'Mar', label: 'Mar' },
  { key: 'Abr', label: 'Abr' },
  { key: 'May', label: 'May' },
  { key: 'Jun', label: 'Jun' },
  { key: 'Jul', label: 'Jul' },
  { key: 'Ago', label: 'Ago' },
  { key: 'Set', label: 'Set' },
  { key: 'Oct', label: 'Oct' },
  { key: 'Nov', label: 'Nov' },
  { key: 'Dic', label: 'Dic' }
]

export const DatePicker = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <select
        id=""
        name=""
        className='bc-form-group__input bg-transparent text-center'
        // defaultValue={form[inputKey]}
        onChange={(e) => { }}>
        <option value=''>Día</option>
        {months.map(obj => (
          <option
            key={obj.key}
            className='text-center'>
            {obj.label ?? obj.key}
          </option>
        ))}
      </select>
      <select
        id=""
        name=""
        className='bc-form-group__input bg-transparent text-center'
        // defaultValue={form[inputKey]}
        onChange={(e) => { }}>
        <option value=''>Mes</option>
        {months.map(obj => (
          <option
            key={obj.key}
            className='text-center'>
            {obj.label ?? obj.key}
          </option>
        ))}
      </select>
      <select
        id=""
        name=""
        className='bc-form-group__input bg-transparent text-center'
        // defaultValue={form[inputKey]}
        onChange={(e) => { }}>
        <option value=''>Año</option>
        {months.map(obj => (
          <option
            key={obj.key}
            className='text-center'>
            {obj.label ?? obj.key}
          </option>
        ))}
      </select>
    </div>
  )
}
