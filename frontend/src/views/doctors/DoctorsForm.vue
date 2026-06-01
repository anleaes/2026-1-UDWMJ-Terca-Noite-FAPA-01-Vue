<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ name: '', cpf: '', birth_date: '', email: '', sex: '', crm: '', specialty: '' })

onMounted(async () => {
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/doctors/${id}/`)
    form.value = r.data
  }
})

async function save() {
  if (id) {
    await axios.put(`http://localhost:8000/api/doctors/${id}/`, form.value)
  } else {
    await axios.post('http://localhost:8000/api/doctors/', form.value)
  }
  router.push('/doctors')
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Médico' : 'Novo Médico' }}</h1>
      <div class="subtitle">Cadastro de médico</div>
    </div>
    <RouterLink to="/doctors" class="btn btn-ghost">← Voltar</RouterLink>
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
      <p class="section-title" style="margin-top:24px">Dados do Médico</p>
      <div class="form-grid">
        <div class="form-group">
          <label>CRM</label>
          <input type="text" v-model="form.crm" required />
        </div>
        <div class="form-group">
          <label>Especialidade</label>
          <input type="text" v-model="form.specialty" required />
        </div>
      </div>
      <div class="form-actions">
        <RouterLink to="/doctors" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
