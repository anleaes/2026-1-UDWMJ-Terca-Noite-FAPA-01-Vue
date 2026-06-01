<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ name: '', cpf: '', birth_date: '', email: '', sex: '', emergency_contact: '', health_insurance: '', allergies: null })
const histories = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:8000/api/medicalhistories/')
  histories.value = res.data
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/patients/${id}/`)
    form.value = r.data
  }
})

async function save() {
  if (id) {
    await axios.put(`http://localhost:8000/api/patients/${id}/`, form.value)
  } else {
    await axios.post('http://localhost:8000/api/patients/', form.value)
  }
  router.push('/patients')
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Paciente' : 'Novo Paciente' }}</h1>
      <div class="subtitle">Cadastro de paciente</div>
    </div>
    <RouterLink to="/patients" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <p class="section-title">Dados Pessoais</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Nome</label>
          <input type="text" v-model="form.name" required />
        </div>
        <div class="form-group">
          <label>CPF</label>
          <input type="text" v-model="form.cpf" required />
        </div>
        <div class="form-group">
          <label>Data de Nascimento</label>
          <input type="date" v-model="form.birth_date" required />
        </div>
        <div class="form-group">
          <label>Sexo</label>
          <select v-model="form.sex" required>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
        </div>
        <div class="form-group full">
          <label>E-mail</label>
          <input type="email" v-model="form.email" required />
        </div>
      </div>
      <p class="section-title" style="margin-top:24px">Dados do Paciente</p>
      <div class="form-grid">
        <div class="form-group">
          <label>Contato de Emergência</label>
          <input type="text" v-model="form.emergency_contact" />
        </div>
        <div class="form-group">
          <label>Convênio</label>
          <input type="text" v-model="form.health_insurance" />
        </div>
        <div class="form-group full">
          <label>Histórico Médico (Alergias)</label>
          <select v-model="form.allergies">
            <option :value="null">---------</option>
            <option v-for="h in histories" :key="h.id" :value="h.id">Histórico #{{ h.id }} — {{ h.notes }}</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <RouterLink to="/patients" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
