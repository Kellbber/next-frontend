import { Card, Tabs } from 'flowbite-react'
import { AssetShow } from '../../components/AssetShow'
import { Asset, OrderType } from '../../models'
import { TabsItem } from '../../components/Tabs'
import { OrderForm } from '../../components/OrderForm'
import { ChartComponent } from '../../components/ChartComponent'
import { AssetChartComponent } from './AssetChartComponent'
import { getAssetDailies } from '../../../queries/queries'
import { Time } from 'lightweight-charts'

export async function getAsset(symbol: string): Promise<Asset> {
  const response = await fetch(`http://localhost:3000/assets/${symbol}`)
  return response.json()
}
export default async function AssetDashboard({
  params,
  searchParams
}: {
  params: Promise<{ assetSymbol: string }>
  searchParams: Promise<{ walletId: string }>
}) {
  const { assetSymbol } = await params
  const { walletId } = await searchParams
  const asset = await getAsset(assetSymbol)

  const assetDailies = await getAssetDailies(assetSymbol)

  const chartData = assetDailies.map(daily => ({
    time: (Date.parse(daily.date) / 1000) as Time,
    value: daily.price
  }))

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <div className="flex flex-col space-y-2">
        <AssetShow asset={asset} />
        <div className="ml-2 font-bold text-2xl">R$ {asset.price}</div>
        <div className="grid grid-cols-5 flex-grow gap-2">
          <div className="col-span-2">
            <Card>
              <Tabs>
                <TabsItem
                  active
                  title={<div className="text-blue-700">Comprar</div>}
                >
                  <OrderForm
                    asset={asset}
                    walletId={walletId}
                    type={OrderType.BUY}
                  />
                </TabsItem>
                <TabsItem title={<div className="text-red-700">Vender</div>}>
                  <OrderForm
                    asset={asset}
                    walletId={walletId}
                    type={OrderType.SELL}
                  />
                </TabsItem>
              </Tabs>
            </Card>
          </div>
          <div className="col-span-3 flex flex-grow">
            <AssetChartComponent asset={asset} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  )
}
