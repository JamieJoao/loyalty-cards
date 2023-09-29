import { FC, ReactNode } from 'react'
import { Button } from '@nextui-org/react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

interface PageTitleProps {
  children?: ReactNode
}

export const PageTitle: FC<PageTitleProps> = ({ children }) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-start mb-4 gap-2">
      <Button
        startContent={<IoIosArrowRoundBack className='text-3xl' />}
        size='sm'
        isIconOnly
        variant='light'
        onClick={() => {
          navigate('/')
        }} />

      <h3 className="text-lg font-bold">{children ?? 'Título de página'}</h3>
    </div>
  )
}