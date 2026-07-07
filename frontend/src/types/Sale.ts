export type SaleStatus = 'VENDA' | 'RESERVA' | 'CANCELADA'
export type Gender = 'Macho' | 'Fêmea'
export type PaymentMethod = 'Pix' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Transferência'

/*payload enviado ao criar uma venda/reserva.*/
export interface CreateSalePayload {
  bird_id: number
  gender: Gender
  quantity: number
  buyer_name: string
  cpf: string
  contact: string
  payment_method: PaymentMethod
  status: 'VENDA' | 'RESERVA'
  include_legalization: boolean
}

export interface Sale {
  id: number
  bird_id: number
  bird_name: string
  gender: Gender
  quantity: number
  buyer_name: string
  cpf: string
  contact: string
  payment_method: PaymentMethod
  status: SaleStatus
  unit_price: number
  legalization_total: number
  total_price: number
  created_at: string
}
