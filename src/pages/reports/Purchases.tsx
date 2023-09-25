import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Selection, Skeleton, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import classNames from 'classnames'
import moment from 'moment'
import { FC, useEffect, useMemo, useState } from 'react'
import { FaChevronCircleDown, FaDownload, FaEdit, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { PageTitle } from 'src/components'
import { ChevronDown } from 'src/components/icons/chevron-down'
import { DATE_FORMAT_SIMPLE, DATE_FORMAT_SPECIAL } from 'src/domain/constants'
import { useForm } from 'src/hooks/useForm'
import { usePurchase } from 'src/hooks/usePurchase'
import { PurchaseInterface } from 'src/types/PurchaseInterface'
import { downloadPurchaseExcel } from 'src/utils/download-report'
import { getTotalByPurchase } from 'src/utils/functions'

interface PurchasesProps {

}

const columns = [
  { name: 'CLIENTE', key: 'client', sortable: true },
  { name: 'CELULAR', key: 'phone', sortable: false },
  { name: 'PRODUCTOS', key: 'products', sortable: false },
  { name: 'FECHA', key: 'date', sortable: true },
  { name: 'TOTAL', key: 'total', sortable: false },
]

export const Purchases: FC<PurchasesProps> = () => {
  const { purchases, getPurchases, loadingPurchases } = usePurchase()
  const { form, handleChange } = useForm({ search: '' })
  const [sortDescriptor, setSortDescriptor] = useState({} as SortDescriptor)
  const [selectedColumns, setSelectedColumns] = useState<Selection>(new Set(columns.map(obj => obj.key)))
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const unsub = getPurchases()

    return () => {
      if (unsub) unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const headerColumns = useMemo(() => {
    if (selectedColumns === 'all') return columns

    return columns.filter(obj => Array.from(selectedColumns).includes(obj.key))
  }, [selectedColumns])

  const getPurchaseRow = (purchase: PurchaseInterface) => {
    const { id, names, phone, products, date } = purchase
    const dateFormat = moment(date).format(DATE_FORMAT_SIMPLE)
    const purchaseTotal = getTotalByPurchase(products)

    return (
      <TableRow
        key={id}
      >
        {columnKey => {
          switch (columnKey) {
            case 'client':
              return <TableCell>{names}</TableCell>
            case 'phone':
              return <TableCell>{phone}</TableCell>
            case 'products':
              return (
                <TableCell>
                  {products.map((product, pIndex) => (
                    <p key={pIndex} className='text-sm flex-1'>{product.product.name}</p>
                  ))}
                </TableCell>
              )
            case 'date':
              return <TableCell className='text-center'>{dateFormat}</TableCell>
            case 'total':
              return <TableCell className='text-end'>{purchaseTotal}</TableCell>
            default:
              return <></>
          }
        }}
      </TableRow>
    )
  }

  const handleSort = (descriptor: SortDescriptor) => {
    // const key = descriptor.column as keyof PurchaseInterface
    setSortDescriptor(descriptor)
    // setPurchasesOrdered(
    //   purchasesFilteredMemo.sort((prev, next) => {
    //     const firstColumn = prev[key]
    //     const secondColumn = next[key]

    //     let compare = (parseInt(firstColumn) || firstColumn) < (parseInt(secondColumn) || secondColumn)
    //       ? -1
    //       : 1

    //     if (descriptor.direction === 'descending') {
    //       compare *= -1
    //     }

    //     return compare
    //   })
    // )
  }

  const purchasesFilteredMemo = useMemo(() => {
    const query = ({ names, phone }: PurchaseInterface) => JSON.stringify({
      names: names?.toLowerCase(),
      phone,
    })
    setPage(1)

    return form.search
      ? purchases.filter(obj => `${query(obj)}`.includes(form.search.toLowerCase()))
      : purchases
  }, [form.search, purchases])

  const sortPurchases = (prev: PurchaseInterface, next: PurchaseInterface) => {
    const key = sortDescriptor.column as keyof PurchaseInterface
    const firstColumn = prev[key]
    const secondColumn = next[key]

    let compare = (parseInt(firstColumn) || firstColumn) < (parseInt(secondColumn) || secondColumn)
      ? -1
      : 1

    if (sortDescriptor.direction === 'descending') {
      compare *= -1
    }

    return compare
  }

  const purchasesPaginatedMemo = useMemo(() => {
    const indexStart = (page - 1) * rowsPerPage
    const indexEnd = indexStart + rowsPerPage

    return purchasesFilteredMemo
      .sort(sortPurchases)
      .slice(indexStart, indexEnd)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, purchasesFilteredMemo, sortDescriptor, rowsPerPage])

  const handleDownload = () => {
    downloadPurchaseExcel(purchases)
  }

  return (
    <>
      <PageTitle>Lista de compras</PageTitle>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Input
          classNames={{ inputWrapper: 'shadow-none' }}
          label='Buscar'
          placeholder='Ejemplo: Pepito o 123456789'
          startContent={<FaSearch className='text-default-400' />}
          value={form.search}
          onChange={e => handleChange(e, 'search')} />

        <div className="flex items-end justify-between gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDown />}
                color='primary'
                variant="flat"
              >
                Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columnas de tabla"
              closeOnSelect={false}
              selectedKeys={selectedColumns}
              selectionMode="multiple"
              onSelectionChange={setSelectedColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.key} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button
            endContent={<FaDownload />}
            color='secondary'
            variant="flat"
            onClick={handleDownload}
          >
            Descargar reporte
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-default-400 text-small">Total {purchasesFilteredMemo.length} ventas</span>

        <label className="flex items-center text-default-400 text-small">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={e => setRowsPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto pb-4">
        {loadingPurchases
          ? (
            <Skeleton className='rounded-large bg-default-100'>
              <div className="h-[40px]"></div>
            </Skeleton>
          )
          : (
            <Table
              aria-labelledby='Tabla de ventas'
              removeWrapper
              onSortChange={handleSort}
              sortDescriptor={sortDescriptor}
              isStriped
              bottomContent={
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={Math.ceil(purchasesFilteredMemo.length / rowsPerPage)}
                    initialPage={1}
                    page={page}
                    onChange={setPage} />
                </div>
              }
            >
              <TableHeader
                columns={headerColumns}
              >
                {column => (
                  <TableColumn
                    key={column.key}
                    className={classNames(
                      (column.key === 'date') && 'text-center',
                      (column.key === 'total') && 'text-end',
                    )}
                    allowsSorting={column.sortable}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={
                  <p className='text-xs py-4'>No hay ventas que mostrar</p>
                }
                items={purchasesPaginatedMemo}
              >
                {purchase => getPurchaseRow(purchase)}
              </TableBody>
            </Table>
          )}
      </div>
    </>
  )
}
