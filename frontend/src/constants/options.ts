import type { Gender, PaymentMethod } from '@/types/Sale'

export const GENDERS: Gender[] = ['Macho', 'Fêmea']
export const PAYMENT_METHODS: PaymentMethod[] = [
  'Pix',
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Transferência',
]
export const STATUS_LABELS: Record<string, string> = {
  VENDA: 'Concluída',
  RESERVA: 'Reservada',
  CANCELADA: 'Cancelada',
}
