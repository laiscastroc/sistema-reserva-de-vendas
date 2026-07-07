<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { salesService } from '@/services/sales.service'
import { ApiRequestError } from '@/services/http'
import { useToast } from '@/composables/useToast'
import { maskCpfInput, maskPhoneInput } from '@/utils/masks'
import { isValidCPF, isValidName, isValidPhone } from '@/utils/validators'
import { formatCurrency } from '@/utils/formatters'
import { GENDERS, PAYMENT_METHODS } from '@/constants/options'
import type { Bird } from '@/types/Bird'
import type { Gender, PaymentMethod } from '@/types/Sale'

const props = defineProps<{ bird: Bird }>()
const router = useRouter()
const toast = useToast()

const form = reactive({
  buyerName: '',
  cpf: '',
  contact: '',
  quantity: 1,
  gender: 'Macho' as Gender,
  paymentMethod: 'Pix' as PaymentMethod,
  includeLegalization: true,
})

const errors = reactive<Record<string, string>>({})
const submitting = ref(false)

const maxQuantity = computed(() => Math.max(props.bird.stock, 0))

function increaseQty() {
  if (form.quantity < maxQuantity.value) form.quantity++
}
function decreaseQty() {
  if (form.quantity > 1) form.quantity--
}

function onCpfInput(event: Event) {
  form.cpf = maskCpfInput((event.target as HTMLInputElement).value)
}
function onContactInput(event: Event) {
  form.contact = maskPhoneInput((event.target as HTMLInputElement).value)
}

const subtotal = computed(() => props.bird.price * form.quantity)
const legalizationTotal = computed(() =>
  form.includeLegalization ? props.bird.legalization_price * form.quantity : 0
)
const total = computed(() => subtotal.value + legalizationTotal.value)

function validate(): boolean {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!isValidName(form.buyerName)) {
    errors.buyerName = 'Informe o nome completo (mínimo 3 letras).'
  }
  if (!isValidCPF(form.cpf)) {
    errors.cpf = 'CPF inválido. Confira os números digitados.'
  }
  if (!isValidPhone(form.contact)) {
    errors.contact = 'Informe um telefone válido com DDD.'
  }
  if (form.quantity < 1 || form.quantity > maxQuantity.value) {
    errors.quantity = `Quantidade deve ser entre 1 e ${maxQuantity.value}.`
  }

  return Object.keys(errors).length === 0
}

