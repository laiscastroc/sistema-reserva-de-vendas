<script setup lang="ts">
import { computed } from 'vue'
import { STATUS_LABELS } from '@/constants/options'
import type { SaleStatus } from '@/types/Sale'

const props = defineProps<{ status: SaleStatus }>()

const variant = computed(() => {
  if(props.status === 'VENDA') return 'badge-success'
  if(props.status === 'RESERVA') return 'badge-warning'
  return 'badge-danger'
})
</script>

<template>
  <span class="badge" :class="variant">{{ STATUS_LABELS[status] ?? status }}</span>
</template>
