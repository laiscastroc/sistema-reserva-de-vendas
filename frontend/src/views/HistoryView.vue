<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { salesService } from '@/services/sales.service'
import { ApiRequestError } from '@/services/http'
import { useToast } from '@/composables/useToast'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import type { Sale, SaleStatus } from '@/types/Sale'
import type { PaginationMeta } from '@/types/Pagination'

const toast = useToast()

const sales = ref<Sale[]>([])
const meta = ref<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 })
const loading = ref(false)
const error = ref<string | null>(null)

const filters = reactive<{ status: SaleStatus | ''; page: number }>({ status: '', page: 1 })

const cancelDialog = reactive<{ open: boolean; saleId: number | null }>({ open: false, saleId: null })
const cancelling = ref(false)

async function loadSales() {
  loading.value = true
  error.value = null
  try {
    const response = await salesService.list({
      page: filters.page,
      limit: meta.value.limit,
      status: filters.status || undefined,
    })
    sales.value = response.data
    meta.value = response.meta
  } catch (err) {
    error.value = err instanceof ApiRequestError ? err.message : 'Erro ao carregar o histórico.'
  } finally {
    loading.value = false
  }
}

function goToPage(page: number) {
  if (page < 1 || page > meta.value.totalPages) return
  filters.page = page
}

function openCancelDialog(saleId: number) {
  cancelDialog.saleId = saleId
  cancelDialog.open = true
}

async function confirmCancel() {
  if(!cancelDialog.saleId) return
  cancelling.value = true
  try {
    await salesService.cancelReservation(cancelDialog.saleId)
    toast.success('Reserva cancelada e estoque devolvido ao catálogo.')
    cancelDialog.open = false
    await loadSales()
  } catch (err) {
    toast.error(err instanceof ApiRequestError ? err.message : 'Não foi possível cancelar a reserva.')
  } finally {
    cancelling.value = false
  }
}

watch(() => [filters.status, filters.page], loadSales)
onMounted(loadSales)
</script>

<template>
  <div class="history-view">
    <div class="header">
      <h2>Histórico de Vendas</h2>
      <span class="count">{{ meta.total }} registro(s)</span>
    </div>

    <p class="privacy-note">
      Por padrão de privacidade, CPF e telefone não são exibidos e o nome do comprador aparece
      parcialmente oculto.
    </p>

    <div class="filters">
      <select v-model="filters.status" aria-label="Filtrar por status">
        <option value="">Todos os status</option>
        <option value="VENDA">Concluídas</option>
        <option value="RESERVA">Reservas</option>
        <option value="CANCELADA">Canceladas</option>
      </select>
    </div>
    <LoadingSpinner v-if="loading" label="Carregando histórico..." />

    <EmptyState
      v-else-if="error"
      variant="error"
      title="Não foi possível carregar o histórico"
      :description="error"
      action-label="Tentar novamente"
      @action="loadSales"
    />

    <EmptyState
      v-else-if="sales.length === 0"
      title="Nenhum registro encontrado"
      description="Ainda não há vendas ou reservas para os filtros selecionados."
    />

    <template v-else>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Ave</th>
              <th>Qtd</th>
              <th>Comprador</th>
              <th>Pagamento</th>
              <th>Total</th>
              <th>Status</th>
              <th class="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale.id">
              <td>{{ formatDateTime(sale.created_at) }}</td>
              <td><strong>{{ sale.bird_name }}</strong></td>
              <td>{{ sale.quantity }}</td>
              <td>
                <span class="masked" title="Nome parcialmente oculto por privacidade">
                  {{ sale.buyer_name }}
                </span>
              </td>
              <td><span class="badge badge-neutral">{{ sale.payment_method }}</span></td>
              <td class="total">{{ formatCurrency(sale.total_price) }}</td>
              <td><StatusBadge :status="sale.status" /></td>
              <td class="actions-col">
                <button
                  v-if="sale.status === 'RESERVA'"
                  class="btn btn-outline btn-sm"
                  @click="openCancelDialog(sale.id)"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="meta.totalPages > 1">
        <button class="btn btn-outline btn-sm" :disabled="meta.page <= 1" @click="goToPage(meta.page - 1)">
          Anterior
        </button>
        <span>Página {{ meta.page }} de {{ meta.totalPages }}</span>
        <button
          class="btn btn-outline btn-sm"
          :disabled="meta.page >= meta.totalPages"
          @click="goToPage(meta.page + 1)"
        >
          Próxima
        </button>
      </div>
    </template>

    <ConfirmDialog
      :open="cancelDialog.open"
      title="Cancelar reserva?"
      description="O estoque da ave será devolvido ao catálogo. Essa ação não pode ser desfeita."
      confirm-label="Sim, cancelar"
      cancel-label="Voltar"
      danger
      @confirm="confirmCancel"
      @cancel="cancelDialog.open = false"
    />
  </div>
</template>

<style scoped>
.header h2 {
  color: var(--color-primary);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.count {
  background: #eef1ee;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.privacy-note {
  font-size: 0.82rem;
  color: var(--color-muted);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-4);
}

.filters {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.filters select {
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
}

.table-wrapper {
  overflow-x: auto;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

thead {
  background: #f1f5f2;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.88rem;
}

tbody tr {
  border-bottom: 1px solid var(--color-border);
}

.masked {
  font-variant-numeric: tabular-nums;
  color: var(--color-ink);
  letter-spacing: 0.02em;
}

.total {
  color: var(--color-primary);
  font-weight: 700;
}

.actions-col button {
  color: var(--color-primary)
}

button.btn-outline {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

button.btn-outline:hover {
  border-color: var(--color-primary-hover);
  color: var(--color-primary);
}

.actions-col {
  text-align: right;
}

.btn-sm {
  padding: 8px 14px;
  font-size: 0.82rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-top: var(--space-5);
  color: var(--color-muted);
  font-size: 0.88rem;
}
</style>
