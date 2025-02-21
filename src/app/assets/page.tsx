import { Table, TableBody, TableHead, TableHeadCell } from 'flowbite-react'
import { AssetsSync } from '../components/AssetsSync'
import { Asset } from '../models'
import { TableAssetRow } from './TableAssetRow'
import { WalletList } from '../components/WalletList'

export async function getAssets(): Promise<Asset[]> {
  const response = await fetch(`http://localhost:3000/assets`)
  return response.json()
}

export default async function AssetsListPage({
  searchParams
}: {
  searchParams: Promise<{ walletId: string }>
}) {
  const { walletId } = await searchParams
  if (!walletId) {
    return <WalletList />
  }
  const assets = await getAssets()

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <article className="format">
        <h1>Ativos</h1>
      </article>
      <div className="overflow-x-auto w-full">
        <Table className="w-full max-w-full table-fixed">
          <TableHead>
            <TableHeadCell>Ativo</TableHeadCell>
            <TableHeadCell>Cotação</TableHeadCell>
            <TableHeadCell>Comprar/vender</TableHeadCell>
          </TableHead>
          <TableBody>
            {assets.map((asset, key: number) => (
              <TableAssetRow key={key} walletId={walletId} asset={asset} />
            ))}
          </TableBody>
        </Table>
      </div>
      <AssetsSync assetsSymbols={assets.map(asset => asset.symbol)} />
    </div>
  )
}
