<script setup lang="ts">
import { useRouter } from 'vue-router'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()
</script>

<template>
  <EmptyState
    title="Página não encontrada"
    description="O endereço acessado não existe ou foi movido."
    action-label="Voltar ao catálogo"
    @action="router.push('/')"
  />
</template>
