<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ consult: '', patient: '', doctor: '', instructions: '' })
const consults = ref([])
const patients = ref([])
const doctors = ref([])

onMounted(async () => {
  const [rc, rp, rd] = await Promise.all([
    axios.get('http://localhost:8000/api/consults/'),
    axios.get('http://localhost:8000/api/patients/'),
    axios.get('http://localhost:8000/api/doctors/'),
  ])
  consults.value = rc.data
  patients.value = rp.data
  doctors.value = rd.data
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/prescriptions/${id}/`)
    form.value = r.data
  }
})

async function save() {
  if (id) {
    await axios.put(`http://localhost:8000/api/prescriptions/${id}/`, form.value)
  } else {
    await axios.post('http://localhost:8000/api/prescriptions/', form.value)
  }
  router.push('/prescriptions')
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Receita' : 'Nova Receita' }}</h1>
      <div class="subtitle">Emissão de receita médica</div>
    </div>
    <RouterLink to="/prescriptions" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <div class="form-grid">
        <div class="form-group full">
          <label>Consulta</label>
          <select v-model="form.consult" required>
            <option value="">---------</option>
            <option v-for="c in consults" :key="c.id" :value="c.id">Consulta #{{ c.id }}</option>
          </select>
        </div>
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
        <div class="form-group full">
          <label>Instruções</label>
          <textarea v-model="form.instructions"></textarea>
        </div>
      </div>
      <div class="form-actions">
        <RouterLink to="/prescriptions" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
