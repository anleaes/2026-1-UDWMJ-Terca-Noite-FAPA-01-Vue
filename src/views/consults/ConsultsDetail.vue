<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'
import { useConfirm } from '../../composables/useConfirm.js'
import { STATUS_LABELS } from '../../constants.js'

const { show } = useToast()
const { confirm } = useConfirm()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const consult = ref(null)
const allCids = ref([])

// carrega consultas e CIDs ao mesmo tempo para cruzar depois
onMounted(async () => {
  try {
    const [rc, rcids] = await Promise.all([
      axios.get(`consults/${id}/`),
      axios.get('cids/'),
    ])
    consult.value = rc.data
    allCids.value = rcids.data
  } catch {
    show('Erro ao carregar consulta.', 'error')
  }
})

// filtra apenas os CIDs que estão vinculados na consuta
const selectedCids = computed(() =>
  allCids.value.filter(c => consult.value?.cid?.includes(c.id))
)

// exclui a consulta e volta para a lista
async function remove() {
  const ok = await confirm('Excluir esta consulta?')
  if (!ok) return
  try {
    await axios.delete(`consults/${id}/`)
    show('Consulta excluída com sucesso.')
    router.push('/consults')
  } catch {
    show('Erro ao excluir consulta.', 'error')
  }
}
</script>

<template>
  <div v-if="consult">
    <div class="page-header">
      <div>
        <h1>Consulta #{{ consult.id }}</h1>
        <div class="subtitle">{{ STATUS_LABELS[consult.status] }}</div>
      </div>
      <div class="actions">
        <RouterLink to="/consults" class="btn btn-ghost">← Voltar</RouterLink>
        <RouterLink :to="`/consults/${id}/edit`" class="btn btn-ghost">Editar</RouterLink>
        <button class="btn btn-danger" @click="remove">Excluir</button>
      </div>
    </div>

    <div class="form-card">
      <p class="section-title">Dados da Consulta</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Paciente</label>
          <div class="field-value">{{ consult.patient_name }}</div>
        </div>
        <div class="form-group">
          <label>Médico</label>
          <div class="field-value">{{ consult.doctor_name }}</div>
        </div>
        <div class="form-group">
          <label>Data/Hora</label>
          <div class="field-value">{{ new Date(consult.appointment_date).toLocaleString('pt-BR') }}</div>
        </div>
        <div class="form-group">
          <label>Status</label>
          <div class="field-value">{{ STATUS_LABELS[consult.status] }}</div>
        </div>
        <div v-if="selectedCids.length" class="form-group full">
          <label>CIDs</label>
          <div class="field-value">{{ selectedCids.map(c => `${c.name} - ${c.description}`).join(', ') }}</div>
        </div>
        <div v-if="consult.anamnesis" class="form-group full">
          <label>Anamnese</label>
          <div class="field-value">{{ consult.anamnesis }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
