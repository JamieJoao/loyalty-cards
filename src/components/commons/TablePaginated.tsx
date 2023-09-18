import { FC } from 'react'
import { Table, TableBody, TableColumn, TableHeader } from '@nextui-org/react'

interface TablePaginatedProps {
  header: any[]
}

export const TablePaginated: FC<TablePaginatedProps> = ({
  header,
}) => {
  return (
    <Table
      removeWrapper>
      <TableHeader columns={header}>
        {/* <TableColumn>#</TableColumn> */}
        {/* {() => <TableColumn className="text-right">ACCIONES</TableColumn>} */}
        {/* <TableColumn>NOMBRE</TableColumn> */}
        {/* {header} */}
        {/* <TableColumn className="text-right">ACCIONES</TableColumn> */}
      </TableHeader>
      <TableBody emptyContent='No hay categorías que mostrar'>
        {/* {categories?.map(getCategoryRows)} */}
      </TableBody>
    </Table>
  )
}
