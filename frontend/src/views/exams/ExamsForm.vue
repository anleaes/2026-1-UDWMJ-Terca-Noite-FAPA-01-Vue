<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from '../../composables/useToast.js'

const { show } = useToast()
const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ consult: '', exam_type: '', status: 'SO' })
const consults = ref([])

onMounted(async () => {
  try {
    const rc = await axios.get('consults/')
    consults.value = rc.data
    if (id) {
      const r = await axios.get(`exams/${id}/`)
      form.value = r.data
    }
  } catch {
    show('Erro ao carregar dados.', 'error')
  }
})

async function save() {
  try {
    if (id) {
      await axios.put(`exams/${id}/`, form.value)
    } else {
      await axios.post('exams/', form.value)
    }
    show(id ? 'Exame atualizado com sucesso.' : 'Exame criado com sucesso.')
    router.push('/exams')
  } catch {
    show('Erro ao salvar exame.', 'error')
  }
}
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ id ? 'Editar Exame' : 'Novo Exame' }}</h1>
      <div class="subtitle">Registro de exame médico</div>
    </div>
    <RouterLink to="/exams" class="btn btn-ghost">← Voltar</RouterLink>
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
          <label>Tipo de Exame</label>
          <input type="text" v-model="form.exam_type" required />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="SO">Solicitado</option>
            <option value="AT">Em Andamento</option>
            <option value="CO">Concluído</option>
            <option value="CA">Cancelado</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" @click="router.back()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>
