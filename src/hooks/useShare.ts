import { useState } from 'react'

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async (data: { [key: string]: unknown }) => {
    try {
      if (window.navigator.canShare(data)) {
        setIsSharing(true)

        window.navigator.share(data)
      }

      setIsSharing(false)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    isSharing,
    handleShare,
  }
}