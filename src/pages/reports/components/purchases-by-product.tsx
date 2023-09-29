import EChartsReact from "echarts-for-react"

const stylesFont = {
  textStyle: {
    fontFamily: 'bocato-font',
  }
}

export const PurchasesByProduct = () => {
  const option = {
    grid: {
      left: '2%',
      right: '5%',
      bottom: 0,
      containLabel: true
    },
    series: [
      {
        type: 'pie',
        radius: [20, 80],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 46, name: 'Minitorta O1' },
          { value: 32, name: 'Brownies Flork x6' },
          { value: 37, name: 'Box chocolatoso' },
          { value: 32, name: 'Maxi Desayuno 1' },
          { value: 25, name: 'Torta M' },
          { value: 21, name: 'Picnic para dos' },
          { value: 29, name: 'Caja 50 alfajores' },
          { value: 17, name: 'Bandejita 1' },
          { value: 56, name: 'Torta XL' },
        ],
        label: {
          show: true,
          ...stylesFont,
        }
      },
    ],
  }

  return (
    <div className="flex flex-col">
      <p className="text-center text-sm mb-[-2rem]">Ventas por producto</p>
      <EChartsReact option={option} />
    </div>
  )
}
