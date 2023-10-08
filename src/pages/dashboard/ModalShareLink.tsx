import { FC, useEffect, useMemo } from 'react'
import {
  Button,
  ButtonGroup,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react"
import { FaShare } from 'react-icons/fa'

import { projectURL } from 'src/utils/constants'
import { useShare } from 'src/hooks/useShare'
import { ButtonCopy } from 'src/components'

import SuccessImage from 'assets/images/arabica-1092.png'
import { useEnviroment } from 'src/hooks/useEnviroment'

interface ModalShareLinkProps {
  isOpen: boolean
  onClose: () => void
  customerId: string | null
}

export const ModalShareLink: FC<ModalShareLinkProps> = ({ customerId, isOpen, onClose }) => {
  const { handleShare, isSharing } = useShare()
  const { enviroments, getEnviroment, loadingEnviroment } = useEnviroment()

  useEffect(() => {
    const unsub = getEnviroment()
    return () => {
      if (unsub) unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const linkShareMessage = useMemo(() => (
    enviroments?.linkShareMessage?.join('\n') ?? ''
  ), [enviroments])

  const handleShareLink = () => {
    if (customerId && enviroments) {
      const data = {
        title: 'Bocato',
        text: linkShareMessage ?? '',
        url: `${projectURL}mi-ticket/${customerId}`,
        apps: ['com.whatsapp']
      }

      handleShare(data)
    }
  }

  const messageToCopy = useMemo(() => (
    `${linkShareMessage ?? ''}\n${projectURL}mi-ticket/${customerId}`
  ), [linkShareMessage, customerId])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop='blur'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Link generado</ModalHeader>
            <ModalBody>
              <div className="flex justify-center">
                <Image
                  width={200}
                  src={SuccessImage} />
              </div>

              <ButtonGroup
                className='mb-4'
                fullWidth>
                <ButtonCopy
                  isLoading={loadingEnviroment}
                  isIconOnly={false}
                  url={messageToCopy.trim()} />
                <Button
                  color='primary'
                  variant='bordered'
                  spinner={<Spinner size='sm' />}
                  isLoading={isSharing || loadingEnviroment}
                  onClick={() => handleShareLink()}
                  startContent={<FaShare />}
                >
                  Compartir
                </Button>
              </ButtonGroup>
            </ModalBody>
            {/* <ModalFooter></ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}