<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'

const { show } = useToast()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ name: '', description: '' })

onMounted(async () => {
  if (id) {
    try {
      const r = await axios.get(`cids/${id}/`)
      form.value = r.data
    } catch {
      show('Erro ao carregar CID.', 'error')
    }
  }
})

async function save() {
  try {
    if (id) {
      await axios.put(`cids/${id}/`, form.value)
    } else {
      await axios.post('cids/', form.value)
    }
    show(id ? 'CID atualizado com sucesso.' : 'CID criado com sucesso.')
    router.push('/cids')
  } catch {
    show('Erro ao salvar CID.', 'error')
  }
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
          <label>Código</label>
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
