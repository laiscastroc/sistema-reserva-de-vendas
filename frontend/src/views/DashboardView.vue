<script setup lang="ts">
import { onMounted, ref } from 'vue'
import '@/utils/chartSetup'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faSackDollar,
  faHandshake,
  faDove,
  faReceipt,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import KpiCard from '@/components/dashboard/KpiCard.vue'
import RevenueLineChart from '@/components/dashboard/RevenueLineChart.vue'
import TopBirdsChart from '@/components/dashboard/TopBirdsChart.vue'
import PaymentMethodChart from '@/components/dashboard/PaymentMethodChart.vue'
import StatusBreakdownChart from '@/components/dashboard/StatusBreakdownChart.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { dashboardService } from '@/services/dashboard.service'
import { ApiRequestError } from '@/services/http'
import { formatCurrency } from '@/utils/formatters'
import type { DashboardSummary } from '@/types/Dashboard'

const summary = ref<DashboardSummary | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const period = ref(30)

const periodOptions = [
  { label: '7 dias', value: 7 },
  { label: '30 dias', value: 30 },
  { label: '90 dias', value: 90 },
]

async function load() {
  loading.value = true
  error.value = null
  try {
    summary.value = await dashboardService.getSummary(period.value)
  } catch (err) {
    error.value = err instanceof ApiRequestError ? err.message : 'Erro ao carregar o dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="dashboard-view">
    <div class="header">
      <div>
        <h2>Dashboard de Vendas</h2>
        <p>Visão geral do desempenho comercial do AvesBrasil</p>
      </div>

      <div class="period-switch" role="group" aria-label="Selecionar período">
        <button
          v-for="option in periodOptions"
          :key="option.value"
          class="period-btn"
          :class="{ active: period === option.value }"
          @click="period = option.value; load()"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" label="Calculando indicadores..." />

    <EmptyState
      v-else-if="error"
      variant="error"
      title="Não foi possível carregar o dashboard"
      :description="error"
      action-label="Tentar novamente"
      @action="load"
    />

    <template v-else-if="summary">
      <section class="kpi-grid">
        <KpiCard
          label="Receita total"
          :value="formatCurrency(summary.kpis.totalRevenue)"
          :icon="faSackDollar"
          tone="primary"
        />
        <KpiCard
          label="Vendas concluídas"
          :value="String(summary.kpis.totalSales)"
          :icon="faReceipt"
          tone="sage"
        />
        <KpiCard
          label="Reservas ativas"
          :value="String(summary.kpis.totalReservations)"
          :icon="faHandshake"
          tone="accent"
        />
        <KpiCard
          label="Ticket médio"
          :value="formatCurrency(summary.kpis.averageTicket)"
          :icon="faSackDollar"
          tone="primary"
        />
        <KpiCard
          label="Aves vendidas"
          :value="String(summary.kpis.birdsSold)"
          :icon="faDove"
          tone="sage"
        />
      </section>

      <section class="grid-2">
        <div class="panel">
          <h3>Receita nos últimos {{ period }} dias</h3>
          <RevenueLineChart :data="summary.revenueByDay" />
        </div>
        <div class="panel">
          <h3>Aves mais vendidas</h3>
          <TopBirdsChart v-if="summary.topBirds.length" :data="summary.topBirds" />
          <EmptyState v-else title="Sem vendas no período" />
        </div>
      </section>

      <section class="grid-3">
        <div class="panel">
          <h3>Receita por forma de pagamento</h3>
          <PaymentMethodChart
            v-if="summary.revenueByPaymentMethod.length"
            :data="summary.revenueByPaymentMethod"
          />
          <EmptyState v-else title="Sem dados no período" />
        </div>

        <div class="panel">
          <h3>Vendas por status</h3>
          <StatusBreakdownChart v-if="summary.statusBreakdown.length" :data="summary.statusBreakdown" />
          <EmptyState v-else title="Sem registros" />
        </div>

        <div class="panel">
          <h3>
            <FontAwesomeIcon :icon="faTriangleExclamation" class="warn-icon" />
            Estoque baixo
          </h3>
          <ul v-if="summary.lowStockBirds.length" class="low-stock-list">
            <li v-for="bird in summary.lowStockBirds" :key="bird.id">
              <span>{{ bird.name }}</span>
              <strong :class="{ zero: bird.stock === 0 }">{{ bird.stock }} un.</strong>
            </li>
          </ul>
          <EmptyState v-else title="Estoque saudável" description="Nenhuma ave abaixo do limite." />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.header p {
  color: var(--color-muted);
  margin-top: var(--space-2);
}

.period-switch {
  display: inline-flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 4px;
}

.period-btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-muted);
  cursor: pointer;
}

.period-btn.active {
  background: var(--color-primary);
  color: #fff;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.panel h3 {
  font-size: 1rem;
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: 8px;
}

.warn-icon {
  color: var(--color-accent-dark);
}

.low-stock-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.low-stock-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}

.low-stock-list strong {
  color: var(--color-accent-dark);
}

.low-stock-list strong.zero {
  color: var(--color-danger-dark);
}

@media (max-width: 900px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
