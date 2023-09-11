import { FC, useEffect } from 'react'
import {
  Button,
  ButtonGroup,
  Divider,
  Image,
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

import SuccessImage from 'assets/images/arabica-1092.png'

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
        apps: ['com.whatsapp']
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
                  isIconOnly={false}
                  url={`${projectURL}mi-ticket/${customerId}`} />
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
            </ModalBody>
            {/* <ModalFooter></ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}