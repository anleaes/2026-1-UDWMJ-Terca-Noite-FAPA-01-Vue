<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const consult = ref(null)
const allCids = ref([])
const STATUS_LABELS = { AG: 'Agendada', AT: 'Em Atendimento', CO: 'Concluída', CA: 'Cancelada' }

onMounted(async () => {
  const [rc, rcids] = await Promise.all([
    axios.get(`http://localhost:8000/api/consults/${id}/`),
    axios.get('http://localhost:8000/api/cids/'),
  ])
  consult.value = rc.data
  allCids.value = rcids.data
})

const selectedCids = computed(() =>
  allCids.value.filter(c => consult.value?.cid?.includes(c.id))
)

async function remove() {
  if (!confirm('Excluir esta consulta?')) return
  await axios.delete(`http://localhost:8000/api/consults/${id}/`)
  router.push('/consults')
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
          <div class="field-value">{{ selectedCids.map(c => `${c.code} — ${c.description}`).join(', ') }}</div>
        </div>
        <div v-if="consult.anamnesis" class="form-group full">
          <label>Anamnese</label>
          <div class="field-value">{{ consult.anamnesis }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
