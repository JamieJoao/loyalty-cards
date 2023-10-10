import { Key, useEffect, useState, useMemo } from 'react'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Textarea,
} from "@nextui-org/react"
import {
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa"
import { useProducts } from "src/hooks/useProducts"
import { ProductInterface } from 'src/types/PurchaseInterface'
import { useForm } from 'src/hooks/useForm'
import { ActionButton, ModalDelete, PageTitle, QuantityItems } from 'src/components'
import { CategoryInterface } from 'src/types/CategoryInterface'
import { FaX } from 'react-icons/fa6'
import { useCategories } from 'src/hooks/useCategories'
import { MdLabel } from 'react-icons/md'

interface ShowSpinnersInterface {
  saveProduct?: boolean
  saveCategory?: boolean
  deleteItem?: boolean
}

export const Product = () => {
  const { categories, getCategories, addCategory, updateCategory, deleteCategory, loadingCategories, getCategoryReference } = useCategories()
  const { products, getProducts, addProduct, updateProduct, deleteProduct, loadingProducts } = useProducts()
  const [showModals, setShowModals] = useState(false)
  const [showSpinners, setShowSpinners] = useState<ShowSpinnersInterface>({
    saveProduct: false,
    saveCategory: false,
    deleteItem: false,
  })
  const { form: formCategory, handleChange: handleChangeCategory, resetForm: resetFormCategory, setForm: setFormCategory } = useForm({
    id: '',
    name: '',
  })
  const { form: formProduct, handleChange: handleChangeProduct, resetForm: resetFormProduct, setForm: setFormProduct } = useForm<any>({
    id: '',
    name: '',
    category: null
  })
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const unsub = getProducts()
    const unsubCategories = getCategories()
    return () => {
      if (unsub) unsub()
      if (unsubCategories) unsubCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (formProduct.id) {
      const { category } = formProduct
      setSelectedCategory(category.id)
    }
    else if (!formProduct.name || !formProduct.id) {
      setSelectedCategory('')
    }
  }, [formProduct])

  const getProductsRows = (product: ProductInterface, index: number) => (
    <TableRow key={product.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>S/ {(product.price ?? 0).toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <ActionButton
          item={product}
          menuItems={[
            {
              key: 'edit',
              icon: FaEdit,
              label: 'Editar'
            },
            {
              key: 'delete',
              icon: FaTrash,
              label: 'Eliminar'
            },
          ]}
          onAction={e => handleAction(e, product, true)} />
      </TableCell>
    </TableRow>
  )

  const getCategoryRows = (category: CategoryInterface, index: number) => (
    <TableRow key={category.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell className="text-right">
        <ActionButton
          item={category}
          menuItems={[
            {
              key: 'edit',
              icon: FaEdit,
              label: 'Editar'
            },
            {
              key: 'delete',
              icon: FaTrash,
              label: 'Eliminar'
            },
          ]}
          onAction={e => handleAction(e, category)} />
      </TableCell>
    </TableRow>
  )

  const handleAction = (key: Key, item: any, isProduct?: boolean) => {
    if (isProduct) setFormProduct({ ...item, name: `${item.name} - ${item.price}` })
    else setFormCategory(item)

    switch (key) {
      case 'delete':
        setShowModals(true)
        break
    }
  }

  const handleSaveProduct = async () => {
    const isAddProduct = Boolean(!formProduct.id)
    const productsList = formProduct.name.split('\n').filter((obj: any) => Boolean(obj))

    setShowSpinners({ saveProduct: true })
    await Promise.all(
      productsList.map((name: any) => {
        const [productName, productPrice] = name.split('-')
        const data = {
          name: productName.trim(),
          price: Number(productPrice),
          category: getCategoryReference(selectedCategory)
        }


        isAddProduct
          ? addProduct(data)
          : updateProduct(formProduct.id, data)
      })
    )
    setShowSpinners({ saveProduct: false })
    resetFormProduct()
  }

  const handleSaveCategory = async () => {
    if (formCategory.name) {
      const isAddCategory = !formCategory.id
      const data = { name: formCategory.name }

      setShowSpinners({ saveCategory: true })

      if (isAddCategory) await addCategory(data)
      else await updateCategory(formCategory.id, data)

      setShowSpinners({ saveCategory: false })
      resetFormCategory()
    }
  }

  const handleDelete = async () => {
    const isProduct = !!formProduct.id

    if (formProduct.id || formCategory.id) {
      setShowSpinners({ deleteItem: true })

      if (isProduct) await deleteProduct(formProduct.id)
      else await deleteCategory(formCategory.id)

      setShowModals(false)
      setShowSpinners({ deleteItem: false })
      resetFormCategory()
      resetFormProduct()
    }
  }

  const skeletonMemo = useMemo(() => (
    <Skeleton className='rounded-lg bg-default-100'>
      <div className="h-[40px]"></div>
    </Skeleton>
  ), [])

  return (
    <div className="bc-product">
      <PageTitle>Gestionar Productos</PageTitle>

      <Tabs
        fullWidth>
        <Tab
          key='categories'
          title='Categorías'
          className='flex gap-4 flex-col sm:flex-row'>
          <div className="flex flex-col gap-4 sm:flex-1">
            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              label='Categoría'
              placeholder='Ejemplo: Minitortas'
              value={formCategory.name}
              onChange={e => handleChangeCategory(e, 'name')} />

            <div className="flex gap-4">
              <Button
                className='flex-auto sm:w-20'
                variant="ghost"
                color="default"
                startContent={<FaX />}
                isDisabled={!formCategory.name}
                onClick={resetFormCategory}>
                Cancelar
              </Button>

              <Button
                className='flex-auto sm:w-80'
                variant="solid"
                color="primary"
                startContent={<FaPlus />}
                isLoading={showSpinners.saveCategory}
                isDisabled={!formCategory.name}
                onClick={handleSaveCategory}>
                {formCategory.id ? 'Actualizar' : 'Registrar'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-1">
            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              label='Buscar'
              placeholder='Ejemplo: Cupcakes'
              // value={formCategory.name}
              onChange={e => { }} />

            <QuantityItems items={categories} text='categorías' />

            {loadingCategories
              ? skeletonMemo
              : (
                <Table
                  removeWrapper>
                  <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn className="text-right">ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent='No hay categorías que mostrar'>
                    {categories?.map(getCategoryRows)}
                  </TableBody>
                </Table>
              )}

            {/* <div className="flex justify-center">
              <Pagination total={1} initialPage={1} />
            </div> */}
          </div>
        </Tab>
        <Tab
          key='products'
          title='Productos'
          className='flex gap-4 flex-col sm:flex-row'>
          <div className="flex flex-col gap-4 sm:flex-1">
            <Textarea
              classNames={{ inputWrapper: 'shadow-none' }}
              label='Producto'
              placeholder="Ejemplo: Minitorta O1 - 22.5"
              minRows={10}
              value={formProduct.name}
              onChange={e => handleChangeProduct(e, 'name')} />

            <Select
              startContent={<MdLabel className='text-default-400' />}
              label="Categoría"
              placeholder="Selecciona una categoría"
              // selectedKeys={formProduct.category}
              selectedKeys={[selectedCategory]}
              // value={selectedCategory}
              // isDisabled={!formProduct.name}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>

            <div className="flex gap-4">
              <Button
                className='flex-auto sm:w-20'
                variant="ghost"
                color="default"
                startContent={<FaX />}
                isDisabled={!formProduct.name && !selectedCategory}
                onClick={resetFormProduct}>
                Cancelar
              </Button>

              <Button
                className='flex-auto sm:w-80'
                variant="solid"
                color="primary"
                startContent={<FaPlus />}
                isLoading={showSpinners.saveProduct}
                isDisabled={!formProduct.name || !selectedCategory}
                onClick={handleSaveProduct}>
                {formProduct.id ? 'Actualizar' : 'Registrar'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-1">
            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              label='Buscar'
              placeholder='Ejemplo: Minitorta O1'
              // value={formCategory.name}
              onChange={e => { }} />

            <QuantityItems items={products} text='productos' />

            {loadingProducts
              ? skeletonMemo
              : (
                <Table
                  removeWrapper>
                  <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>PRECIO</TableColumn>
                    <TableColumn className="text-right">ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent='No hay categorías que mostrar'>
                    {products?.map(getProductsRows)}
                  </TableBody>
                </Table>
              )}
          </div>
        </Tab>
      </Tabs>

      {/* <pre>{JSON.stringify(selectedCategory, null, 2)}</pre> */}

      <ModalDelete
        title={`Borrar ${formCategory?.id ? 'categoría' : 'producto'}`}
        description={
          <>
            <p>{formCategory?.name || formProduct.name} ya no aparecerá en la lista y deberá registrarse nuevamente.</p>
            <p>¿Desea continuar?</p>
          </>
        }
        isOpen={showModals}
        onClose={() => !showSpinners.deleteItem && setShowModals(false)}
        isLoading={!!showSpinners.deleteItem}
        onSubmit={handleDelete} />
    </div>
  )
}
