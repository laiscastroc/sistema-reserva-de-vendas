<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { RevenueByDay } from '@/types/Dashboard'

const props = defineProps<{ data: RevenueByDay[] }>()

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.data.map((point) => formatDate(point.day)),
  datasets: [
    {
      label: 'Receita',
      data: props.data.map((point) => point.revenue),
      borderColor: '#0f5257',
      backgroundColor: 'rgba(15, 82, 87, 0.12)',
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: '#0f5257',
      borderWidth: 2,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => formatCurrency(Number(context.raw)),
      },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      grid: { color: '#eef1ee' },
      ticks: { callback: (value) => formatCurrency(Number(value)) },
    },
  },
}
</script>

<template>
  <div class="chart-box">
    <Line :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-box {
  height: 280px;
  position: relative;
  overflow: hidden;
}
</style>
