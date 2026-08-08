<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { formatCurrency } from '@/utils/formatters'
import type { RevenueByPaymentMethod } from '@/types/Dashboard'

const props = defineProps<{ data: RevenueByPaymentMethod[] }>()
const palette = ['#0f5257', '#f2a65a', '#7fb685', '#16717a', '#d65a5a']

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: props.data.map((item) => item.paymentMethod),
  datasets: [
    {
      data: props.data.map((item) => item.revenue),
      backgroundColor: props.data.map((_, index) => palette[index % palette.length]),
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
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${formatCurrency(Number(context.raw))}`,
      },
    },
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
  height: 360px;
  position: relative;
  overflow: hidden;
}
</style>