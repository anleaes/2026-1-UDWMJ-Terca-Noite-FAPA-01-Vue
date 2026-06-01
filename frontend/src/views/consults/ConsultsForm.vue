<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ patient: '', doctor: '', appointment_date: '', status: 'AG', cid: [], anamnesis: '' })
const patients = ref([])
const doctors = ref([])
const cids = ref([])

onMounted(async () => {
  const [rp, rd, rc] = await Promise.all([
    axios.get('http://localhost:8000/api/patients/'),
    axios.get('http://localhost:8000/api/doctors/'),
    axios.get('http://localhost:8000/api/cids/'),
  ])
  patients.value = rp.data
  doctors.value = rd.data
  cids.value = rc.data
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/consults/${id}/`)
    form.value = r.data
  }
})

async function save() {
  if (id) {
    await axios.put(`http://localhost:8000/api/consults/${id}/`, form.value)
  } else {
    await axios.post('http://localhost:8000/api/consults/', form.value)
  }
  router.push('/consults')
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Consulta' : 'Nova Consulta' }}</h1>
      <div class="subtitle">Agendamento e registro de consulta</div>
    </div>
    <RouterLink to="/consults" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <div class="form-grid">
        <div class="form-group">
          <label>Paciente</label>
          <select v-model="form.patient" required>
            <option value="">---------</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Médico</label>
          <select v-model="form.doctor" required>
            <option value="">---------</option>
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Data/Hora</label>
          <input type="datetime-local" v-model="form.appointment_date" required />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="AG">Agendada</option>
            <option value="AT">Em Atendimento</option>
            <option value="CO">Concluída</option>
            <option value="CA">Cancelada</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Anamnese</label>
          <textarea v-model="form.anamnesis"></textarea>
        </div>
      </div>
      <div class="form-actions">
        <RouterLink to="/consults" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