async function submit(status: 'VENDA' | 'RESERVA') {
  if (!validate()) {
    toast.error('Verifique os campos destacados no formulário.')
    return
  }

  submitting.value = true
  try {
    await salesService.create({
      bird_id: props.bird.id,
      gender: form.gender,
      quantity: form.quantity,
      buyer_name: form.buyerName,
      cpf: form.cpf,
      contact: form.contact,
      payment_method: form.paymentMethod,
      status,
      include_legalization: form.includeLegalization,
    })

    toast.success(
      status === 'VENDA' ? 'Venda registrada com sucesso!' : 'Reserva registrada com sucesso!'
    )
    router.push('/history')
  } catch (error) {
    if (error instanceof ApiRequestError) {
      toast.error(error.message)
    } else {
      toast.error('Não foi possível concluir o registro. Tente novamente.')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <div class="header">
      <h2>Registrar compra</h2>
      <p>Preencha os dados para concluir a venda ou reserva.</p>
    </div>

    <div class="bird-card">
      <img :src="bird.image_url" :alt="`Foto de um ${bird.name}`" />
      <div class="bird-info">
        <h3>{{ bird.name }}</h3>
        <small>{{ bird.scientific_name }}</small>
        <span>{{ formatCurrency(bird.price) }}</span>
      </div>
    </div>

    <form class="sale-form" @submit.prevent>
      <div class="row">
        <div class="field">
          <label for="quantity">Quantidade</label>
          <div class="qty-box">
            <button type="button" aria-label="Diminuir quantidade" @click="decreaseQty">−</button>
            <span id="quantity">{{ form.quantity }}</span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              :disabled="form.quantity >= maxQuantity"
              @click="increaseQty"
            >
              +
            </button>
          </div>
          <span class="error-text" v-if="errors.quantity">{{ errors.quantity }}</span>
          <span class="hint">{{ maxQuantity }} em estoque</span>
        </div>

        <div class="field">
          <label for="gender">Gênero</label>
          <select id="gender" v-model="form.gender">
            <option v-for="gender in GENDERS" :key="gender" :value="gender">{{ gender }}</option>
          </select>
        </div>
      </div>

      <div class="legalization">
        <div>
          <strong>Taxa de legalização</strong>
          <p>{{ formatCurrency(bird.legalization_price) }} por unidade</p>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="form.includeLegalization" />
          <span>Incluir</span>
        </label>
      </div>

      <div class="field">
        <label for="buyer_name">Nome do comprador</label>
        <input
          id="buyer_name"
          v-model="form.buyerName"
          :class="{ 'has-error': errors.buyerName }"
          placeholder="Digite seu nome completo"
          autocomplete="name"
        />
        <span class="error-text" v-if="errors.buyerName">{{ errors.buyerName }}</span>
      </div>

      <div class="row">
        <div class="field">
          <label for="cpf">CPF</label>
          <input
            id="cpf"
            :value="form.cpf"
            :class="{ 'has-error': errors.cpf }"
            placeholder="Digite um CPF válido"
            inputmode="numeric"
            maxlength="14"
            @input="onCpfInput"
          />
          <span class="error-text" v-if="errors.cpf">{{ errors.cpf }}</span>
        </div>

        <div class="field">
          <label for="contact">Telefone</label>
          <input
            id="contact"
            :value="form.contact"
            :class="{ 'has-error': errors.contact }"
            placeholder="Digite um telefone válido"
            inputmode="numeric"
            maxlength="15"
            @input="onContactInput"
          />
          <span class="error-text" v-if="errors.contact">{{ errors.contact }}</span>
        </div>
      </div>

      <div class="field">
        <label for="payment">Forma de pagamento</label>
        <select id="payment" v-model="form.paymentMethod">
          <option v-for="method in PAYMENT_METHODS" :key="method" :value="method">{{ method }}</option>
        </select>
      </div>

      <p class="privacy-note">
        Seus dados pessoais (CPF, telefone e nome completo) ficam armazenados apenas para o registro
        legal da venda e não são exibidos por completo na tela de histórico.
      </p>

      <div class="summary">
        <div>
          <span>Subtotal</span>
          <strong>{{ formatCurrency(subtotal) }}</strong>
        </div>
        <div>
          <span>Legalização</span>
          <strong>{{ formatCurrency(legalizationTotal) }}</strong>
        </div>
        <div class="total">
          <span>Total</span>
          <strong>{{ formatCurrency(total) }}</strong>
        </div>
      </div>

      <div class="actions">
        <button
          type="button"
          class="btn btn-outline"
          :disabled="submitting"
          @click="submit('RESERVA')"
        >
          Reservar
        </button>
        <button type="button" class="btn btn-primary" :disabled="submitting" @click="submit('VENDA')">
          {{ submitting ? 'Registrando...' : 'Registrar venda' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

.field label {
  color: #006400;
}

.btn-primary {
  background-color: #006400;
}

.btn-primary:hover {
  background-color:  #417619;
}

.actions .btn-outline {
  color: #006400;
  border-color: #006400;
}

.bird-info h3{
  color: #006400;
}

.form-container {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.header h2{
  color: #006400;
}

.header {
  margin-bottom: var(--space-5);
}

.header p {
  color: var(--color-muted);
  margin-top: 4px;
}

.bird-card {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #d1fae5;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
}

.bird-card img {
  width: 84px;
  height: 84px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.bird-info small {
  color: var(--color-muted);
  display: block;
  margin: 4px 0;
}

.bird-info span {
  color: #006400;
  font-size: 1.4rem;
  font-weight: 700;
}

.sale-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.row {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.row .field {
  flex: 1;
  min-width: 200px;
}

.qty-box {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.qty-box button {
  width: 38px;
  height: 38px;
  border: none;
  background: #f3f4f6;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.1rem;
}

.qty-box button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint {
  font-size: 0.78rem;
  color: var(--color-muted);
}

.legalization {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fffbeb;
  border: 1px solid #fde68a;
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.legalization p {
  margin: 4px 0 0;
  color: var(--color-muted);
}

.switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
 
}

.privacy-note {
  font-size: 0.78rem;
  color: var(--color-muted);
  background: var(--color-bg);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--color-border);
}

.summary {
  background: var(--color-bg);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.summary div {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.total {
  font-size: 1.2rem;
  color: #006400;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: var(--space-3);
}

.actions .btn {
  
  flex: 1;
}

</style>
