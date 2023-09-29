import { } from 'react'
import { PageTitle } from 'src/components'
import { PurchasesByTime } from './components/purchases-by-time'
import { PurchasesByCategory } from './components/purchases-by-category'
import { Tab, Tabs } from '@nextui-org/react'
import { PurchasesByProduct } from './components/purchases-by-product'

export const Statistics = () => {
  return (
    <>
      <PageTitle>Estadísticas</PageTitle>

      <PurchasesByTime />

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <div className="flex flex-col">
          <Tabs
            fullWidth
            aria-label='Tabs de gráficos para productos y categorías'
          >
            <Tab key='categories' title='Categorías'>
              <PurchasesByCategory />
            </Tab>
            <Tab key='products' title='Productos'>
              <PurchasesByProduct />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  )
}
