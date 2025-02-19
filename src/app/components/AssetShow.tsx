import { Asset } from '../models'
import Image from 'next/image'

export function AssetShow(props: { asset: Asset }) {
  return (
    <div className="flex space-x-1">
      <div className="content-center">
        <Image
          src={props.asset.image_url}
          alt={props.asset.symbol}
          width={30}
          height={30}
        />
      </div>
      <div className="flex flex-col text-sm">
        <span>{props.asset.name}</span>
        <span>{props.asset.symbol}</span>
      </div>
    </div>
  )
}
