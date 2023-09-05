import { FC, useState, useEffect } from 'react'
import { Button } from '@nextui-org/react'
import CopyToClipboard from "react-copy-to-clipboard"
import { FaClipboard, FaCheck } from 'react-icons/fa'

interface ButtonCopyProps {
  url: string
  isIconOnly?: boolean
}

export const ButtonCopy: FC<ButtonCopyProps> = ({ url, isIconOnly = true }) => {
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
        isIconOnly={isIconOnly}
        color='primary'
        variant='bordered'
        startContent={!copying
          ? <FaClipboard />
          : <FaCheck />}>
        {!isIconOnly && 'Copiar'}
      </Button>
    </CopyToClipboard>
  )
}