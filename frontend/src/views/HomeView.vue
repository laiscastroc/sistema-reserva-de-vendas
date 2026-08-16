<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BirdCard from '@/components/BirdCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { birdsService } from '@/services/birds.service'
import { useAsyncData } from '@/composables/useAsyncData'
import type { Bird } from '@/types/Bird'

const { data: birds, loading, error, execute } = useAsyncData<Bird[]>(() => birdsService.getAll())

const search = ref('')
const selectedType = ref('')

const types = computed(() => {
  if(!birds.value) return []
  return [...new Set(birds.value.map((bird) => bird.type))].sort()
})

const filteredBirds = computed(() => {
  if(!birds.value) return []

  return birds.value.filter((bird) => {
    const matchesSearch = bird.name.toLowerCase().includes(search.value.trim().toLowerCase())
    const matchesType = selectedType.value ? bird.type === selectedType.value : true
    return matchesSearch && matchesType
  })
})

onMounted(execute)
</script>

<template>
  <div class="home-view">
    <section class="intro">
      <h2>Bem-vindo ao AvesBrasil</h2>
      <p>Explore nosso catálogo de aves legalizadas disponíveis para registrar compra ou reserva do cliente.</p>
    </section>

    <section v-if="birds && birds.length" class="filters">
      <input
        v-model="search"
        type="search"
        placeholder="Buscar pelo nome da ave..."
        aria-label="Buscar ave pelo nome"
      />
      <select v-model="selectedType" aria-label="Filtrar por tipo">
        <option value="">Todos os tipos</option>
        <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
      </select>
    </section>

    <LoadingSpinner v-if="loading" label="Carregando catálogo..." />

    <EmptyState
      v-else-if="error"
      variant="error"
      title="Não foi possível carregar o catálogo"
      :description="error"
      action-label="Tentar novamente"
      @action="execute"
    />

    <EmptyState
      v-else-if="filteredBirds.length === 0"
      title="Nenhuma ave encontrada"
      description="Tente ajustar a busca ou o filtro selecionado."
    />

    <div v-else class="grid">
      <BirdCard v-for="bird in filteredBirds" :key="bird.id" :bird="bird" />
    </div>
  </div>
</template>

<style scoped>

.home-view h2{
   color: #006400;
}
.intro {
  margin-bottom: var(--space-6);
}

.intro h2 {
  font-size: 1.7rem;
}

.intro p {
  color: var(--color-muted);
  margin-top: var(--space-2);
}

.filters {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: 0.9rem;
  min-width: 220px;
  flex: 1;
}

.filters input:focus,
.filters select:focus {
  border-color: #006400;
  outline: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-5);
}
</style>
