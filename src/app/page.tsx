import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from 'flowbite-react'
import { Wallet } from './models'
import Image from 'next/image'
import { AssetShow } from './components/AssetShow'
import { WalletList } from './components/WalletList'
import Link from 'next/link'

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
              <TableRow key={walletAsset._id}>
                <TableCell>
                  <AssetShow asset={walletAsset.asset} />
                </TableCell>
                <TableCell>R$ {walletAsset.asset.price}</TableCell>
                <TableCell>{walletAsset.shares}</TableCell>
                <TableCell>
                  <Button
                    color="light"
                    as={Link}
                    href={`assets/${walletAsset.asset.symbol}`}
                  >
                    Comprar/vender
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
