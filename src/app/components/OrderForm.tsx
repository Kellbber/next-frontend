'use client'

import { Button, Label, TextInput } from 'flowbite-react'
import { Asset, Order, OrderType } from '../models'
import { FormEvent } from 'react'
import { socket } from '../../socket-io'
import { toast } from 'react-toastify'

export function OrderForm(props: {
  asset: Asset
  walletId: string
  type: OrderType
}) {
  const color = props.type == OrderType.BUY ? 'text-blue-700' : 'text-red-700'
  const translatedType = props.type == OrderType.BUY ? 'compra' : 'venda'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    socket.connect()
    const newOrder: Order = await socket.emitWithAck('orders/create', data)
    toast(
      `Ordem de ${translatedType} de ${newOrder.shares} ações de ${props.asset.symbol} criada com sucesso.`,
      {
        type: 'success',
        position: 'top-right'
      }
    )
  }
  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="assetId" defaultValue={props.asset._id} />
      <input type="hidden" name="walletId" defaultValue={props.walletId} />
      <input type="hidden" name="type" defaultValue={props.type} />
      <div>
        <div className="mb-2">
          <Label htmlFor="shares" value="Quantidade" className={color} />
        </div>
        <TextInput
          id="shares"
          name="shares"
          type="number"
          min={1}
          required
          defaultValue={1}
          step={1}
          color={props.type == OrderType.BUY ? 'info' : 'failure'}
        />
      </div>
      <div>
        <br />
        <div className="mb-2">
          <Label htmlFor="price" value="Preço R$" className={color} />
        </div>
        <TextInput
          id="price"
          name="price"
          type="number"
          min={1}
          required
          defaultValue={1}
          step={1}
          color={props.type == OrderType.BUY ? 'info' : 'failure'}
        />
      </div>
      <br />
      <Button
        type="submit"
        color={props.type == OrderType.BUY ? 'blue' : 'failure'}
      >
        Confirmar {translatedType}
      </Button>
    </form>
  )
}
