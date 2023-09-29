import EChartsReact from "echarts-for-react"

const stylesFont = {
  textStyle: {
    fontFamily: 'bocato-font',
  }
}

export const PurchasesByCategory = () => {
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
          { value: 40, name: 'Antojitos' },
          { value: 38, name: 'Cupcakes' },
          { value: 32, name: 'Minitortas' },
          { value: 30, name: 'Brownies' },
          { value: 28, name: 'Desayunos' },
          { value: 26, name: 'Box' },
          { value: 22, name: 'Bocaditos' },
          { value: 18, name: 'Tortas' },
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
      <p className="text-center text-sm mb-[-2rem]">Ventas por categoría</p>
      <EChartsReact option={option} />
    </div>
  )
}
