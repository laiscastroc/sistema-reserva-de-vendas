<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SaleForm from '@/components/SaleForm.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { birdsService } from '@/services/birds.service'
import { useAsyncData } from '@/composables/useAsyncData'
import type { Bird } from '@/types/Bird'

const route = useRoute()
const birdId = Number(route.params.id)

const { data: bird, loading, error, execute } = useAsyncData<Bird>(() => birdsService.getById(birdId))

onMounted(execute)
</script>

<template>
  <div class="register-view">
    <LoadingSpinner v-if="loading" label="Carregando ave selecionada..." />

    <EmptyState
      v-else-if="error"
      variant="error"
      title="Não foi possível carregar esta ave"
      :description="error"
      action-label="Tentar novamente"
      @action="execute"
    />

    <SaleForm v-else-if="bird" :bird="bird" />

    <EmptyState
      v-else
      title="Ave não encontrada"
      description="Selecione uma ave no catálogo para registrar a compra."
    />
  </div>
</template>

<style scoped>
.register-view {
  max-width: 780px;
  margin: 0 auto;
}
</style>
