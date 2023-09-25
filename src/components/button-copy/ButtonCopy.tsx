import { FC, useState, useEffect } from 'react'
import { Button } from '@nextui-org/react'
import CopyToClipboard from "react-copy-to-clipboard"
import { FaClipboard, FaCheck } from 'react-icons/fa'

interface ButtonCopyProps {
  url: string
  isLoading?: boolean
  isIconOnly?: boolean
}

export const ButtonCopy: FC<ButtonCopyProps> = ({ url, isIconOnly = true, isLoading }) => {
  const [copying, setCopying] = useState(false)

  const handleCopy = () => {
    setCopying(true)

    setTimeout(() => {
      setCopying(false)
    }, 1500)
  }

  return (
    <CopyToClipboard 
      text={url} 
      onCopy={handleCopy}>
      <Button
        isLoading={isLoading}
        isIconOnly={isIconOnly}
        variant='bordered'
        color='primary'
        startContent={!copying
          ? <FaClipboard />
          : <FaCheck />}>
        {!isIconOnly && 'Copiar'}
      </Button>
    </CopyToClipboard>
  )
}