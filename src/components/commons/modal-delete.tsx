import { FC, ReactNode } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import {
  FaBan,
  FaUserSlash,
} from "react-icons/fa"

interface ModalDeleteProps {
  title: ReactNode
  description: ReactNode

  isOpen: boolean
  isLoading: boolean
  onSubmit: () => void
  onClose: () => void
}

export const ModalDelete: FC<ModalDeleteProps> = ({
  title,
  description,

  isOpen,
  isLoading,
  onSubmit,
  onClose,
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        header: 'bg-danger-500 text-white',
        body: 'bg-danger-500 text-white',
        footer: 'bg-danger-500',
        closeButton: 'text-white hover:bg-transparent active:bg-transparent'
      }}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{description}</ModalBody>
        <ModalFooter>
          <Button
            className='bg-white'
            startContent={<FaBan />}
            // variant='bordered'
            color='default'
            disabled={isLoading}
            onClick={onClose}>Mejor no</Button>
          <Button
            className='bg-danger-600'
            startContent={<FaUserSlash />}
            isLoading={isLoading}
            // variant='bordered'
            color='primary'
            onClick={onSubmit}>Si, bórrelo</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}