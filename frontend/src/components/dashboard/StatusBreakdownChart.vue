<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { STATUS_LABELS } from '@/constants/options'
import type { StatusBreakdown } from '@/types/Dashboard'

const props = defineProps<{ data: StatusBreakdown[] }>()

const colorMap: Record<string, string> = {
  VENDA: '#7fb685',
  RESERVA: '#f2a65a',
  CANCELADA: '#d65a5a',
}

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: props.data.map((item) => STATUS_LABELS[item.status] ?? item.status),
  datasets: [
    {
      data: props.data.map((item) => item.count),
      backgroundColor: props.data.map((item) => colorMap[item.status] ?? '#6b7a72'),
      borderWidth: 0,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
  },
}
</script>

<template>
  <div class="chart-box">
    <Doughnut :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-box {
  height: 260px;
}
</style>
