import { Table, TableBody, TableHead, TableHeadCell } from 'flowbite-react'
import { AssetsSync } from './components/AssetsSync'
import { WalletList } from './components/WalletList'
import { Wallet } from './models'
import { TableWalletAssetRow } from './TableWalletAssetRow'

export async function getMyWallet(walletId: string): Promise<Wallet> {
  const response = await fetch(`http://localhost:3000/wallets/${walletId}`)
  return response.json()
}

export default async function MyWalletList({
  searchParams
}: {
  searchParams: { walletId: string }
}) {
  const { walletId } = searchParams
  if (!walletId) {
    return <WalletList />
  }
  const wallet = await getMyWallet(walletId)
  if (!wallet) {
    return <WalletList />
  }

  return (
    <div className="flex flex-col space-y-5 flex-grow">
      <article className="format">
        <h1>Minha carteira</h1>
      </article>
      <div className="overflow-x-auto w-full">
        <Table className="w-full max-w-full table-fixed">
          <TableHead>
            <TableHeadCell>Ativo</TableHeadCell>
            <TableHeadCell>Cotação</TableHeadCell>
            <TableHeadCell>Quantidade</TableHeadCell>
            <TableHeadCell>Comprar/vender</TableHeadCell>
          </TableHead>
          <TableBody>
            {wallet.assets.map(walletAsset => (
              <TableWalletAssetRow
                key={walletAsset._id}
                walletAsset={walletAsset}
                walletId={walletId}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <AssetsSync
        assetsSymbols={wallet.assets.map(wallet => wallet.asset.symbol)}
      />
    </div>
  )
}
