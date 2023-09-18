import { useState } from 'react'

import { useFirebase } from "./useFirebase"
import { ProductInterface } from 'src/types/PurchaseInterface'
import { CategoryInterface } from 'src/types/CategoryInterface'
import { getDoc } from 'firebase/firestore'

const tableName = 'products'

export const useProducts = () => {
  const { getSnapshot, addDocument, deleteDocument, updateDocument, getSnapshotByLabel, getDataByLabel, getReference } = useFirebase()
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [product, setProduct] = useState<ProductInterface | null>()
  const [loadingProducts, setLoading] = useState(false)

  const getProducts = () => {
    try {
      setLoading(true)
      const unsub = getSnapshot<ProductInterface>(tableName, async data => {
        const dataParsed = await Promise.all<Promise<any>>(
          data.map(async obj => {
            try {
              let categoryResolved: string | CategoryInterface = obj.id
              if (obj.category) {
                const dataCategory = await getDoc<any, any>(obj.category)
                if (dataCategory?.exists()) {
                  categoryResolved = { ...dataCategory.data(), id: dataCategory.id }
                }
              }

              return {
                ...obj,
                category: categoryResolved,
                // categoryId: obj.category.id
              }
            } catch (error) {
              console.log('Error en getProducts al obtener la referencia de ' + obj.id, error)
              return { ...obj }
            }
          })
        )

        setProducts(dataParsed)
        setLoading(false)
      })

      return unsub
    } catch (error) {
      console.log('error en getProducts ')
    }
  }

  const getProduct = (id: string) => {
    const unsubscribe = getSnapshotByLabel<ProductInterface>(
      tableName,
      { name: '__name__', value: id },
      data => {
        const [entryProduct] = data
        setProduct(entryProduct)
      })

    return unsubscribe
  }

  const addProduct = async (data?: { [key: string]: any }) => {
    try {
      await addDocument(tableName, data)
    } catch (error) {
      console.log('error en addProduct ')
    }
  }

  const updateProduct = async (id: string, data: { [key: string]: any }) => {
    try {
      await updateDocument(tableName, id, data)
    } catch (error) {
      console.log('error en updateProduct ')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await deleteDocument(tableName, id)
    } catch (error) {
      console.log('error en deleteProduct ')
    }
  }

  return {
    products,
    product,
    loadingProducts,

    getProducts,
    getProduct,

    addProduct,
    updateProduct,
    deleteProduct,
  }
}