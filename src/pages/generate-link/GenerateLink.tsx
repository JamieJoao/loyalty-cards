import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import {
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  SelectSection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import { BsFillPersonXFill } from 'react-icons/bs'
import { BiCake } from 'react-icons/bi'
import {
  FaCalendar,
  FaEdit,
  FaLink,
  FaList,
  FaMinus,
  FaPhone,
  FaPlus,
  FaSave,
  FaSearch,
  FaTrash,
} from "react-icons/fa"
import { useLocation } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore'
import moment from 'moment'

import { useForm } from "src/hooks/useForm"
import { CustomerInterface } from 'src/types/CustomerInterface'
import { ProductInterface, PurchaseInterface, PurchaseProductsInterface } from 'src/types/PurchaseInterface'
import { useProducts } from 'src/hooks/useProducts'
import { useClient } from 'src/hooks/useClient'
import { usePurchase } from 'src/hooks/usePurchase'
import { getProductDetail, getTotalByPurchase } from 'src/utils/functions'
import { ModalShareLink } from '../dashboard/ModalShareLink'
import { ModalPurchasesList } from './ModalPurchasesList'
import { ActionButton, PageTitle } from 'src/components'
import { LuClipboardEdit } from 'react-icons/lu'
import { parseDateForInput } from 'src/utils/parsers'

interface PurchaseForm {
  names: string
  phone?: string
  date: string
}

interface ShowModals {
  shareLink?: boolean
  purchasesList?: boolean
}

const calculatePrice = (price: string, quantity: number) => (
  (Number(price ?? '') * quantity).toFixed(2)
)

export const GenerateLink = () => {
  const location = useLocation()
  const { names, phone, id } = location.state ?? {}
  const { addPossibleCustomer, getCustomerReference } = useClient()
  const { products, getProducts, loadingProducts } = useProducts()
  const { purchases, addPurchase, loadingPurchases, getPurchasesByCustomer, updatePurchase } = usePurchase()
  const [purchaseList, setPurchaseList] = useState<PurchaseProductsInterface[]>([])
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [productId, setProductId] = useState<number | null>(null)
  const [currentPurchase, setCurrentPurchase] = useState<PurchaseInterface | null>(null)
  const { form: formPurchase, handleChange: handleChangePurchase, handleSetValue: handleSetValuePurchase, resetForm: resetFormPurchase, setForm: setFormPurchase } = useForm<{
    search: string,
    productId: string[],
    price: string,
    quantity: number
  }>({
    search: '',
    productId: [],
    price: '',
    quantity: 1,
  })
  const { form, handleChange, handleSetValue, resetForm } = useForm<PurchaseForm>({
    names: '',
    phone: '',
    date: ''
  })
  const [showSpinners, setShowSpinners] = useState(false)
  const [showModals, setShowModals] = useState<ShowModals>({
    shareLink: false,
    purchasesList: false,
  })
  const hasCustomerInRoute = Boolean(id)

  useEffect(() => {
    const unsub = getProducts()
    const unsubPurchase = hasCustomerInRoute ? getPurchasesByCustomer(id) : null
    return () => {
      if (unsub) unsub()
      if (unsubPurchase) unsubPurchase()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (formPurchase.productId.length) {
      const productRecovered = products.find(obj => obj.id === formPurchase.productId[0])
      if (productRecovered) handleSetValuePurchase('price', productRecovered.price ?? '')
    }
    else {
      handleSetValuePurchase('price', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPurchase.productId, products])

  const handleChangeQuantity = (plus: boolean) => {
    handleSetValuePurchase('quantity', plus ? ++formPurchase.quantity : --formPurchase.quantity)
  }

  const isDisabledFormPurchase = (
    !formPurchase.productId?.length ||
    !formPurchase.price ||
    !formPurchase.quantity
  )

  const isDisabledButtonGenerateLink = (
    purchaseList.length === 0 ||
    !form.date ||
    !(hasCustomerInRoute || form.names)
  )

  const handleAddPurchase = () => {
    if (formPurchase.productId.length) {
      if (productId !== null) {
        const productRecovered = products.find(obj => obj.id === formPurchase.productId[0])
        if (productRecovered) {
          setPurchaseList(purchaseList.map((obj, index) => productId === index
            ? {
              product: productRecovered,
              price: Number(formPurchase.price),
              quantity: formPurchase.quantity,
            }
            : obj))
        }
      }
      else {
        const productRecovered = products.find(obj => obj.id === formPurchase.productId[0])
        if (productRecovered) {
          setPurchaseList([...purchaseList, {
            product: productRecovered,
            price: Number(formPurchase.price),
            quantity: formPurchase.quantity,
          }])
        }
      }

      setProductId(null)
      resetFormPurchase()
    }
  }

  const productsFiltered = useMemo(() => {
    const query = ({ name }: ProductInterface) => JSON.stringify({
      name: name?.toLowerCase()
    })

    return formPurchase.search
      ? products.filter(obj => `${query(obj)}`.includes(formPurchase.search.toLowerCase()))
      : products
  }, [products, formPurchase.search])

  const productsByCategoryMemo = useMemo(() => (
    productsFiltered.reduce((acc: { id: string, name: string, products: ProductInterface[] }[], curr) => {
      const indexCurrent = acc.findIndex(obj => obj.id === curr.category.id)

      if (indexCurrent > -1) {
        acc[indexCurrent].products.push(curr)
      }
      else {
        acc.push({ ...curr.category, products: [curr] })
      }

      return acc
    }, [])
  ), [productsFiltered])

  const handleGenerateLink = async () => {
    setShowSpinners(true)
    const preCustomerId = await addPossibleCustomer({
      names: form.names,
      phone: Number(form.phone),
    } as CustomerInterface)
    if (preCustomerId) {
      const purchaseDoc = {
        customer: getCustomerReference(preCustomerId),
        names: form.names,
        phone: form.phone,
        products: purchaseList,
        date: Timestamp.fromDate(moment(form.date).toDate()),
        used: false,
      }

      await addPurchase(purchaseDoc)

      resetForm()
      setPurchaseList([])
      setShowModals({ shareLink: true })
      setCustomerId(preCustomerId)
    }

    setShowSpinners(false)
  }

  const handleChangeProduct = (e: ChangeEvent<HTMLSelectElement>) => handleSetValuePurchase('productId', [e.target.value])

  const getLabelSelectProduct = () => {
    const pLength = productsFiltered.length

    if (loadingProducts) {
      return <p className='mt-1'>Cargando productos ...</p>
    }
    else if (pLength) {
      return <p className='text-primary mt-1'>{pLength} resultado{pLength !== 1 && 's'}</p>
    }
    else {
      return <p className='text-warning mt-1'>No hay productos que coincidan.</p>
    }
  }

  const subTotalMemo = useMemo(() => (
    calculatePrice(formPurchase.price, formPurchase.quantity)
  ), [formPurchase.price, formPurchase.quantity])

  const handleSavePurchase = async () => {
    if (id) {
      if (currentPurchase) {
        const purchaseDoc = {
          products: purchaseList,
          date: Timestamp.fromDate(moment(form.date).toDate()),
        }
        setShowSpinners(true)
        await updatePurchase(currentPurchase.id, purchaseDoc)
        resetForm()
        setPurchaseList([])
        setShowSpinners(false)
      }
      else {
        const purchaseDoc = {
          customer: getCustomerReference(id),
          names,
          phone: phone ?? '',
          products: purchaseList,
          date: Timestamp.fromDate(moment(form.date).toDate()),
          used: false,
        }

        setShowSpinners(true)
        await addPurchase(purchaseDoc)
        resetForm()
        setPurchaseList([])
        setShowSpinners(false)
      }
    }
  }

  const handleRemoveProduct = (index: number) => {
    setPurchaseList(purchaseList.filter((_, i) => i !== index))
  }

  const handleActionProducts = (key: React.Key, product: PurchaseProductsInterface, index: number) => {
    switch (key) {
      case 'delete':
        handleRemoveProduct(index)
        break
      case 'edit':
        setProductId(index)
        setFormPurchase({ ...formPurchase, price: String(product.price), quantity: product.quantity, productId: [product.product.id] })
        break
    }
  }

  const handleLoadPurchase = (purchase: PurchaseInterface) => {
    setPurchaseList(purchase.products)
    setCurrentPurchase(purchase)
    handleSetValue('date', parseDateForInput(purchase.date))
  }

  return (
    <>
      <div className="bc-generate-link">
        {/* <h3 className="text-md mb-4">
          {hasCustomerInRoute
            ? (
              <>
                <span>Agregar compra a</span>
                <span className='font-bold uppercase'> {names}</span>
              </>
            )
            : 'Generar Link para nuevo usuario'}
        </h3> */}
        <PageTitle>
          {hasCustomerInRoute
            ? (
              <>
                <span className='font-normal'>Agregar compra a</span>
                <span className='font-bold uppercase'> {names}</span>
              </>
            )
            : 'Generar Link para nuevo usuario'}
        </PageTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className='flex flex-col gap-4'>
            <Input
              classNames={{ inputWrapper: 'shadow-none' }}
              label='Buscar'
              placeholder='Ejemplo: Minitorta O1'
              type='text'
              variant='flat'
              value={formPurchase.search}
              onChange={(e) => handleChangePurchase(e, 'search')}
              spellCheck={false}
              startContent={<FaSearch className='text-default-400' />} />

            <Select
              isLoading={loadingProducts}
              fullWidth
              variant='flat'
              label="Producto"
              placeholder='Selecciona un producto'
              description={getLabelSelectProduct()}
              selectedKeys={formPurchase.productId}
              onChange={handleChangeProduct}
              startContent={<BiCake className='text-default-400' />}
            >
              {productsByCategoryMemo.map(productCategory => (
                <SelectSection
                  key={productCategory.id}
                  title={productCategory.name}
                  showDivider
                >
                  {productCategory.products.map(product => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      description={<span className='text-default-400'>s/ {product.price?.toFixed(2) ?? 0}</span>}
                    >
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectSection>
              ))}
            </Select>

            <div className="flex gap-4">
              <Input
                classNames={{ inputWrapper: 'shadow-none' }}
                label='Precio'
                placeholder='Ejemplo: 15.9'
                min={1}
                type='number'
                variant='flat'
                value={formPurchase.price}
                onChange={(e) => handleChangePurchase(e, 'price')}
                spellCheck={false}
                startContent={<label>s/</label>} />

              <div className="flex gap-2 items-center">
                <Button
                  color="success"
                  variant="flat"
                  isIconOnly
                  startContent={<FaMinus />}
                  isDisabled={formPurchase.quantity <= 0}
                  onClick={() => handleChangeQuantity(false)}></Button>
                <span
                  className="font-bold text-sm">{formPurchase.quantity}</span>
                <Button
                  color="success"
                  variant="flat"
                  isIconOnly
                  startContent={<FaPlus />}
                  onClick={() => handleChangeQuantity(true)}></Button>
              </div>
            </div>

            <Button
              variant="flat"
              color="primary"
              startContent={<FaPlus />}
              isDisabled={isDisabledFormPurchase}
              onClick={handleAddPurchase}
              endContent={<span>s/ {subTotalMemo}</span>}>
              {productId !== null ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>

          <Table
            aria-labelledby='Tabla de productos provisionales'
            removeWrapper
            classNames={{ emptyWrapper: 'h-auto' }}>
            <TableHeader>
              <TableColumn>PRODUCTO</TableColumn>
              <TableColumn className='text-right'>SUBTOTAL</TableColumn>
              <TableColumn className="text-right">ACC</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <p className='text-xs py-4'>No hay pedidos que mostrar</p>
              }>
              {purchaseList.map((obj, index) => {
                const { price, quantity } = obj
                return (
                  <TableRow
                    key={index}>
                    <TableCell>{getProductDetail(obj)}</TableCell>
                    <TableCell className='text-right'>s/ {calculatePrice(price + '', quantity)}</TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        menuItems={[
                          { key: 'delete', icon: FaTrash, label: 'Remover' },
                          { key: 'edit', icon: FaEdit, label: 'Editar' },
                        ]}
                        item={obj}
                        onAction={(key, item) => handleActionProducts(key, item, index)} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex gap-4 flex-col mb-4">
          <Divider className='mt-4' />
          <Input
            classNames={{ inputWrapper: 'shadow-none' }}
            label='Fecha'
            placeholder='Ejemplo: 11/09/23'
            type='date'
            variant='flat'
            value={form.date}
            onChange={(e) => handleChange(e, 'date')}
            spellCheck={false}
            startContent={<FaCalendar className='text-default-400' />} />
        </div>

        {!hasCustomerInRoute
          ? (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    classNames={{ inputWrapper: 'shadow-none' }}
                    label='Nombre'
                    placeholder='Ejemplo: Juanito'
                    type='text'
                    variant='flat'
                    value={form.names}
                    onChange={(e) => handleChange(e, 'names')}
                    spellCheck={false}
                    startContent={<BsFillPersonXFill className='text-default-400' />} />

                  <Input
                    classNames={{ inputWrapper: 'shadow-none' }}
                    label='Celular'
                    placeholder='Ejemplo: 987654321'
                    type='number'
                    variant='flat'
                    value={String(form.phone)}
                    onChange={(e) => handleChange(e, 'phone')}
                    spellCheck={false}
                    startContent={<FaPhone className='text-default-400' />} />
                </div>

                <p className='text-xs text-default-400'>
                  Tanto el celular como el nombre serán reemplazados cuando el cliente se registre.
                </p>

                <Button
                  variant="shadow"
                  color="primary"
                  startContent={<FaLink />}
                  isDisabled={isDisabledButtonGenerateLink}
                  isLoading={showSpinners}
                  onClick={handleGenerateLink}>Generar Link</Button>
              </div>
            </>
          )
          : (
            <div className="flex mt-4 gap-4 flex-col sm:flex-row">
              <Button
                isDisabled={loadingPurchases}
                fullWidth
                variant="ghost"
                color="primary"
                startContent={<FaList />}
                onClick={() => setShowModals({ purchasesList: true })}>Ver historial de compras</Button>

              <Button
                fullWidth
                variant="shadow"
                color="primary"
                startContent={<FaSave />}
                isDisabled={isDisabledButtonGenerateLink}
                isLoading={showSpinners}
                onClick={handleSavePurchase}
                endContent={<span>s/ {getTotalByPurchase(purchaseList)}</span>}>
                {currentPurchase ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          )}

      </div>

      <ModalShareLink
        isOpen={!!showModals.shareLink}
        onClose={() => setShowModals({ shareLink: false })}
        customerId={customerId} />

      {hasCustomerInRoute && (
        <ModalPurchasesList
          isOpen={!!showModals.purchasesList}
          onClose={() => setShowModals({ purchasesList: false })}
          currentPurchase={currentPurchase}
          purchases={purchases}
          onSelect={handleLoadPurchase} />
      )}
    </>
  )
}