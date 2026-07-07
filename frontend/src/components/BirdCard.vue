<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleCheck, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/utils/formatters'
import type { Bird } from '@/types/Bird'

const props = defineProps<{ bird: Bird }>()
const router = useRouter()
const isAvailable = computed(() => props.bird.stock > 0)
const isLowStock = computed(() => props.bird.stock > 0 && props.bird.stock <= 3)

function handleRegister() {
  if(!isAvailable.value) return
  router.push(`/register/${props.bird.id}`)
}
</script>

<template>
  <article class="card" :class="{ 'is-unavailable': !isAvailable }">
    <div class="image">
      <img :src="bird.image_url" :alt="`Foto de um ${bird.name}`" loading="lazy" />
      <span class="badge-legal">
        <FontAwesomeIcon :icon="faCircleCheck" />
        Legalizado
      </span>
      <span v-if="!isAvailable" class="badge-sold-out">Esgotado</span>
    </div>

    <div class="info">
      <p class="type">{{ bird.type }}</p>
      <h2 class="name">{{ bird.name }}</h2>
      <p class="scientific">{{ bird.scientific_name }}</p>

      <p class="price">{{ formatCurrency(bird.price) }}</p>
      <p class="tax">+ Taxa de legalização: {{ formatCurrency(bird.legalization_price) }}</p>

      <p v-if="isAvailable" class="stock" :class="{ low: isLowStock }">
        <FontAwesomeIcon :icon="faBoxOpen" />
        {{ isLowStock ? `Últimas ${bird.stock} unidades` : `${bird.stock} disponíveis` }}
      </p>

      <button class="btn btn-primary btn-register" :disabled="!isAvailable" @click="handleRegister">
        {{ isAvailable ? 'Registrar compra' : 'Indisponível' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.card:not(.is-unavailable):hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card.is-unavailable .image img {
  filter: grayscale(0.6);
  opacity: 0.7;
}

.image {
  position: relative;
  height: 190px;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-legal {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #006400;
  color: #fff;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.badge-sold-out {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--color-danger);
  color: #fff;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.info {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.type {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.7rem;
  color: var(--color-muted);
  font-weight: 700;
  margin: 0 0 4px;
}

.name {
  font-size: 1.3rem;
  color: #006400;
}

.scientific {
  font-size: 0.85rem;
  color: var(--color-muted);
  font-style: italic;
  margin-top: 4px;
}

.price {
  margin-top: var(--space-3);
  font-size: 1.4rem;
  color:#006400;
  font-weight: 700;
  font-family: var(--font-display);
}

.tax {
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--color-muted);
}

.stock {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-3);
  font-size: 0.8rem;
  color: #006400;
  font-weight: 600;
}

.stock.low {
  color: #ff8c00;
}

.btn-register {
  margin-top: var(--space-4);
  width: 100%;
  background-color: #006400;
}

.btn-register:hover{
  background-color: #417619;
}

</style>
