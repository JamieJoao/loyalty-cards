import { FC, useEffect } from 'react'
import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  Spinner,
} from "@nextui-org/react"
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaClipboard, FaShare } from 'react-icons/fa'

import { projectURL } from 'src/domain/constants'
import { useShare } from 'src/hooks/useShare'
import { ButtonCopy } from 'src/components'

interface ModalShareLinkProps {
  isOpen: boolean
  onClose: () => void
  customerId: string | null
}

export const ModalShareLink: FC<ModalShareLinkProps> = ({ customerId, isOpen, onClose }) => {
  const { handleShare, isSharing } = useShare()

  const handleShareLink = () => {
    if (customerId) {
      const data = {
        title: 'Bocato',
        text: 'Link para tu ticket de Bocato',
        url: `${projectURL}mi-ticket/${customerId}`,
      }

      handleShare(data)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop='blur'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Link generado!</ModalHeader>
            <ModalBody>
              <ButtonGroup fullWidth>
                <ButtonCopy isIconOnly={false} url={`${projectURL}mi-ticket/${customerId}`} />
                <Button
                  color='primary'
                  variant='bordered'
                  spinner={<Spinner size='sm' />}
                  isLoading={isSharing}
                  onClick={() => handleShareLink()}
                  startContent={<FaShare />}
                >
                  Compartir
                </Button>
              </ButtonGroup>

              <p className='bc-personal-message mt-2 mb-2'>
                *Si el botoncito de <strong>compartir</strong> falla, usar el de <strong>copiar</strong> 🤫
              </p>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}