<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ allergies: '', family_history: '', patient_name: '' })

onMounted(async () => {
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/medicalhistories/${id}/`)
    form.value = r.data
  }
})

async function save() {
  if (id) {
    await axios.put(`http://localhost:8000/api/medicalhistories/${id}/`, form.value)
  } else {
    await axios.post('http://localhost:8000/api/medicalhistories/', form.value)
  }
  router.push('/medicalhistories')
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Histórico' : 'Novo Histórico Médico' }}</h1>
      <div class="subtitle">Registro de histórico médico</div>
    </div>
    <RouterLink to="/medicalhistories" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <div class="form-grid">
        <div class="form-group full">
          <label>Alergias</label>
          <textarea v-model="form.allergies" required></textarea>
        </div>
        <div class="form-group full">
          <label>Histórico Familiar</label>
          <textarea v-model="form.family_history" required></textarea>
        </div>
        <div class="form-group full">
          <label>Nome do Paciente</label>
          <input type="text" v-model="form.patient_name" required />
        </div>
      </div>
      <div class="form-actions">
        <RouterLink to="/medicalhistories" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
