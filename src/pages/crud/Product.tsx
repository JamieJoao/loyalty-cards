import { Key, useEffect, useState, useMemo } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react"
import {
  FaEdit,
  FaEllipsisV,
  FaPlus,
  FaTrash,
} from "react-icons/fa"
import { useProducts } from "src/hooks/useProducts"
import { ProductInterface } from 'src/types/PurchaseInterface'
import { useForm } from 'src/hooks/useForm'
import { ModalDelete } from 'src/components'

interface ShowSpinnersInterface {
  saveProduct?: boolean
  deleteProduct?: boolean
}

export const Product = () => {
  const { products, getProducts, addProduct, updateProduct, deleteProduct, loading } = useProducts()
  const [showModals, setShowModals] = useState(false)
  const [showSpinners, setShowSpinners] = useState<ShowSpinnersInterface>({
    saveProduct: false,
    deleteProduct: false,
  })
  const { form, handleChange, resetForm, setForm } = useForm({
    id: '',
    name: '',
  })

  useEffect(() => {
    const unsub = getProducts()
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const getProductsRows = (product: ProductInterface) => (
    <TableRow key={product.id}>
      <TableCell>{product.name}</TableCell>
      <TableCell>S/ {(product.price ?? 0).toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown className="bg-background border-1 border-default-200">
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                <FaEllipsisV className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant='faded'
              aria-labelledby='Menu de opciones'
              onAction={key => handleAction(key, product)}>
              <DropdownItem
                key='edit'
                startContent={<FaEdit className='text-success-400' />}>Editar</DropdownItem>
              <DropdownItem
                key='delete'
                startContent={<FaTrash className='text-danger-400' />}>Eliminar</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </TableCell>
    </TableRow>
  )

  const handleAction = (key: Key, product: ProductInterface) => {
    setForm(product)

    switch (key) {
      case 'delete':
        setShowModals(true)
        break
    }
  }

  const handleSave = async () => {
    const isAddProduct = Boolean(!form.id)
    const productsList = form.name.split('\n').filter(obj => Boolean(obj))

    setShowSpinners({ saveProduct: true })
    await Promise.all(
      productsList.map(name => {
        const [productName, productPrice] = name.split('-')
        const data = { name: productName.trim(), price: Number(productPrice) }

        isAddProduct
          ? addProduct(data)
          : updateProduct(form.id, data)
      })
    )
    setShowSpinners({ saveProduct: false })
    resetForm()
  }

  const handleDelete = async () => {
    if (form.id) {
      setShowSpinners({ deleteProduct: true })
      await deleteProduct(form.id)
      setShowModals(false)
      setShowSpinners({ deleteProduct: false })
      resetForm()
    }
  }

  const skeletonMemo = useMemo(() => (
    <Skeleton className='rounded-lg bg-default-100'>
      <div className="h-[40px]"></div>
    </Skeleton>
  ), [])

  return (
    <div className="bc-product">
      <h3 className="mb-4">Gestionar Productos</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <Textarea
            classNames={{ inputWrapper: 'shadow-none' }}
            label='Producto'
            placeholder="Ejemplo: Minitorta O1"
            minRows={10}
            value={form.name}
            onChange={e => handleChange(e, 'name')} />

          <Button
            variant="shadow"
            color="primary"
            startContent={<FaPlus />}
            isLoading={showSpinners.saveProduct}
            isDisabled={!form.name}
            onClick={handleSave}>
            {form.id ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-default-400 text-small">Total {products.length} productos</span>
          </div>

          {loading
            ? skeletonMemo
            : (
              <Table
                removeWrapper>
                <TableHeader>
                  <TableColumn>NOMBRE</TableColumn>
                  <TableColumn>PRECIO</TableColumn>
                  <TableColumn className="text-right">ACCIONES</TableColumn>
                </TableHeader>
                <TableBody items={products} emptyContent='No hay productos que mostrar'>
                  {getProductsRows}
                </TableBody>
              </Table>
            )}
        </div>
      </div>

      <ModalDelete
        title='Borrar producto'
        description={
          <>
            <p>Este producto ya no aparecerá en la lista y deberá agregarlo nuevamente.</p>
            <p>¿Desea continuar?</p>
          </>
        }
        isOpen={showModals}
        onClose={() => !showSpinners.deleteProduct && setShowModals(false)}
        isLoading={!!showSpinners.deleteProduct}
        onSubmit={handleDelete} />
    </div>
  )
}
