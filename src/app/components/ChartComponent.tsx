import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'
import {
  AreaData,
  AreaSeries,
  IChartApi,
  ISeriesApi,
  Time,
  createChart
} from 'lightweight-charts'

type ChartRef = {
  _api: IChartApi | null
  api(): IChartApi
  free(): void
}

export type ChartComponentRef = {
  update: (data: { time: Time; value: number }) => void
}

export const ChartComponent = forwardRef<
  ChartComponentRef,
  { header: React.ReactNode; data?: AreaData<Time>[] }
>((props, ref) => {
  const { header, data } = props
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ChartRef>({
    _api: null,
    api() {
      if (!this._api) {
        this._api = createChart(chartContainerRef.current!, {
          width: 0,
          height: 0,
          timeScale: {
            timeVisible: true
          }
        })
        this._api.timeScale().fitContent()
      }
      return this._api
    },
    free() {
      if (this._api) {
        this._api.remove()
      }
    }
  })
  const seriesRef = useRef<ISeriesApi<'Area'>>(null)

  useImperativeHandle(ref, () => ({
    update: (data: { time: Time; value: number }) => {
      seriesRef.current!.update(data)
    }
  }))

  useEffect(() => {
    seriesRef.current = chartRef.current.api().addSeries(AreaSeries)
    seriesRef.current.setData(data || [])
  }, [data])

  useLayoutEffect(() => {
    const currentRef = chartRef.current
    const chart = currentRef.api()

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current!.parentElement!.clientWidth
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Garante o ajuste inicial

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="flex-grow relative" ref={chartContainerRef}>
      <div className="absolute top-0 left-0 z-50 bg-gray-100 rounded-md p-2 shadow-md">
        {header}
      </div>
    </div>
  )
})

ChartComponent.displayName = 'ChartComponent'
