<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { formatCurrency } from '@/utils/formatters'
import type { TopBird } from '@/types/Dashboard'

const props = defineProps<{ data: TopBird[] }>()

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.data.map((item) => item.birdName),
  datasets: [
    {
      label: 'Receita',
      data: props.data.map((item) => item.totalRevenue),
      backgroundColor: '#F2A65A',
      borderRadius: 6,
      barThickness: 22,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => formatCurrency(Number(context.raw)),
      },
    },
  },
  scales: {
    x: {
      grid: { color: '#eef1ee' },
      ticks: { callback: (value) => formatCurrency(Number(value)) },
    },
    y: {
      grid: { display: false },
    },
  },
}
</script>
<template>
  <div class="chart-box">
    <Bar :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-box {
  height: 280px;
}
</style>