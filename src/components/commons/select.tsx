import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import cn from 'classnames'

import { SelectOption } from 'src/domain/select-types'

interface SelectProps {
  className?: string
  classNames?: {
    select: string
  }
  label?: string
  value: SelectOption | null
  options: SelectOption[]
  startContent?: ReactNode
  endContent?: ReactNode
  placeholder?: string
  description?: ReactNode
  name?: string
  id?: string
  onChange?: (e: any) => void
}

export const Select: FC<SelectProps> = ({
  className,
  classNames,
  label,
  value,
  options = [],
  startContent,
  endContent,
  placeholder,
  description,
  onChange,
  name,
  id,
}) => {
  return (
    <div className={cn('flex flex-col w-full', className)}>
      <div
        className='w-full inline-flex px-3 bg-default-100 data-[hover=true]:bg-default-200 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 py-2 h-14'>
        <p
          className='block font-medium text-foreground-600 text-tiny cursor-text'
        >
          {label}
        </p>

        <div className='inline-flex w-full h-full items-center gap-1.5'>
          {startContent}

          <select
            className={cn('w-full h-full font-normal bg-transparent outline-none placeholder:text-foreground-500 text-small', classNames?.select)}
            name={name}
            id={id}
            value={value?.key ?? ''}
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
      </div>

      <div className='flex relative flex-col gap-1.5 pt-1 px-1'>
        <div className='text-tiny text-foreground-400'>{description}</div>
      </div>
    </div>

  )
}