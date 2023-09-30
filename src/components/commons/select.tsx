import { FC, ReactNode } from 'react'
import { SelectOption } from 'src/domain/select-types'


interface SelectProps {
  label?: string
  value: SelectOption | null
  options: SelectOption[]
  startContent?: ReactNode
  endContent?: ReactNode
  placeholder?: string
  name?: string
  id?: string
  onChange?: (e: any) => void
}

export const Select: FC<SelectProps> = ({
  label,
  value,
  options = [],
  startContent,
  endContent,
  placeholder,
  onChange,
  name,
  id,
}) => {
  return (
    <label
      className='w-full inline-flex px-3 bg-default-100 data-[hover=true]:bg-default-200 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 py-2 h-14'
      htmlFor={id}>
      <p
        className='block font-medium text-foreground-600 text-tiny cursor-text'
      >
        {label}
      </p>

      <div className='inline-flex w-full h-full items-center gap-1.5'>
        {startContent}

        <select
          className='w-full h-full font-normal bg-transparent outline-none placeholder:text-foreground-500 text-small'
          name={name}
          id={id}
          value={value?.key}
          onChange={e => {
            if (onChange) {
              const keyInput = e.target.value
              const option = options.find(obj => obj.key == keyInput)

              onChange(option)
            }
          }}
        >
          <option value=''>{placeholder}</option>
          {options.map(input => {
            const { key, label } = input

            return (
              <option
                key={key}
                value={key}
              >
                {label}
              </option>
            )
          })}
        </select>

        {endContent}
      </div>
    </label>
  )
}