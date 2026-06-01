<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ name: '', description: '' })

onMounted(async () => {
  if (id) {
    const r = await axios.get(`http://localhost:8000/api/cids/${id}/`)
    form.value = r.data
  }
})

async function save() {
  if (id) {
    await axios.put(`http://localhost:8000/api/cids/${id}/`, form.value)
  } else {
    await axios.post('http://localhost:8000/api/cids/', form.value)
  }
  router.push('/cids')
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar CID' : 'Novo CID' }}</h1>
      <div class="subtitle">Cadastro de Classificação Internacional de Doenças</div>
    </div>
    <RouterLink to="/cids" class="btn btn-ghost">← Voltar</RouterLink>
  </div>
  <div class="form-card">
    <form @submit.prevent="save">
      <div class="form-grid">
        <div class="form-group full">
          <label>Nome</label>
          <input type="text" v-model="form.name" required />
        </div>
        <div class="form-group full">
          <label>Descrição</label>
          <textarea v-model="form.description" required></textarea>
        </div>
      </div>
      <div class="form-actions">
        <RouterLink to="/cids" class="btn btn-ghost">Cancelar</RouterLink>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
