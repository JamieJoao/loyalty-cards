import { useState } from 'react'
import { Button } from "@nextui-org/react"
import { FaLink } from "react-icons/fa"
import { ModalGenerateLink } from 'src/pages/dashboard/ModalGenerateLink'
import { ModalShareLink } from 'src/pages/dashboard/ModalShareLink'
import { useClient } from 'src/hooks/useClient'
import { CustomerPurchase } from 'src/types/CustomerInterface'
import moment from 'moment'

interface ShowModals {
  generateLink?: boolean
  shareLink?: boolean
}

interface ShowSpinners {
  generateLink?: boolean
}

export const ButtonGenerateLink = () => {
  const { addPossibleCustomer } = useClient()

  const [customerId, setCustomerId] = useState<string | null>(null)
  const [showModals, setShowModals] = useState<ShowModals>({
    generateLink: false,
    shareLink: false,
  })
  const [showSpinners, setShowSpinners] = useState<ShowSpinners>({
    generateLink: false,
  })

  const handleGenerateUserLink = async (data: CustomerPurchase) => {
    setShowSpinners({ generateLink: true })

    const possibleCustommerId = await addPossibleCustomer({
      purchases: [{
        product: data.product,
        price: data.price,
        date: moment().format('DD/MM/yyyy')
      }]
    })
    if (possibleCustommerId) setCustomerId(possibleCustommerId)

    setShowModals({ generateLink: false, shareLink: true })
    setShowSpinners({ generateLink: false })
  }

  return (
    <>
      <Button
        className='fixed bottom-4 right-[50%] translate-x-[50%]'
        size='lg'
        isIconOnly
        variant="shadow"
        color="primary"
        onClick={() => {
          setCustomerId(null)
          setShowModals({ generateLink: true })
        }}>
        <FaLink />
      </Button>

      <ModalGenerateLink
        isOpen={!!showModals.generateLink}
        spinners={showSpinners}
        customerId={customerId}
        onClose={() => setShowModals({ generateLink: false })}
        onSubmit={handleGenerateUserLink} />

      <ModalShareLink
        isOpen={!!showModals.shareLink}
        onClose={() => setShowModals({ shareLink: false })}
        customerId={customerId} />
    </>
  )
}
