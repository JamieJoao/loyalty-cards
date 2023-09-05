import { useState } from 'react'

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async (data: { [key: string]: unknown }) => {
    if (window.navigator.canShare(data)) {
      setIsSharing(true)

      try {
        window.navigator.share(data)
      } catch (error) {
        alert(error)
      }

      setIsSharing(false)
    }
  }

  return {
    isSharing,
    handleShare,
  }
}