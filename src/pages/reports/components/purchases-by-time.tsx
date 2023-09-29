import { Radio, RadioGroup } from "@nextui-org/react"
import EChartsReact from "echarts-for-react"

const stylesFont = {
  textStyle: {
    fontFamily: 'bocato-font',
  }
}

export const PurchasesByTime = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value',
      axisLabel: stylesFont
    },
    yAxis: {
      type: 'category',
      data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      axisLabel: stylesFont
    },
    legend: {},
    grid: {
      left: '2%',
      right: '5%',
      bottom: 0,
      containLabel: true
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          // color: {
          //   type: 'linear',
          //   x: 1,
          //   y: 0,
          //   x2: 0,
          //   y2: 0,
          //   colorStops: [
          //     { offset: 0, color: '#F0DBC6' },
          //     { offset: 1, color: '#E28969' },
          //   ],
          // },
          borderRadius: [0, 6, 6, 0],
        },
        data: [
          45,
          34,
          67,
          92,
          48,
          33,
          18,
          50,
          87,
          42,
          12,
          24,
        ],
        label: {
          show: true,
          color: 'white',
          ...stylesFont,
        }
      },
    ]
  }

  return (
    <div className="flex flex-col">
      <p className="text-center text-sm mb-[-2rem]">Ventas totales del año 2023</p>
      <EChartsReact option={option} style={{ height: 400 }} />
    </div>
  )
}
