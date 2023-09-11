import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { ProductInterface } from 'src/types/PurchaseInterface'

export const useProducts = () => {
  const { getSnapshot, addDocument, deleteDocument, updateDocument, getSnapshotByLabel } = useFirebase()
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [product, setProduct] = useState<ProductInterface | null>()
  const [loading, setLoading] = useState(false)

  const getProducts = () => {
    try {
      setLoading(true)
      const unsub = getSnapshot<ProductInterface>('products', data => {
        setProducts(data)
        setLoading(false)
      })

      return unsub
    } catch (error) {
      console.log('error en getProducts ')
    }
  }

  const getProduct = (id: string) => {
    const unsubscribe = getSnapshotByLabel<ProductInterface>(
      'products',
      { name: '__name__', value: id },
      data => {
        const [entryProduct] = data
        setProduct(entryProduct)
      })

    return unsubscribe
  }

  const addProduct = async (data?: { [key: string]: any }) => {
    try {
      await addDocument('products', data)
    } catch (error) {
      console.log('error en addProduct ')
    }
  }

  const updateProduct = async (id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument('products', id, data)
    } catch (error) {
      console.log('error en updateProduct ')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await deleteDocument('products', id)
    } catch (error) {
      console.log('error en deleteProduct ')
    }
  }

  return {
    products,
    product,
    loading,

    getProducts,
    getProduct,

    addProduct,
    updateProduct,
    deleteProduct,
  }
}