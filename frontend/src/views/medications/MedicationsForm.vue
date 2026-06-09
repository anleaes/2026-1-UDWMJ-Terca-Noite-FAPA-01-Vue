<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'

const { show } = useToast()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ medication: '', brand: '' })

onMounted(async () => {
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/medications/${id}/`)
    form.value = r.data
  }
})

async function save() {
  try {
    if (id) {
      await axios.put(`http://localhost:8000/api/medications/${id}/`, form.value)
    } else {
      await axios.post('http://localhost:8000/api/medications/', form.value)
    }
    show(id ? 'Medicamento atualizado com sucesso.' : 'Medicamento criado com sucesso.')
    router.push('/medications')
  } catch {
    show('Erro ao salvar medicamento.', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Medicamento' : 'Novo Medicamento' }}</h1>
      <div class="subtitle">Cadastro de medicamentos</div>
    </div>
    <RouterLink to="/medications" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <div class="form-grid">
        <div class="form-group">
          <label>Medicamento</label>
          <input type="text" v-model="form.medication" required />
        </div>
        <div class="form-group">
          <label>Marca</label>
          <input type="text" v-model="form.brand" required />
        </div>
      </div>
      <div class="form-actions">
        <RouterLink to="/medications" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
